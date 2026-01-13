# Syren - AI Influencer Generator MVP

A full-stack application for generating AI-powered influencer content.

## 🏗️ Architecture

```
syren/
├── frontend/          # Next.js 15 (App Router)
├── backend/           # Python FastAPI
├── worker/            # Celery worker for AI jobs
├── docker-compose.yml # Orchestration
└── .env.example       # Environment template
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### Setup

1. Clone and navigate to the project:
   ```bash
   cd "AO OFM APP"
   ```

2. Copy environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` with your API keys:
   - `OPENAI_API_KEY` - For text generation
   - `REPLICATE_API_TOKEN` - For image generation

4. Start all services:
   ```bash
   docker-compose up --build
   ```

5. Access the application:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8000
   - **API Docs**: http://localhost:8000/docs

## 📦 Services

| Service   | Technology      | Port | Description              |
|-----------|-----------------|------|--------------------------|
| frontend  | Next.js 15      | 3000 | React frontend           |
| backend   | FastAPI         | 8000 | REST API                 |
| worker    | Celery          | -    | Background AI jobs       |
| db        | PostgreSQL 16   | 5432 | Primary database         |
| redis     | Redis Alpine    | 6379 | Task queue & cache       |

## 🔧 Development

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Worker
```bash
cd worker
pip install -r requirements.txt
celery -A app.celery_app worker --loglevel=info
```

## 📝 Environment Variables

See `.env.example` for all available configuration options.

| Variable              | Description                |
|-----------------------|----------------------------|
| `POSTGRES_USER`       | Database username          |
| `POSTGRES_PASSWORD`   | Database password          |
| `POSTGRES_DB`         | Database name              |
| `SECRET_KEY`          | Backend secret key         |
| `OPENAI_API_KEY`      | OpenAI API key             |
| `REPLICATE_API_TOKEN` | Replicate API token        |

## 📄 License

MIT
