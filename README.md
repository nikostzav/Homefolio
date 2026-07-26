# Homefolio

A full-stack real-estate listing app: browse and filter properties, save favorites, message listing owners in real time, and get personalized recommendations from a fuzzy-TOPSIS multi-criteria ranking engine.

This is a monorepo with two independently deployable pieces:

```
Homefolio/
├── backend/    # Node.js/Express + PostgreSQL + Socket.IO API — see backend/README.MD
└── frontend/   # React app — see frontend/README.md
```

## Features

- Browse/search/filter listings by city, type (buy/rent), property type, price, and bedrooms
- Property detail pages with an image gallery and an interactive map (Leaflet/OpenStreetMap)
- Auth (register/login), saved posts, and per-user preferences
- A preference-ranked recommendation view using a fuzzy-TOPSIS scoring algorithm
- Real-time chat with listing owners via Socket.IO
- Create listings with multi-image upload (Cloudinary)
- Fully responsive, from a phone up through a wide desktop window

## Tech stack

**Frontend:** React 18, React Router v6, Bootstrap 5 + Tailwind CSS, Leaflet, Socket.IO client
**Backend:** Express, PostgreSQL, Socket.IO, JSON Web Tokens, bcrypt

## Getting started

Each half has its own setup instructions:

1. [`backend/README.MD`](./backend/README.MD) — database setup (includes a one-command seed with demo data) and API server
2. [`frontend/README.md`](./frontend/README.md) — the React dev server (start the backend first; nearly every page fetches from the API)

**Demo login:** `demo_agent` / `password123`
