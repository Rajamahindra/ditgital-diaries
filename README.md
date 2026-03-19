# Digital Diaries — AI-Powered Digital Identity Platform

## Quick Start

### 1. Install dependencies
```bash
cd digital-diaries
npm run install:all
```

### 2. Setup PostgreSQL database
Create a database named `digital_diaries` and update `backend/.env` with your connection string.

### 3. Run migrations
```bash
npm run db:migrate
```

### 4. Start backend (Terminal 1)
```bash
npm run dev:backend
```

### 5. Start frontend (Terminal 2)
```bash
npm run dev:frontend
```

Open http://localhost:3000

## Tech Stack
- **Frontend**: Next.js 14, React, Tailwind CSS, Framer Motion, dnd-kit, Zustand
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **AI**: OpenAI GPT-4o-mini (optional, falls back to mock)
- **Auth**: JWT

## Environment Variables

### Backend (`backend/.env`)
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — Secret key for JWT tokens
- `OPENAI_API_KEY` — Optional, for AI features
- `ADMIN_EMAILS` — Comma-separated admin email addresses

### Frontend (`frontend/.env.local`)
- `NEXT_PUBLIC_API_URL` — Backend API URL
- `NEXT_PUBLIC_APP_URL` — Frontend URL (for card URLs)

## Features
- ✅ AI card generator (with OpenAI or mock fallback)
- ✅ Drag-and-drop card builder
- ✅ Live public card URLs
- ✅ QR code generation
- ✅ Download as PNG/PDF/VCF
- ✅ Real-time analytics
- ✅ Lead capture forms
- ✅ Social media links
- ✅ Dark/light mode
- ✅ JWT authentication
- ✅ Admin panel
- ✅ Subscription plans
- ✅ Business discovery
