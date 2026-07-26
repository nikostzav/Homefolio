# Estate — Backend

A Node.js/Express REST + WebSocket API for a real-estate listing app (Airbnb-style browse/search/save/chat), backed by PostgreSQL.

## Features

- JWT-based authentication (register/login/logout), passwords hashed with bcrypt
- Property listings: create, browse, filter by city/type/property/price/bedrooms
- Saved posts (favorites) per user
- User preferences and a fuzzy-TOPSIS backed recommendation ranking (consumed by the frontend)
- Real-time chat between users via Socket.IO, with per-chat unseen-message counts
- Image uploads handled client-side via Cloudinary; the backend just stores the resulting URLs

## Tech stack

Express, PostgreSQL (`pg`), Socket.IO, JSON Web Tokens, bcrypt.

## Project structure

```
src/
├── controllers/     # Request handlers (auth, posts, chat, preferences, profile, cities)
├── middlewares/      # JWT auth middleware
├── models/           # Database connection (pg Pool)
├── routes/           # Express route definitions (mounted under /api/auth)
├── sockets/           # Socket.IO connection/event handling
├── utils/             # Chat/message persistence helpers used by the socket layer
└── server.js          # App entry point
db/
└── schema.sql         # Table definitions + a small demo dataset
```

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [PostgreSQL](https://www.postgresql.org/) v14+

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create the database and load the schema

```bash
createdb -U postgres airbnbdb
psql -U postgres -d airbnbdb -f db/schema.sql
```

`db/schema.sql` creates all tables and seeds a demo account plus 11 sample listings (stock photos, no personal data), so the app is populated the moment you start it.

**Demo login:** `demo_agent` / `password123`

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your own values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `PORT` | Port the server listens on (default `8000`) |
| `DATABASE_URL` | Postgres connection string, e.g. `postgresql://postgres:yourpassword@localhost:5432/airbnbdb` |
| `JWT_SECRET` | Any long random string used to sign auth tokens |

### 4. Run it

```bash
npm start        # node src/server.js
npm run dev       # nodemon, restarts on file changes
```

The API listens on `http://localhost:8000` by default. It expects the frontend (see `../airbnbclone-fe`) to run on `http://localhost:3000` — that origin is hardcoded in the CORS/Socket.IO config in `src/server.js`.

## API overview

All REST routes are mounted under `/api/auth` (a legacy naming artifact — it covers auth, posts, chats, and preferences, not just auth). Key routes:

- `POST /api/auth/register`, `/login`, `/logout`
- `GET /api/auth/getPosts`, `GET /api/auth/posts/:id`, `POST /api/auth/addPost`, `POST /api/auth/addPostDetails`
- `POST /api/auth/savePost`, `POST /api/auth/checkIfSaved`, `POST /api/auth/getSavedPosts`
- `GET /api/auth/getCities`
- `GET /api/auth/preferences/:userId`, `PUT /api/auth/preferences/:userId`
- `GET /api/auth/userchats/:id`, `POST /api/auth/mark-as-seen`, `GET /api/auth/unseen-count`

Chat messages themselves are exchanged over Socket.IO (`joinRoom`, `receiveMessage`, `fetchMessage`, `fetchChats` events), not REST.
