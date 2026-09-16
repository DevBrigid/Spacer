# Spacer

Spacer is a booking platform for browsing, listing, and managing shared spaces. The repository contains a React frontend and a FastAPI backend backed by Supabase services.

## Features
- Browse spaces, availability, and details
- Register and log in with Supabase Auth
- Client dashboards for bookings, payments, and invoices
- Admin dashboards for users, spaces, and booking history
- Image uploads and M-Pesa payment integration

## Tech Stack
- Frontend: React, Vite, Redux Toolkit, React Router, MapLibre
- Backend: FastAPI, SQLAlchemy, Alembic, Python
- Authentication and storage: Supabase
- Payments: Safaricom Daraja/M-Pesa

## Prerequisites
- Node.js 18+ and npm
- Python 3.11+ and a virtual environment
- A Supabase project

## Configuration

Copy `backend/.env.example` to either `backend/.env` or the repository root `.env`. The backend loads both locations and requires database, JWT, Supabase, and Daraja settings.

Put browser-safe settings in `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
VITE_SUPABASE_REDIRECT_URL=http://localhost:5173/auth/callback
```

Never put `SUPABASE_SERVICE_ROLE_KEY` in `frontend/.env` or commit it. The backend uses that key to create confirmed users during registration. Configure the Supabase project URL and redirect URL in the Supabase dashboard as well.

## Local Development

Install backend dependencies and start the API:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirement.txt
uvicorn app.main:app --reload
```

In a second terminal, install frontend dependencies and start Vite:

```bash
cd frontend
npm install
npm run dev
```

The API runs at `http://localhost:8000`. Vite normally runs at `http://localhost:5173`; if that port is busy, use the port Vite prints and add the matching origin to `CORS_ORIGINS` before restarting the backend.

## Frontend Scripts
- `npm run dev` - start the Vite development server
- `npm run build` - create the production bundle in `frontend/dist`
- `npm run preview` - preview the production bundle
- `npm run lint` - run ESLint

## Backend Checks

Run the backend test suite from `backend` with the virtual environment active:

```bash
pytest
```

The API health endpoint is available at `http://localhost:8000/health`.

## Project Structure
- `frontend/src` - React application, pages, components, and Redux state
- `backend/app` - FastAPI application, routers, services, models, and schemas
- `backend/migrations` - Alembic migrations
- `backend/tests` - backend tests
- `frontend/dist` - generated frontend build output; do not edit manually

## Contributing
Contributions are welcome. Please open issues or submit pull requests describing changes and motivation.

## License
This project uses the license in the repository root. Update this section if you add a specific license.

## Contact
For questions or help, open an issue in this repository.