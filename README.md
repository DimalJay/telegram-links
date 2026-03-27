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

## Deploy (Firebase Hosting)

This repo includes a `firebase.json` configured to serve the Vite build output in `dist/`.

1) Install Firebase CLI:

- `npm i -g firebase-tools`

2) Login + select/create a Firebase project:

- `firebase login`
- `firebase init hosting` (choose this folder, set `dist` as the public directory, and do **not** enable GitHub deploy unless you want it)

3) Set production API base URL (optional but recommended)

Create `.env.production`:

```bash
VITE_API_BASE_URL=https://YOUR_BACKEND_HOST
```

4) Build + deploy:

- `npm run build`
- `firebase deploy` (or `firebase deploy --only hosting --project YOUR_PROJECT_ID`)

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
