# University / Study Search Web App

Backend-first scaffold: a Spring Boot REST API backed by PostgreSQL, with a minimal
React + TypeScript frontend that only exists to prove the API works end to end.

```
React + TypeScript Frontend  →  REST API  →  Spring Boot Backend  →  PostgreSQL
```

## Project layout

```
study-app/
├── backend/    Java + Spring Boot + Spring Data JPA + Maven
├── frontend/   React + TypeScript + Vite (thin API test client)
└── README.md
```

## 1. Install PostgreSQL (required — not yet installed on this machine)

The backend will not start until it can reach a real PostgreSQL server. Nothing here
fakes the database with mock data — pick one of the two options below.

### Option A — native install (Windows)

1. Download the installer from https://www.postgresql.org/download/windows/ and run it.
2. During setup, set a password for the `postgres` user and keep the default port `5432`.
3. Create the database used by this app:
   ```sh
   psql -U postgres -c "CREATE DATABASE university_search;"
   ```

### Option B — Docker (if you'd rather not install PostgreSQL directly)

Docker is not currently installed on this machine either. Install Docker Desktop
(https://www.docker.com/products/docker-desktop/), then run:

```sh
docker run --name university-search-db \
  -e POSTGRES_DB=university_search \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:16
```

## 2. Configure environment variables (backend)

The backend reads DB credentials from environment variables — nothing is hardcoded.
Defaults (used if a variable isn't set) match the values above:

| Variable      | Default            |
|---------------|---------------------|
| `DB_HOST`     | `localhost`         |
| `DB_PORT`     | `5432`               |
| `DB_NAME`     | `university_search` |
| `DB_USERNAME` | `postgres`           |
| `DB_PASSWORD` | `postgres`           |

Set them in your shell before running the backend if your local Postgres differs, e.g.:

```powershell
$env:DB_PASSWORD = "your-real-password"
```

## 3. Run the backend

```sh
cd backend
./mvnw spring-boot:run
```

On startup, Hibernate creates the `universities` / `university_programs` tables and
`data.sql` seeds 7 sample universities (NUS, ETH Zurich, Waterloo, Stanford, Tokyo,
Toronto, Wollongong). The schema is dev-mode `create-drop` — it resets and reseeds
every restart (see the comment in `application.properties` to change that later).

Verify it's working:

```
GET http://localhost:8080/api/universities
GET http://localhost:8080/api/universities/1
GET http://localhost:8080/api/universities/search?country=Canada
GET http://localhost:8080/api/universities/search?program=Computer%20Science
```

### API

| Method | Path                        | Description                          |
|--------|-----------------------------|---------------------------------------|
| GET    | `/api/universities`         | List all universities                 |
| GET    | `/api/universities/{id}`    | Get one university (404 if missing)   |
| POST   | `/api/universities`         | Create a university (201, validated)  |
| PUT    | `/api/universities/{id}`    | Update a university                   |
| DELETE | `/api/universities/{id}`    | Delete a university (204)             |
| GET    | `/api/universities/search`  | Filter by `name`, `country`, `city`, `program` (all optional, combinable) |

Errors return JSON via a global exception handler with proper status codes
(400 for validation/bad input, 404 for not found, 500 for unexpected errors).

## 4. Run the frontend

```sh
cd frontend
npm install   # already run once during setup
npm run dev
```

Open http://localhost:5173. It calls the backend at `VITE_API_URL`
(see `frontend/.env`, defaults to `http://localhost:8080`), lists universities from
PostgreSQL via the API, supports a simple name search, and shows details when you
click "View" — no hardcoded frontend data.

## What's intentionally not built yet

Auth, user accounts, saved universities, application tracking, scholarships, AI
recommendations, complex filtering, admin dashboard, notifications, payments,
deployment, microservices. This stage only proves the backend-first architecture
works end to end.
