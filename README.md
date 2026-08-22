# Spacer

Spacer is a React + Vite frontend application for browsing, booking, and managing shared spaces. This repository contains the frontend application, a simple JSON-based API for local development, and Redux state management for core features.

## Features
- Browse public spaces with details and availability
- User authentication (register/login/forgot password)
- Client dashboard: book spaces, view bookings, payments, invoices
- Admin dashboard: manage users, spaces, and view booking history
- JSON-server-based mock API for local development

## Tech Stack
- Frontend: React, Vite
- State management: Redux Toolkit
- Routing: React Router
- Mock API: json-server
- Linting: ESLint

## Prerequisites
- Node.js 18+ and npm

## Setup (Local Development)
1. Clone the repository and install dependencies:

	npm install

2. Install frontend dependencies (if you open `frontend` and prefer separate install):

	cd frontend
	npm install

3. Start the local development server (runs json-server and vite):

	cd frontend
	npm run dev

This runs a mock API at `http://localhost:3001` serving `src/database/db.json` and the Vite dev server (default `http://localhost:5173`).

## Scripts (frontend)
- `npm run dev` — start json-server and Vite for development
- `npm run api` — run only the json-server API on port 3001
- `npm run build` — build the production bundle using Vite
- `npm run preview` — preview production build locally
- `npm run lint` — run ESLint

## Project Structure
See the `frontend/src` folder for the application code. Key folders:
- `components/` — shared UI components (NavBar, AuthShell, ErrorBoundary)
- `layouts/` — layout components for admin and client
- `pages/` — routed pages for admin, client, public, and auth flows
- `store/` — Redux slices and store configuration
- `database/` — `db.json` for `json-server` mock API

## Mock API
The mock API uses `json-server` and serves `frontend/src/database/db.json`. The API runs on port `3001` when you run `npm run dev` from `frontend`.

## Environment & Configuration
No runtime environment variables are required for the mock frontend. If you integrate a real backend later, document required variables here.

## Testing
No automated tests are included currently. To add tests, consider using `Jest` with `React Testing Library` for component and slice tests.

## Contributing
Contributions are welcome. Please open issues or submit pull requests describing changes and motivation.

## License
This project uses the license in the repository root. Update this section if you add a specific license.

## Contact
For questions or help, open an issue in this repository.