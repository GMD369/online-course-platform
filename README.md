# LearnHub — Online Course Platform

A full-stack online course platform built with the MERN stack (MongoDB, Express, React, Node.js).
Students can browse and enroll in courses, instructors can create and manage courses with lessons,
and admins can manage the whole platform from a dedicated dashboard.

## Features

- **Authentication** — registration, login, logout, JWT stored in an httpOnly cookie, password
  strength validation, protected routes on both frontend and backend.
- **Role-based access** — `student`, `instructor`, and `admin` roles with different dashboards and
  permissions.
- **Course management (CRUD)** — instructors create, edit, publish/unpublish, and delete courses;
  courses contain an ordered list of lessons (also full CRUD).
- **Enrollment with mock checkout** — students enroll in free or paid courses through a simulated
  card-payment flow (no real payment processor involved).
- **Dashboards** — role-specific statistics, recent activity feed, data tables with search, filters,
  and pagination.
- **Image uploads** — course thumbnails uploaded via `multer`, served from `/uploads`.
- **Search, filtering & pagination** — on the public course catalog, instructor course list, admin
  user list, and admin course list.
- **Security** — bcrypt password hashing, JWT auth, helmet, rate limiting (with a stricter limit on
  auth endpoints), MongoDB query sanitization, centralized error handling, server-side input
  validation with `express-validator`.
- **Responsive UI** — built with Tailwind CSS, works on mobile, tablet, and desktop.

## Tech stack

| Layer    | Technology                                                        |
| -------- | ------------------------------------------------------------------ |
| Frontend | React 19 (Vite), React Router, Tailwind CSS v4, Axios, lucide-react |
| Backend  | Node.js, Express, Mongoose                                         |
| Database | MongoDB                                                             |
| Auth     | JWT (httpOnly cookie)                                               |

## Project structure

```
server/            Express API
  src/
    config/        Database connection
    controllers/    Route handlers
    middleware/     Auth, validation, upload, error handling
    models/         Mongoose schemas (User, Course, Enrollment)
    routes/         Express routers
    utils/          JWT helpers, AppError, seed script
client/            React (Vite) SPA
  src/
    api/            Axios client
    context/        AuthContext
    components/     Reusable UI, layout, and dashboard components
    pages/          Route-level pages (public, auth, student, instructor, admin)
```

## Getting started locally

### Prerequisites

- Node.js 18+
- A MongoDB instance — either local (`mongod`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Backend

```bash
cd server
cp .env.example .env      # then edit MONGO_URI and JWT_SECRET
npm install
npm run seed               # optional: populate demo users & courses
npm run dev                 # starts on http://localhost:5000
```

Seeded demo accounts (after running `npm run seed`):

| Role       | Email                  | Password        |
| ---------- | ----------------------- | --------------- |
| Admin      | admin@example.com       | Admin1234        |
| Instructor | instructor@example.com  | Instructor1234   |
| Instructor | mentor@example.com      | Mentor1234       |
| Student    | student@example.com     | Student1234      |

### 2. Frontend

```bash
cd client
npm install
npm run dev                 # starts on http://localhost:5173
```

The Vite dev server proxies `/api` and `/uploads` to `http://localhost:5000`, so no `.env` is
needed for local development. Visit `http://localhost:5173`.

## Deployment

This project deploys as two separate services: the API (Node/Express) and the static SPA
(React/Vite build).

### Backend → Render (or Railway / Fly.io)

A `render.yaml` is included at the project root for one-click Render deployment (Blueprint).
Manually, on Render:

1. Create a new **Web Service**, root directory `server`.
2. Build command: `npm install`. Start command: `npm start`.
3. Set environment variables: `MONGO_URI` (your Atlas connection string), `JWT_SECRET`,
   `JWT_EXPIRES_IN`, `CLIENT_URL` (your deployed frontend URL), `NODE_ENV=production`.

> Note: Render's free tier has an ephemeral filesystem, so uploaded course thumbnails will be lost
> on redeploy/restart. For production use, add a persistent disk or swap `multer`'s disk storage for
> a cloud storage provider (S3, Cloudinary, etc.).

### Database → MongoDB Atlas

Create a free M0 cluster, add a database user, allow network access (or `0.0.0.0/0` for
simplicity), and copy the connection string into `MONGO_URI`.

### Frontend → Vercel (or Netlify)

1. Import the `client` directory as the project root.
2. Build command: `npm run build`. Output directory: `dist`.
3. Set `VITE_API_URL` to your deployed backend URL (e.g. `https://learnhub-api.onrender.com`).
4. `vercel.json` is included so client-side routes (e.g. `/courses/123`) resolve correctly on
   refresh.

## Security notes

- Passwords are hashed with bcrypt (12 salt rounds) and never returned in API responses.
- JWTs are stored in httpOnly, sameSite cookies (not accessible to client-side JS), mitigating XSS
  token theft.
- All mutating routes are protected by `protect` (auth) and `restrictTo` (role) middleware.
- Rate limiting is applied globally and more strictly on `/api/auth/login` and `/api/auth/register`.
- Input is validated server-side via `express-validator` on every write endpoint, in addition to
  client-side validation for UX.
- `express-mongo-sanitize` and `helmet` mitigate NoSQL injection and common HTTP header attacks.
