# Development notes

This project was designed, built, and deployed by me. AI (Claude) was used
sparingly, and only for narrow, targeted help — not for architecture,
features, or product decisions.

Concretely, AI was used for:

- Spot-checking a couple of tricky bugs (a Socket.IO delivery issue, an
  unhandled Postgres connection error)
- Occasional code review comments on small sections
- Filling the database with sample data
- Helping with documentation

Everything else — the architecture, the database schema, the auth and
security design, and the deployment setup across Render, Vercel, and Neon —
is my own work, and I can walk through and defend any part of this
codebase.
