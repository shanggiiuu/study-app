# StudyDesk — Student Academic Management Web App

A full-stack academic management platform for students: grades, subjects, assignments, exams,
goals, calendar, notes, flashcards, a study timer, and an AI study advisor, all backed by a real
Java backend and PostgreSQL.

```
React + TypeScript  →  REST API  →  Spring Boot  →  Spring Security  →  Spring Data JPA  →  PostgreSQL
```

## Project layout

```
study-app/
├── backend/    Java 21 + Spring Boot + Spring Security (JWT) + Spring Data JPA + Maven
├── frontend/   React + TypeScript + Vite + Tailwind CSS + React Router + Recharts + Lucide
└── README.md
```

## Build status — Phase 1 of 6 complete

This is being built in phases (see the plan in the original spec). Only what's listed as done
below actually works end to end; everything else is a clearly-labeled placeholder in the UI.

- [x] **Phase 1 — Foundation**: project setup, PostgreSQL wiring, Spring Boot, React + TypeScript
      + Tailwind, JWT authentication (register/login/logout), `User` entity/profile, protected
      routing, sidebar shell matching the target IA.
- [ ] Phase 2 — Subjects, Grades, Assignments, Exams, GPA calculation service
- [ ] Phase 3 — Dashboard statistics/charts, upcoming deadlines, calendar widget
- [ ] Phase 4 — Goals, Notes, Documents, Flashcards, Study Timer
- [ ] Phase 5 — AI Advice (mock service until a real provider key is configured)
- [ ] Phase 6 — Notifications, Settings, responsive polish, accessibility

## 1. Install PostgreSQL (required — not installed on this machine)

The backend will not start without a reachable PostgreSQL server.

### Option A — native install (Windows)

1. Download from https://www.postgresql.org/download/windows/ and run the installer.
2. Set a password for the `postgres` user, keep the default port `5432`.
3. Create the database:
   ```sh
   psql -U postgres -c "CREATE DATABASE studyapp;"
   ```

### Option B — Docker

```sh
docker run --name studyapp-db \
  -e POSTGRES_DB=studyapp \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:16
```

## 2. Configure environment variables (backend)

No secrets are hardcoded. Defaults (used if unset) match the values above:

| Variable          | Default    |
|-------------------|------------|
| `DB_HOST`         | `localhost` |
| `DB_PORT`         | `5432`      |
| `DB_NAME`         | `studyapp`  |
| `DB_USERNAME`     | `postgres`  |
| `DB_PASSWORD`     | `postgres`  |
| `JWT_SECRET`      | dev-only fallback — **override this outside local dev** |
| `JWT_EXPIRATION_MS` | `86400000` (24h) |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` |

```powershell
$env:DB_PASSWORD = "your-real-password"
$env:JWT_SECRET = "a long random string, 32+ bytes"
```

## 3. Run the backend

```sh
cd backend
./mvnw spring-boot:run
```

`spring.jpa.hibernate.ddl-auto=update` — the schema is created/kept in sync automatically, and
data (including registered users) persists across restarts.

### API (Phase 1)

| Method | Path                    | Auth | Description                          |
|--------|-------------------------|------|---------------------------------------|
| POST   | `/api/auth/register`    | none | Create an account, returns JWT + user |
| POST   | `/api/auth/login`       | none | Log in, returns JWT + user            |
| POST   | `/api/auth/logout`      | none | Stateless no-op (client drops token)  |
| GET    | `/api/users/me`         | JWT  | Current user's profile                |
| PUT    | `/api/users/me`         | JWT  | Update profile                        |
| PUT    | `/api/users/me/password`| JWT  | Change password                       |

Send the JWT as `Authorization: Bearer <token>`. Passwords are hashed with BCrypt — never stored
in plain text. A global exception handler returns consistent JSON errors (400/401/403/404/409/500)
without leaking stack traces.

## 4. Run the frontend

```sh
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. Register an account, log in, and you'll land on the dashboard shell —
sidebar navigation to every planned section is in place; sections not yet built in the backend show
an explicit "not built yet" placeholder instead of dead buttons.

## What's intentionally not built yet

Subjects, grades, assignments, exams, GPA calculation, progress charts, goals, calendar, notes,
documents, flashcards, study timer, AI advice, notifications, settings, dark mode. These land in
later phases per the project's build plan — functionality first, backed by real data and a real
Java/Spring Boot/PostgreSQL backend, UI polish last.
