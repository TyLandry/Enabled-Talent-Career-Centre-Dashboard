# Enabled Talent Career Centre Dashboard

Full-stack career centre dashboard for tracking students, job opportunities, applications, and placements.
Built with **React + TypeScript + Vite + Tailwind CSS (v4)** on the frontend, and **Node.js + Express + TypeScript + PostgreSQL** on the backend.

---

# Tech Stack

## Frontend

- **React + TypeScript** (UI)
- **Vite** (dev server + build)
- **Tailwind CSS v4** (styling)
- **lucide-react** (icons)
- **Recharts** (charts)

## Backend

- **Node.js** (runtime)
- **Express v5** (API framework)
- **TypeScript** (type safety)
- **PostgreSQL + pg** (database)
- **dotenv** (environment variables)
- **cors** (cross-origin requests)
- **helmet** (HTTP security headers)
- **express-rate-limit** (rate limiting)

---

# Prerequisites

Install the following:

- **Node.js (LTS recommended)**
- **PostgreSQL** (running locally or remote)

Verify:

```bash
node -v
npm -v
```

---

# Getting Started

## 1. Frontend

```bash
cd enabled-talent-dashboard
npm install
npm run dev
```

Runs at `http://localhost:5173`

## 2. Backend

```bash
cd enabled-talent-dashboard/Backend
cp .env.example .env   # fill in your values
npm install
npm run dev
```

Runs at `http://localhost:5050`

---

# Environment Setup (Backend)

Copy `.env.example` to `.env` inside the `Backend/` folder and fill in your values:

```env
PORT=5050
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173
```

> Never commit `.env` — it is listed in `.gitignore`.

---

# API Endpoints

All endpoints are prefixed with `/api`.

| Method | Endpoint                        | Description                                                     |
| ------ | ------------------------------- | --------------------------------------------------------------- |
| GET    | `/health`                       | Server + DB health check                                        |
| GET    | `/dashboard`                    | KPI summary (active students, open jobs, placements this month) |
| GET    | `/skills`                       | List all skills (optional `?q=` search)                         |
| GET    | `/skills/gap`                   | Skill gap analysis (students vs job demand)                     |
| GET    | `/skills/:id`                   | Get skill by ID                                                 |
| POST   | `/skills`                       | Create skill                                                    |
| PUT    | `/skills/:id`                   | Update skill                                                    |
| DELETE | `/skills/:id`                   | Delete skill                                                    |
| GET    | `/students`                     | List all students                                               |
| GET    | `/students/demographics`        | Gender split + top skills                                       |
| POST   | `/students`                     | Create student                                                  |
| PUT    | `/students`                     | Update student                                                  |
| DELETE | `/students/:id`                 | Delete student                                                  |
| GET    | `/jobs`                         | List all jobs                                                   |
| GET    | `/jobs/recent`                  | Recent job postings                                             |
| GET    | `/jobs/:id`                     | Get job by ID                                                   |
| POST   | `/jobs`                         | Create job                                                      |
| PUT    | `/jobs/:id`                     | Update job                                                      |
| DELETE | `/jobs/:id`                     | Delete job                                                      |
| GET    | `/placements`                   | List all placements                                             |
| GET    | `/placements/recent`            | Recent placements                                               |
| GET    | `/placements/this-month`        | Placements count this month                                     |
| GET    | `/placements/avg-time`          | Average days to placement                                       |
| GET    | `/placements/over-time`         | Monthly placements series                                       |
| GET    | `/placements/performance`       | KPI summary with date range filtering                           |
| POST   | `/placements`                   | Create placement                                                |
| PUT    | `/placements/:id`               | Update placement                                                |
| DELETE | `/placements/:id`               | Delete placement                                                |
| GET    | `/applications`                 | List all applications                                           |
| GET    | `/applications/matched`         | Recent matched applications                                     |
| GET    | `/applications/matched-summary` | Matched/accepted counts                                         |
| GET    | `/applications/:id`             | Get application by ID                                           |
| POST   | `/applications`                 | Create application                                              |
| PUT    | `/applications/:id`             | Update application                                              |
| DELETE | `/applications/:id`             | Delete application                                              |

---

# Security

The backend is hardened with the following measures:

- **Helmet** — sets secure HTTP headers (XSS, clickjacking, MIME sniffing protection)
- **CORS allowlist** — only origins listed in `ALLOWED_ORIGINS` are accepted
- **Rate limiting** — 200 requests per 15 minutes per IP
- **Body size limit** — requests larger than 10KB are rejected
- **Input validation** — all fields are type-checked, length-capped, and enum-validated before hitting the database
- **Parameterized queries** — all SQL uses `$1`/`$2` placeholders, preventing SQL injection
- **No credential leaks** — `.env` is git-ignored; database URL is never logged

---

# (Legacy setup notes)

To install frontend dependencies manually:

```bash
cd enabled-talent-dashboard
npm install
npm i -D tailwindcss autoprefixer
```

To verify Tailwind installation:

```bash
npm ls tailwindcss
```

To install backend dependencies manually:

```bash
cd enabled-talent-dashboard/Backend
npm init -y
npm i express cors dotenv pg helmet express-rate-limit
npm i -D typescript ts-node-dev @types/node @types/express
npx tsc --init
```

To run the backend in development mode:

```bash
npm run dev
```
