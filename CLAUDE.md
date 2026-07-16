# CLAUDE.md - AI Assistant Development Guide

## Project Overview

**Syren** is an AI-powered influencer image generator MVP built as a full-stack web application. The application allows users to generate AI-created influencer images using text prompts, with a credit-based system and subscription tiers.

**Project Name:** Syren - AI Influencer Generator MVP
**Version:** 0.1.0
**License:** MIT

### Key Features
- User authentication with JWT tokens
- Credit-based AI image generation system
- Real-time generation status polling
- Subscription tiers (Free, Pro)
- Payment webhook integration (CCBill/Segpay)
- Mobile-first responsive design
- Background job processing with Celery
- RunPod/ComfyUI integration for AI generation

---

## Architecture & Tech Stack

### High-Level Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Next.js   │◄────►│   FastAPI   │◄────►│  Celery     │
│  Frontend   │      │   Backend   │      │  Worker     │
│  (Port 3000)│      │  (Port 8000)│      │             │
└─────────────┘      └─────────────┘      └─────────────┘
                            │                     │
                            ▼                     ▼
                     ┌─────────────┐      ┌─────────────┐
                     │ PostgreSQL  │      │    Redis    │
                     │  Database   │      │   Queue     │
                     │  (Port 5432)│      │ (Port 6379) │
                     └─────────────┘      └─────────────┘
```

### Technology Stack

#### Frontend
- **Framework:** Next.js 15.0.0 (App Router)
- **Language:** TypeScript 5.3.0
- **State Management:** Zustand 4.4.7
- **Styling:** Tailwind CSS 3.4.0
- **UI Components:** Lucide React (icons)
- **Build Tools:** PostCSS, Autoprefixer

#### Backend
- **Framework:** FastAPI 0.109.0
- **Language:** Python 3.x
- **ASGI Server:** Uvicorn 0.27.0
- **Database ORM:** SQLAlchemy 2.0.25
- **Database Driver:** psycopg2-binary 2.9.9
- **Authentication:** python-jose (JWT), passlib (password hashing)
- **Validation:** Pydantic 2.5.3
- **HTTP Client:** httpx 0.26.0

#### Worker
- **Task Queue:** Celery 5.3.6
- **Message Broker:** Redis 5.0.1
- **AI Services:**
  - OpenAI 1.12.0 (text generation)
  - Replicate 0.22.0 (image generation)
  - RunPod API (ComfyUI workflows)
- **Image Processing:** Pillow 10.2.0

#### Infrastructure
- **Database:** PostgreSQL 16
- **Cache/Queue:** Redis Alpine
- **Containerization:** Docker & Docker Compose
- **Orchestration:** docker-compose.yml

---

## Directory Structure

```
AI-OFM-WEB-APP/
├── .env.example              # Environment variables template
├── .gitignore               # Git ignore rules
├── README.md                # Project documentation
├── docker-compose.yml       # Docker orchestration
│
├── frontend/                # Next.js 15 frontend application
│   ├── Dockerfile
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── postcss.config.js
│   └── src/
│       ├── app/             # Next.js App Router pages
│       │   ├── layout.tsx   # Root layout with TopBar + BottomNav
│       │   ├── page.tsx     # Home page (landing/login)
│       │   ├── create/      # Image generation page
│       │   ├── gallery/     # User generations gallery
│       │   ├── pricing/     # Subscription pricing page
│       │   ├── profile/     # User profile page
│       │   └── success/     # Payment success callback
│       ├── components/      # React components
│       │   ├── BottomNav.tsx         # Bottom navigation bar
│       │   ├── TopBar.tsx            # Top header bar
│       │   ├── ImageGenerator.tsx    # Main generation form
│       │   ├── GenerationsFeed.tsx   # List of generations
│       │   ├── GenerationCard.tsx    # Single generation card
│       │   ├── BlurOverlay.tsx       # Paywall overlay
│       │   └── index.ts              # Component exports
│       ├── store/
│       │   └── useAppStore.ts        # Zustand global state
│       └── hooks/
│           ├── useGenerationPolling.ts  # Real-time polling
│           └── useGuestHistory.ts       # Guest user history
│
├── backend/                 # FastAPI backend application
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── __init__.py
│       ├── main.py          # FastAPI app & endpoints
│       ├── models.py        # SQLAlchemy database models
│       ├── schemas.py       # Pydantic request/response schemas
│       ├── database.py      # Database connection & session
│       ├── auth.py          # JWT authentication logic
│       └── config.py        # Settings & environment config
│
└── worker/                  # Celery worker for AI jobs
    ├── Dockerfile
    ├── requirements.txt
    └── app/
        ├── __init__.py
        ├── celery_app.py    # Celery configuration
        ├── tasks.py         # Background tasks (generate_image_task)
        ├── models.py        # Database models (copy of backend)
        ├── database.py      # Database session (copy of backend)
        └── config.py        # Settings (copy of backend)
```

---

## Key Concepts & Design Patterns

### 1. Authentication Flow
- **JWT-based authentication:** Users receive a Bearer token on login
- **Token storage:** Frontend stores token in localStorage (`syren_token`)
- **Token validation:** Backend validates JWT on protected endpoints
- **Free credits:** New users receive 10 free credits on signup

### 2. Credit System
- **Cost per generation:** 1 credit = 1 AI image generation
- **Credit deduction:** Credits deducted immediately when generation is created
- **Refund on failure:** Worker refunds credit if generation fails
- **Subscription tiers:**
  - `free`: 10 initial credits
  - `pro`: 500 credits added on subscription

### 3. Async Generation Pattern
```
1. User submits prompt → Backend creates Generation record (status: pending)
2. Backend dispatches Celery task → Returns generation ID immediately
3. Celery worker processes generation → Updates DB on completion
4. Frontend polls /generations endpoint → Updates UI when status changes
```

### 4. State Management (Zustand)
- **Global store:** `useAppStore` in `frontend/src/store/useAppStore.ts`
- **State slices:**
  - User authentication (user, token, isAuthenticated)
  - Credit balance tracking
  - Generations list with real-time updates
  - Polling state management
- **Persistence:** Token persisted to localStorage

### 5. Database Models

#### User Model (`backend/app/models.py:11-26`)
```python
id: Integer (PK)
email: String(255) (unique, indexed)
hashed_password: String(255)
credit_balance: Integer (default: 10)
subscription_tier: String(50) (default: "free")
created_at: DateTime
updated_at: DateTime
```

#### Generation Model (`backend/app/models.py:28-43`)
```python
id: Integer (PK)
user_id: Integer (FK → users.id)
status: String(50) (pending/completed/failed)
image_url: Text (nullable)
prompt: Text
created_at: DateTime
updated_at: DateTime
```

### 6. Worker Task Pattern
- **Task name:** `generate_image_task` in `worker/app/tasks.py:270-375`
- **RunPod integration:** Submits ComfyUI workflow to RunPod serverless endpoint
- **Polling mechanism:** Polls RunPod status every 2 seconds (configurable)
- **Timeout handling:** 540s soft limit, 600s hard limit
- **Error recovery:** Automatic retry on transient errors, credit refund on failure

---

## API Endpoints

### Health Endpoints
- `GET /` - Root endpoint with service status
- `GET /health` - Health check endpoint

### Auth Endpoints
- `POST /auth/signup` - Register new user (returns UserResponse)
- `POST /auth/login` - Login with OAuth2 password flow (returns JWT token)
- `GET /auth/me` - Get current authenticated user (requires Bearer token)

### Generation Endpoints
- `POST /generate` - Create new AI generation (requires auth, deducts 1 credit)
- `GET /generations` - List user's generations (pagination: skip, limit)
- `GET /generations/{generation_id}` - Get single generation by ID

### Payment Endpoints
- `POST /webhook/payment` - Generic payment webhook (stub)
- `POST /webhooks/ccbill` - CCBill payment webhook (with token verification)
- `POST /create-checkout-session` - Create payment checkout session

**Important:** All endpoints return JSON. Protected endpoints require `Authorization: Bearer <token>` header.

---

## Frontend Architecture

### App Router Pages (`frontend/src/app/`)

| Route | File | Purpose |
|-------|------|---------|
| `/` | `page.tsx` | Landing page / login page |
| `/create` | `create/page.tsx` | Image generation interface |
| `/gallery` | `gallery/page.tsx` | User's generation history |
| `/pricing` | `pricing/page.tsx` | Subscription plans & checkout |
| `/profile` | `profile/page.tsx` | User account settings |
| `/success` | `success/page.tsx` | Payment success callback |

### Layout Structure (`frontend/src/app/layout.tsx`)
- **Mobile-first design:** Max-width 448px (md breakpoint)
- **Fixed positioning:** TopBar (top) + BottomNav (bottom)
- **Content area:** `pt-14 pb-20` for fixed headers
- **Dark theme:** Background `#09090b`, text `zinc-200`

### Key Components

#### ImageGenerator (`frontend/src/components/ImageGenerator.tsx`)
- Main prompt input and generation trigger
- Credit balance display
- Real-time generation status updates
- Error handling and user feedback

#### GenerationsFeed (`frontend/src/components/GenerationsFeed.tsx`)
- Displays list of user's generations
- Real-time polling for pending generations
- Pagination support

#### GenerationCard (`frontend/src/components/GenerationCard.tsx`)
- Individual generation display
- Status indicators (pending/completed/failed)
- Image preview with loading states

### Custom Hooks

#### useGenerationPolling (`frontend/src/hooks/useGenerationPolling.ts`)
- Polls backend every 3 seconds for pending generations
- Automatically starts/stops based on pending status
- Updates Zustand store with new statuses

#### useGuestHistory (`frontend/src/hooks/useGuestHistory.ts`)
- Manages generation history for unauthenticated users
- Persists to localStorage

---

## Development Workflow

### Initial Setup

1. **Clone repository:**
   ```bash
   git clone <repository-url>
   cd AI-OFM-WEB-APP
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and secrets
   ```

3. **Start with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

4. **Access services:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Local Development (without Docker)

#### Backend Development
```bash
cd backend
pip install -r requirements.txt
# Ensure PostgreSQL and Redis are running
uvicorn app.main:app --reload --port 8000
```

#### Worker Development
```bash
cd worker
pip install -r requirements.txt
# Ensure PostgreSQL and Redis are running
celery -A app.celery_app worker --loglevel=info
```

#### Frontend Development
```bash
cd frontend
npm install
npm run dev  # Runs on port 3000
```

### Environment Variables

**Critical variables to configure:**
- `OPENAI_API_KEY` - Required for text generation features
- `REPLICATE_API_TOKEN` - Required for image generation
- `RUNPOD_API_KEY` - Required for RunPod integration
- `RUNPOD_ENDPOINT_ID` - Your deployed RunPod endpoint
- `SECRET_KEY` - Backend JWT secret (change in production!)
- `WEBHOOK_SECRET` - CCBill webhook verification token

**Database configuration:**
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- `DATABASE_URL` - Auto-constructed in docker-compose

**Frontend configuration:**
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:8000)

---

## Code Conventions & Best Practices

### Python (Backend/Worker)

1. **Type hints:** Use Pydantic models for validation
   ```python
   from app.schemas import GenerationCreate, GenerationResponse
   ```

2. **Database sessions:** Always use dependency injection
   ```python
   def endpoint(db: Session = Depends(get_db)):
       # Database operations here
   ```

3. **Error handling:** Raise HTTPException with appropriate status codes
   ```python
   if not user:
       raise HTTPException(status_code=404, detail="User not found")
   ```

4. **Authentication:** Use `get_current_user` dependency
   ```python
   def protected_endpoint(current_user: User = Depends(get_current_user)):
       # User is authenticated
   ```

5. **Logging:** Use Python's logging module
   ```python
   import logging
   logger = logging.getLogger(__name__)
   logger.info(f"Generation {id} completed")
   ```

### TypeScript (Frontend)

1. **Component structure:** Functional components with TypeScript
   ```typescript
   export default function ComponentName() {
       // Component logic
   }
   ```

2. **State management:** Use Zustand for global state
   ```typescript
   const { user, token, setUser } = useAppStore()
   ```

3. **API calls:** Use fetch with proper error handling
   ```typescript
   const response = await fetch(`${API_URL}/endpoint`, {
       headers: { 'Authorization': `Bearer ${token}` }
   })
   ```

4. **Type safety:** Define interfaces for data structures
   ```typescript
   export interface User {
       id: number
       email: string
       credit_balance: number
   }
   ```

5. **Styling:** Use Tailwind utility classes
   ```typescript
   <div className="flex items-center justify-center p-4">
   ```

### Git Workflow

1. **Branch naming:**
   - Features: `feature/description`
   - Fixes: `fix/description`
   - Claude AI: `claude/description-{sessionId}`

2. **Commit messages:**
   - Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`
   - Be descriptive: `feat: Add credit refund on generation failure`

3. **Code review:**
   - Test locally before committing
   - Ensure Docker services start successfully
   - Check API docs at /docs endpoint

---

## Common Tasks & Commands

### Database Operations

**Create new migration (Alembic):**
```bash
cd backend
alembic revision --autogenerate -m "Description of changes"
alembic upgrade head
```

**Reset database:**
```bash
docker-compose down -v  # Removes volumes
docker-compose up --build
```

### Testing Generation Flow

1. **Signup user:**
   ```bash
   curl -X POST http://localhost:8000/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com", "password": "password123"}'
   ```

2. **Login:**
   ```bash
   curl -X POST http://localhost:8000/auth/login \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "username=test@example.com&password=password123"
   ```

3. **Create generation:**
   ```bash
   curl -X POST http://localhost:8000/generate \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"prompt": "A beautiful AI influencer portrait"}'
   ```

4. **Check status:**
   ```bash
   curl http://localhost:8000/generations \
     -H "Authorization: Bearer <token>"
   ```

### Monitoring Celery Worker

**View worker logs:**
```bash
docker-compose logs -f worker
```

**Test worker health:**
```bash
# From Python shell with Celery app
from app.celery_app import celery_app
result = celery_app.send_task('health_check')
result.get()
```

### Frontend Development

**Build for production:**
```bash
cd frontend
npm run build
npm run start  # Production server
```

**Type checking:**
```bash
npm run lint
```

---

## Important Notes for AI Assistants

### When Making Changes

1. **Database changes:**
   - Always update both `backend/app/models.py` and `worker/app/models.py`
   - Create Alembic migration if schema changes
   - Test with `docker-compose down -v && docker-compose up --build`

2. **API changes:**
   - Update schemas in `backend/app/schemas.py`
   - Update frontend TypeScript interfaces in Zustand store
   - Test with FastAPI docs at http://localhost:8000/docs

3. **Frontend changes:**
   - Follow mobile-first design (max-width: 448px)
   - Use Tailwind classes consistently
   - Maintain dark theme colors (`#09090b` background)
   - Update Zustand store types if data structures change

4. **Worker changes:**
   - Test with small prompts first
   - Monitor RunPod costs (serverless endpoint)
   - Ensure credit refunds work on failures
   - Check worker logs: `docker-compose logs -f worker`

### Common Pitfalls

1. **CORS issues:** Ensure backend allows `http://localhost:3000` origin
2. **Authentication:** Always include Bearer token in headers
3. **Credit deduction:** Credits deducted before generation starts
4. **Polling frequency:** Frontend polls every 3 seconds (configurable)
5. **Docker volumes:** Use `docker-compose down -v` to reset data
6. **Environment variables:** Must restart services after .env changes

### Code Quality Standards

- **No hardcoded values:** Use environment variables
- **Type safety:** Use TypeScript/Pydantic for validation
- **Error handling:** Always catch and log exceptions
- **Security:** Never commit .env files or API keys
- **Testing:** Test authentication flow before generation flow
- **Logging:** Use appropriate log levels (info, warning, error)

### Payment Integration Notes

- **Mock payments:** `create-checkout-session` returns mock URL for testing
- **CCBill webhook:** Requires `token` query param for verification
- **Credit assignment:** Pro tier adds 500 credits on successful payment
- **Subscription tier:** Updated in webhook, not in create-checkout-session

---

## Debugging Tips

### Backend Issues

**Check database connection:**
```python
# In backend/app/main.py, add endpoint:
@app.get("/debug/db")
def debug_db(db: Session = Depends(get_db)):
    users = db.query(User).count()
    generations = db.query(Generation).count()
    return {"users": users, "generations": generations}
```

**Check Celery connection:**
```bash
docker-compose exec worker celery -A app.celery_app inspect ping
```

### Frontend Issues

**Check API connection:**
```typescript
// In browser console
fetch('http://localhost:8000/health').then(r => r.json()).then(console.log)
```

**Check Zustand state:**
```typescript
// In any component, add:
console.log('Store state:', useAppStore.getState())
```

### Worker Issues

**Manual task execution:**
```python
# Python shell with worker environment
from app.tasks import generate_image_task
result = generate_image_task.delay(1, "test prompt")
print(result.get())  # Blocks until completion
```

---

## Additional Resources

- **FastAPI Documentation:** https://fastapi.tiangolo.com
- **Next.js 15 Docs:** https://nextjs.org/docs
- **Celery Documentation:** https://docs.celeryproject.org
- **RunPod API Docs:** https://docs.runpod.io
- **Zustand Guide:** https://github.com/pmndrs/zustand

---

## Version History

- **v0.1.0** (2026-01-14): Initial MVP release with core features
  - User authentication
  - Credit-based generation system
  - RunPod/ComfyUI integration
  - Payment webhook scaffolding
  - Mobile-first UI

---

**Last Updated:** 2026-01-14
**Maintained By:** Development Team
**For AI Assistants:** This document should be the primary reference for understanding the codebase structure and making informed changes.
