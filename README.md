# MediBook — Doctor's Appointment Booking

A simple appointment booking app: browse doctors, book a slot, manage your appointments, and an admin dashboard to view every booking.

**Stack**: React + Vite (Tailwind CSS, React Router) frontend, Express + Neon (serverless Postgres) backend. The frontend and backend are merged into a single server/port — in development Express runs Vite in middleware mode for HMR; in production it serves the built frontend statically. Auth is JWT stored in an httpOnly cookie.

## Project layout

```
src/            React frontend
server/         Express API + Postgres schema/seed scripts (own package.json)
```

## Environment variables

Copy `server/.env.example` to `server/.env` and fill in:

| Var | Description |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string |
| `PORT` | Port for the server (defaults to 4000 locally; Render sets its own) |
| `NODE_ENV` | `development` locally, `production` when deployed |
| `JWT_SECRET` | Random secret used to sign auth cookies |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Credentials for the one seeded admin account |

## Local development

```bash
npm install
npm install --prefix server

npm run db:migrate   # creates/updates tables
npm run db:seed       # seeds doctors + the admin user (⚠️ wipes existing bookings — see below)

npm run dev           # single server at http://localhost:4000
```

`npm run db:seed` **wipes and reseeds** doctors/slots (cascading to appointments) every time it runs. Only run it once for initial setup, or again on a throwaway/dev database — never against a database with real bookings you want to keep.

## Deploying to Render

This app deploys as a single Render **Web Service** (a persistent Node process, not a static site).

- **Root Directory**: repo root (leave blank)
- **Build Command**:
  ```
  npm install && npm run build && npm install --prefix server
  ```
- **Start Command**:
  ```
  npm start --prefix server
  ```
- **Health Check Path**: `/api/health`
- **Environment variables** (set in Render's dashboard, not in any file): `DATABASE_URL`, `NODE_ENV=production`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`. Use a freshly generated `JWT_SECRET` and a real admin password — don't reuse local dev values. Don't set `PORT` — Render injects its own.

After the first deploy, run the migration and seed **once**, locally, against the production database:

```bash
DATABASE_URL="<production connection string>" npm run db:migrate
DATABASE_URL="<production connection string>" ADMIN_EMAIL="<prod admin email>" ADMIN_PASSWORD="<prod admin password>" npm run db:seed
```

⚠️ Never run `npm run db:seed` against production again once real appointments exist — it wipes doctors/slots/appointments unconditionally. `npm run db:migrate` is safe to rerun whenever `server/db/schema.sql` changes.

Render's free tier spins the service down after ~15 minutes of inactivity; the first request after that will be slow (cold start). This is expected on the free tier.
