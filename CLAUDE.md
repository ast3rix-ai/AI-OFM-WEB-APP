# CLAUDE.md - AI Assistant Guide for Syren Codebase

This document provides essential context for AI assistants working on the Syren AI Influencer Generator project.

## Project Overview

Syren is a full-stack web application for generating AI-powered influencer content. Users can upload selfies, select styles, and generate AI-enhanced images using RunPod's serverless ComfyUI integration.

**Tech Stack:**
- **Frontend:** Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS, Zustand
- **Backend:** Python FastAPI, SQLAlchemy, Pydantic
- **Worker:** Celery with Redis broker, RunPod integration
- **Database:** PostgreSQL 16
- **Cache/Queue:** Redis Alpine
- **Deployment:** Docker Compose

## Repository Structure

```
AI-OFM-WEB-APP/
├── frontend/                 # Next.js 15 application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── page.tsx     # Home page
│   │   │   ├── create/      # Image generation page
│   │   │   ├── gallery/     # User's gallery
│   │   │   ├── pricing/     # Subscription plans
│   │   │   ├── profile/     # User profile
│   │   │   └── success/     # Payment success
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   └── store/           # Zustand state management
│   ├── package.json
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── main.py          # FastAPI app & routes
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── auth.py          # JWT authentication
│   │   ├── config.py        # Settings
│   │   └── database.py      # DB connection
│   ├── requirements.txt
│   └── Dockerfile
│
├── worker/                   # Celery worker
│   ├── app/
│   │   ├── celery_app.py    # Celery configuration
│   │   ├── tasks.py         # Background tasks (RunPod)
│   │   ├── config.py        # Worker settings
│   │   ├── models.py        # SQLAlchemy models
│   │   └── database.py      # DB connection
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml        # Service orchestration
└── README.md
```

## Development Commands

### Docker (Recommended)

```bash
# Start all services
docker-compose up --build

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f [service_name]

# Stop all services
docker-compose down

# Rebuild specific service
docker-compose up --build backend
```

### Local Development

**Frontend:**
```bash
cd frontend
npm install
npm run dev      # Development server (port 3000)
npm run build    # Production build
npm run lint     # ESLint
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Worker:**
```bash
cd worker
pip install -r requirements.txt
celery -A app.celery_app worker --loglevel=info
```

## Service Ports

| Service  | Port | Description                |
|----------|------|----------------------------|
| frontend | 3000 | Next.js application        |
| backend  | 8000 | FastAPI REST API           |
| db       | 5432 | PostgreSQL database        |
| redis    | 6379 | Redis cache/queue          |

## API Endpoints

### Authentication
- `POST /auth/signup` - Register new user (returns UserResponse)
- `POST /auth/login` - OAuth2 login (returns JWT token)
- `GET /auth/me` - Get current user profile

### Generations
- `POST /generate` - Create new AI image generation (requires auth, deducts credit)
- `GET /generations` - List user's generations (paginated)
- `GET /generations/{id}` - Get specific generation

### Payments
- `POST /create-checkout-session` - Create payment session (CCBill/Segpay)
- `POST /webhook/payment` - Generic payment webhook
- `POST /webhooks/ccbill` - CCBill-specific webhook

### Health
- `GET /` - API root
- `GET /health` - Health check

## Database Models

### User
- `id`, `email`, `hashed_password`
- `credit_balance` (default: 10 free credits)
- `subscription_tier` ("free" | "pro")
- `created_at`, `updated_at`

### Generation
- `id`, `user_id`, `prompt`
- `status` ("pending" | "completed" | "failed")
- `image_url` (populated on completion)
- `created_at`, `updated_at`

## Frontend Architecture

### State Management (Zustand)
The app uses Zustand (`useAppStore`) for global state:
- User authentication state (`user`, `token`, `isAuthenticated`)
- Credit management (`deductCredit`, `addCredits`)
- Generations list with polling

### Key Components
- `ImageGenerator` - Upload, style selection, generation form
- `GenerationsFeed` - Display grid of generated images
- `GenerationCard` - Individual generation with status
- `TopBar` / `BottomNav` - Mobile app shell navigation
- `BlurOverlay` - Blur effect for gated content

### Custom Hooks
- `useGenerationPolling` - Polls API every 3 seconds for pending generations
- `useGuestHistory` - Tracks guest user activity

### Styling
- Tailwind CSS with custom dark theme
- Colors: `background` (#0a0a0b), `surface` (#141416), `accent` (#8b5cf6 purple)
- Mobile-first design with max-w-md container

## Worker Tasks

### `generate_image_task`
Main image generation task:
1. Builds ComfyUI workflow payload
2. Submits to RunPod serverless endpoint
3. Polls for completion (2-second intervals)
4. Updates database with result
5. Refunds credit on failure

Configuration:
- Max retries: 2
- Time limit: 10 minutes
- Soft time limit: 9 minutes

## Environment Variables

### Required
```
POSTGRES_USER=syren
POSTGRES_PASSWORD=syren_secret
POSTGRES_DB=syren_db
SECRET_KEY=your-secret-key-change-in-production
```

### AI Services (for production)
```
RUNPOD_API_KEY=your-runpod-api-key
RUNPOD_ENDPOINT_ID=your-endpoint-id
OPENAI_API_KEY=your-openai-key
REPLICATE_API_TOKEN=your-replicate-token
```

### Optional
```
DEBUG=true
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Code Conventions

### Backend (Python)
- Use type hints for all function parameters and returns
- Pydantic models for request/response validation
- SQLAlchemy models inherit from `Base`
- Dependency injection via FastAPI `Depends()`
- Settings via `pydantic_settings.BaseSettings`

### Frontend (TypeScript)
- Use `'use client'` directive for client components
- Prefer named exports for components
- Zustand for global state, React state for local
- Tailwind classes for all styling (no CSS modules)
- lucide-react for icons

### General
- API responses use consistent schema structures
- JWT tokens stored in localStorage (key: `syren_token`)
- Generation status: pending -> completed/failed
- Credits deducted on generation start, refunded on failure

## Common Tasks

### Adding a New API Endpoint
1. Add Pydantic schema in `backend/app/schemas.py`
2. Add route in `backend/app/main.py`
3. Add database model if needed in `backend/app/models.py`

### Adding a New Frontend Page
1. Create directory in `frontend/src/app/[page-name]/`
2. Add `page.tsx` with `'use client'` if needed
3. Update navigation in `BottomNav.tsx` if applicable

### Adding a New Component
1. Create component in `frontend/src/components/`
2. Export from `frontend/src/components/index.ts`
3. Use Tailwind classes matching existing dark theme

### Running Database Migrations
Alembic is available but not currently configured. Tables are auto-created via `Base.metadata.create_all()` in `main.py`.

## Testing

No test suite is currently configured. When adding tests:
- Backend: pytest with httpx for API testing
- Frontend: Jest + React Testing Library

## Known Limitations

1. **Demo Mode:** Home page auto-creates a demo user (remove in production)
2. **Payment Stubs:** CCBill integration returns mock checkout URLs
3. **No Image Upload:** Currently text-to-image only (file upload UI exists but unused)
4. **No Migrations:** Database changes require manual table drops

## Security Notes

- JWT tokens expire after 24 hours
- Passwords hashed with bcrypt
- CORS configured for localhost:3000 (update for production)
- Webhook signature verification uses `WEBHOOK_SECRET` setting
- Never commit `.env` files
