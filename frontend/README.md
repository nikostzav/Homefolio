# Estate — Frontend

A React frontend for a real-estate listing app: browse/search/filter properties, save favorites, message listing owners in real time, and get personalized recommendations. Pairs with the API in `../airbnbclone-be`.

## Features

- Browse and filter listings by city, type (buy/rent), property type, price, and bedrooms
- Property detail pages with an image gallery and an interactive map (Leaflet/OpenStreetMap)
- Auth (register/login) with per-user saved posts and preferences
- A preference-ranked "Recommended" view using a fuzzy-TOPSIS scoring algorithm
- Real-time chat with listing owners via Socket.IO
- Create new listings with multi-image upload (Cloudinary widget)
- Responsive layout — usable from a phone up through a wide desktop window

## Tech stack

React 18, React Router v6, Bootstrap 5 + Tailwind CSS (mixed intentionally per component), Leaflet/react-leaflet, Socket.IO client, Axios.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

`REACT_APP_API_URL` should point at the backend (see `../airbnbclone-be`), default `http://localhost:8000`.

### 3. Run the backend first

This app has no mock/offline mode — nearly every page fetches from the API. Follow the setup steps in `../airbnbclone-be/README.MD` (it includes a one-command database seed) before starting the frontend.

### 4. Start the dev server

```bash
npm start
```

Opens on `http://localhost:3000`.

**Demo login:** once the backend's seed data is loaded, sign in with `demo_agent` / `password123` to see saved posts and listings already populated, or register a new account.

## Project structure

```
src/
├── Components/     # Shared UI building blocks (navbars, cards, chat, map, forms)
├── Pages/          # Route-level components, wired up in index.js
└── index.js        # Router setup (createBrowserRouter) and app entry point
```

## Notes

- Listing detail pages (`/singleItem/:id`) fetch the post fresh by ID, so direct links and page refreshes work correctly.
- The image upload widget depends on a Cloudinary account (`cloudName`/`uploadPreset` are hardcoded in `Components/AddPost.jsx`'s parent `Pages/Add.jsx`); swap those for your own Cloudinary config if you fork this.
