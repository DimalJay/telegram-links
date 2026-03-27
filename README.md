# Top Telegram Links

A React + Vite frontend for browsing and submitting Telegram group/channel links.

Built with Vite + React + Tailwind CSS.

## Run

This frontend expects the API backend to be running (default: `http://localhost:3000`).

- Install deps: `npm install`
- Start dev server: `npm run dev`

To point to a different backend, set `VITE_API_BASE_URL` (example: `http://localhost:3000`).

Pages:

- Home: `/` (or `index.html`)
- Groups: `/groups.html`
- Channels: `/channels.html`

## Build

- Production build: `npm run build`
- Preview build: `npm run preview`

## Data + API

All listings and submissions use the backend API (see the backend README for full details):

- `GET /api/groups`
- `GET /api/channels`
- `GET /api/trending/groups`
- `GET /api/trending/channels`
- `GET /api/search?query=...&type=...`
- `POST /api/links`

## Search

Use the search bar in the header to filter links by title, URL, or description.
