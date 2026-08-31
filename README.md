# Spacer

Spacer is a platform for finding and booking unique spaces for meetings, events, activities, collaboration, and celebrations.

The idea is simple: **people can find a space they like, check its availability, and book it**, while space owners can make their properties available for rent.

### The Problem

Finding a suitable space for a meeting, event, activity, or celebration can be difficult when information is spread across different places.

Space owners also need an easier way to make their spaces available to people who need them.

### The Solution

Spacer brings everything into one platform.

Users can:

- Browse available spaces.
- View space details.
- Check availability.
- Book a space for a specific duration.
- See the amount they need to pay.
- Manage their bookings.
- Access payment and invoice information.

Administrators can:

- Add and manage spaces.
- View spaces.
- Add users.
- Manage users based on roles and permissions.
- View and manage bookings.

## Main Features

### Client

**Spaces**
- Browse available spaces.
- View detailed space information.
- Check whether a space is available.

**Authentication**
- Register an account.
- Log in.
- Use local authentication.
- Use JWT authentication.
- Reset a forgotten password.

**Bookings**
- Select a space.
- Choose the booking duration.
- Calculate the booking amount.
- Track booking status.
- Prevent unavailable spaces from being booked.

**Payments & Invoices**
- Simulate the payment process.
- Handle billing information.
- Generate and manage invoices.

### Admin

- Add spaces.
- Edit spaces.
- View all spaces.
- Add users.
- Manage user roles and permissions.
- View users.
- Manage booking information.

## Technology Stack

### Frontend

- React.js
- Vite
- Redux Toolkit
- React Router

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication
- Alembic

### Database

- PostgreSQL

### Testing

- Pytest

### Other Tools

- Figma for wireframes
- SMTP/email services
- WeasyPrint for document generation

## How the System Works

```text
User
  |
  v
React Frontend
  |
  | HTTP / JSON
  v
FastAPI Backend
  |
  v
SQLAlchemy
  |
  v
PostgreSQL
```

For a booking:

```text
Browse Spaces
      |
      v
View Space Details
      |
      v
Check Availability
      |
      v
Choose Duration
      |
      v
Create Booking
      |
      v
Calculate Amount
      |
      v
Payment / Invoice
```

## Project Structure

The repository currently contains the main frontend project inside `client/spacer`.

```text
Spacer/
│
├── client/
│   └── spacer/
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── ...
│
├── LICENSE
└── README.md
```

As the project grows, the backend can be maintained alongside the frontend using a structure such as:

```text
Spacer/
│
├── client/
│   └── spacer/
│
├── backend/
│   ├── crud/
│   ├── models/
│   ├── routes/
│   ├── schemas/
│   ├── services/
│   ├── tests/
│   └── ...
│
├── LICENSE
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have installed:

- Git
- Node.js
- npm
- Python 3.10+
- PostgreSQL

### 1. Clone the Repository

```bash
git clone https://github.com/DevBrigid/Spacer.git
cd Spacer
```

### 2. Open the Frontend

```bash
cd client/spacer
```

### 3. Install Frontend Dependencies

```bash
npm install
```

### 4. Start the Frontend

```bash
npm run dev
```

Vite will display the local development URL in your terminal.

## Backend Setup

The backend is being developed separately from the current frontend structure.

When working on the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on macOS/Linux:

```bash
source venv/bin/activate
```

On Windows:

```bash
venv\Scripts\activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

The API will normally be available at:

```text
http://localhost:8000
```

FastAPI documentation:

```text
http://localhost:8000/docs
```

## Environment Variables

Do not commit passwords, API keys, or other secrets to GitHub.

A backend `.env` file may contain values such as:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/spacer
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
```

The frontend may use:

```env
VITE_API_URL=http://localhost:8000
```

Use the variable names required by the project's configuration.

## Database

Spacer uses PostgreSQL.

The backend uses SQLAlchemy to communicate with the database and Alembic to manage database migrations.

Run existing migrations with:

```bash
alembic upgrade head
```

Create a new migration with:

```bash
alembic revision --autogenerate -m "describe your change"
```

## CRUD Layer

The backend includes CRUD operations for the main resources.

```text
backend/crud/
├── __init__.py
├── user_crud.py
├── space_crud.py
├── booking_crud.py
├── payment_crud.py
└── invoice_crud.py
```

Each CRUD module is responsible for basic database operations:

- Create
- Read
- Update
- Delete

## Authentication

Spacer uses JWT authentication to protect authenticated features.

A simplified login flow looks like this:

```text
User logs in
     |
     v
Backend checks credentials
     |
     v
JWT token is created
     |
     v
Frontend stores/uses the token
     |
     v
Token is sent with protected requests
```

Passwords should always be stored securely as hashes, never as plain text.

## API

The backend is designed around REST API endpoints.

Examples include:

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/spaces` | View spaces |
| GET | `/api/spaces/{id}` | View one space |
| POST | `/api/spaces` | Add a space |
| PUT | `/api/spaces/{id}` | Update a space |
| DELETE | `/api/spaces/{id}` | Delete a space |
| GET | `/api/bookings` | View bookings |
| POST | `/api/bookings` | Create a booking |
| PUT | `/api/bookings/{id}` | Update a booking |
| DELETE | `/api/bookings/{id}` | Delete/cancel a booking |

## Testing

Backend tests use **Pytest**.

Run the tests with:

```bash
pytest
```

Important areas to test include:

- Registration
- Login
- JWT authentication
- User permissions
- Space creation
- Space updates
- Space availability
- Booking creation
- Booking status
- Payment handling
- Invoice generation

## Future Improvements

Possible future features include:

- Online payment gateway integration.
- Space reviews and ratings.
- Advanced search and filters.
- Calendar-based availability.
- Booking notifications.
- Email confirmations.
- Admin analytics.
- Revenue reports.
- Calendar integration.
- Automated invoice emails.
- More comprehensive automated testing.

## Repository

GitHub repository:

https://github.com/DevBrigid/Spacer

Clone:

```bash
git clone https://github.com/DevBrigid/Spacer.git
```

## License

This project is licensed under the MIT License.

See the `LICENSE` file for details.