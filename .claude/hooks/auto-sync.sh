#!/usr/bin/env bash
# Auto-sync a SATELLITE repo after every request (Stop hook). Satellite variant of the
# monorepo's auto-sync.sh — this canonical copy lives in the monorepo at
# aios/.claude/hooks/auto-sync-satellite.sh; each satellite carries a tracked copy at
# <repo>/.claude/hooks/auto-sync.sh wired via its own .claude/settings.json (2026-07-16).
#
# Differences from the monorepo hook (deliberate — don't "fix" them to match):
#   - pushes the CURRENT branch to its own upstream (origin HEAD:<branch>), never
#     re-lands on main — satellites like website-cloner work on long-lived clone/*
#     branches on purpose; the push-to-main doctrine is monorepo-only.
#   - logs + pause switch live inside the shared .git dir (never tracked) instead of
#     a gitignored tmp/ — satellites don't all have one.
#   - no remote configured → commits locally and stops (local-only experiment repos).
#
# Same guarantees as the monorepo hook: FAIL-OPEN (any failure exits 0, retries next
# request), atomic mkdir lock across concurrent sessions, rebase-conflict aborts and
# never pushes, NEVER --force, never clobbers remote history.

HOOK_DIR=$(cd -- "$(dirname -- "$0")" 2>/dev/null && pwd) || exit 0
REPO=$(git -C "$HOOK_DIR/../.." rev-parse --show-toplevel 2>/dev/null) || exit 0
cd "$REPO" 2>/dev/null || exit 0

GIT_COMMON=$(git rev-parse --git-common-dir 2>/dev/null) || exit 0
case "$GIT_COMMON" in /*) ;; *) GIT_COMMON="$REPO/$GIT_COMMON" ;; esac
LOG="$GIT_COMMON/auto-sync.log"
log() { printf '%s %s\n' "$(date '+%F %T%z')" "$1" >> "$LOG" 2>/dev/null; }

# machine-local pause switch (inside .git -> never tracked, never syncs)
[ -f "$GIT_COMMON/auto-sync.pause" ] && { log "PAUSED (auto-sync.pause present) — skipped"; exit 0; }

# serialize concurrent sessions/worktrees via an atomic mkdir lock in the COMMON git dir;
# a >2-min-old lock is stale (crashed run) and gets cleared — test find's OUTPUT, not exit code
LOCK="$GIT_COMMON/auto-sync.lock.d"
if [ -d "$LOCK" ] && [ -n "$(find "$LOCK" -maxdepth 0 -mmin +2 2>/dev/null)" ]; then
  rmdir "$LOCK" 2>/dev/null
fi
mkdir "$LOCK" 2>/dev/null || exit 0
trap 'rmdir "$LOCK" 2>/dev/null' EXIT INT TERM

BRANCH=$(git branch --show-current 2>/dev/null)
[ -n "$BRANCH" ] || { log "detached HEAD — skipped"; exit 0; }

# --- commit local changes (everything; private repos, sync-everything policy) ---
if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
  git add -A 2>/dev/null
  if git commit -q -m "auto-sync: $(date '+%F %T%z') [$BRANCH]" 2>>"$LOG"; then
    log "committed working-tree changes on $BRANCH"
  fi
fi

# --- no remote? local-only repo: committing is all we can do ---
if ! git remote get-url origin >/dev/null 2>&1; then
  log "no origin remote — committed locally only"; exit 0
fi

# --- absorb remote work on THIS branch (if it exists there yet), then push ---
if git fetch -q origin "$BRANCH" 2>>"$LOG"; then
  if ! git rebase FETCH_HEAD >>"$LOG" 2>&1; then
    git rebase --abort 2>/dev/null
    log "REBASE CONFLICT vs origin/$BRANCH — left for manual resolution; NOT pushing"
    exit 0
  fi
fi  # fetch failing = branch not on remote yet, or offline — the push below decides

if git push -u origin "HEAD:$BRANCH" >>"$LOG" 2>&1; then
  log "pushed → origin/$BRANCH"
else
  log "PUSH FAILED (offline or rejected) — will retry next request"
fi
exit 0
