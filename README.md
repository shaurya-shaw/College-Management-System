# College Management System

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?logo=github)](https://github.com/shaurya-shaw/College-Management-System)
[![Vercel](https://img.shields.io/badge/Live%20Demo-Vercel-000000?logo=vercel)](https://college-management-system-gilt.vercel.app/)

A full-stack College Management System with role-based access (Admin / Teacher / Student), attendance tracking, QR-based attendance, calendar & class session management. Built with a Node.js + Express + MongoDB backend and a React + Vite + TypeScript frontend.

**Demo & Repo**

- **GitHub:** https://github.com/shaurya-shaw/College-Management-System
- **Live (Vercel):** https://college-management-system-gilt.vercel.app/

---

**Highlights**

- Role-based authentication (Admin, Teacher, Student)
- JWT access & refresh token flow with secure cookies
- QR generation + geofenced QR scanning for attendance
- Class session scheduling, branches, subjects and calendar management
- Clean React UI with Vite, Tailwind, and Zustand for state

---

**Tech Stack**

- Backend: Node.js, Express, Mongoose (MongoDB)
- Frontend: React, TypeScript, Vite, Tailwind CSS, Zustand
- Auth: JSON Web Tokens, HttpOnly cookies
- Hosting: Vercel (frontend), any Node host for backend

---

**Repository layout**

- backend/: Express API
- frontend/: React + Vite application

---

## Quickstart

Prerequisites: Node.js >= 18, npm or pnpm, MongoDB (Atlas or local).

1. Clone the repo

```bash
git clone https://github.com/shaurya-shaw/College-Management-System.git
cd College-Management-System
```

2. Backend (API)

```bash
cd backend
cp .env.example .env   # create your .env (or create .env manually)
npm install
npm run dev            # development (nodemon)
# or
npm start              # production
```

3. Frontend (client)

```bash
cd ../frontend
npm install
npm run dev            # open http://localhost:5173
```

Open the frontend app (usually at `http://localhost:5173`).

---

## Environment variables

Backend (create `backend/.env`):

- `PORT` — server port (e.g. `5000`)
- `MONGODB_URI` — MongoDB connection string
- `ACCESS_TOKEN_SECRET` — JWT access token secret
- `REFRESH_TOKEN_SECRET` — JWT refresh token secret
- `ACCESS_TOKEN_EXPIRY` — access token expiry (optional, e.g. `15m`)
- `REFRESH_TOKEN_EXPIRY` — refresh token expiry (optional, e.g. `7d`)
- `ADMIN_FULL_NAME` — initial admin full name (created on startup if missing)
- `ADMIN_EMAIL` — initial admin email
- `ADMIN_PASSWORD` — initial admin password
- `QRGENERATOR_SECRET` — secret used to sign QR tokens
- `BUILDING_LATITUDE` — building latitude (for geofence checks)
- `BUILDING_LONGITUDE` — building longitude
- `PERMITTED_RADIUS` — permitted radius (meters) for QR scan

Frontend (create `frontend/.env`):

- `VITE_API_URL` — base backend URL (e.g. `http://localhost:5000`)

Note: frontend Axios instance uses `VITE_API_URL` and expects backend routes under `/api/v1`.

---

## Useful scripts

- Backend: see [backend/package.json](backend/package.json)
  - `npm run dev` — nodemon development server
  - `npm start` — run production server
- Frontend: see [frontend/package.json](frontend/package.json)
  - `npm run dev` — start vite dev server
  - `npm run build` — build production assets
  - `npm run preview` — preview production build

---

## Minimal API overview

All API routes are mounted under `/api/v1` (see `backend/src/index.js`). Major resources include:

- `/api/v1/users` — registration, login, logout, refresh token, profile, user management
- `/api/v1/branches` — branches (create/list)
- `/api/v1/subjects` — subject CRUD
- `/api/v1/class-sessions` — schedule classes and time slots
- `/api/v1/attendance` — mark attendance, generate QR token, scan QR token
- `/api/v1/calendar-dates` — manage calendar and holidays

For details, inspect the controllers in `backend/src/controllers/`.

---

## Deployment notes

- Frontend is deployed to Vercel at: https://college-management-system-gilt.vercel.app/
- When deploying backend set environment variables in your host (PORT, MONGODB_URI, JWT secrets, QR secrets, admin credentials, building coords and radius).

---

## Contributing

Contributions are welcome. Open issues or pull requests against the repository. Please follow standard GitHub flow and include clear descriptions for changes.

---
