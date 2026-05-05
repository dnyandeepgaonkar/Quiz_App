# Quizzy Client

React + Vite frontend for the Quizzy quiz application.

## Overview

The client provides the user interface for authentication, quiz browsing, quiz attempts, results, user history, profile management, and admin quiz management.

## UI Features

- Responsive Tailwind CSS interface
- Light and dark mode toggle with persisted preference
- System theme detection on first visit
- Reusable button, input, card, modal, and navigation patterns
- Loading skeletons, toast feedback, hover states, and smooth transitions
- Quiz progress bar, timer display, and selected-answer states

## Environment

Create `client/.env`:

```env
VITE_BASE_URL=/api/v1
```

Frontend API calls should use the configured Vite base URL. Do not hardcode `localhost`, IP addresses, or direct `/v1/*` paths in UI code.

## Local Development

```bash
npm install
npm run dev
```

The Vite dev server proxies `/api/*` to `http://localhost:4000`, so API calls can use the same `/api/v1/*` paths as Docker/Nginx.

## Production Build

```bash
npm run lint
npm run build
```

## Docker

The Docker build injects the API base path at build time:

```dockerfile
ARG VITE_BASE_URL=/api/v1
ENV VITE_BASE_URL=$VITE_BASE_URL
```

Nginx serves the built frontend and proxies API requests:

```nginx
location /api/ {
    proxy_pass http://server:4000;
}
```
