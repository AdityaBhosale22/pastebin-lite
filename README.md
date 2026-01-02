````md
# Pastebin Lite - Take-home assignment

Pastebin Lite is a small web app that lets users create text pastes and share them using a unique link.  
Each paste can optionally expire after a certain time or after a limited number of views.

## Features

- Create and share text pastes
- Unique, shareable URLs
- Optional time-based expiry (TTL)
- Optional view-count limits
- API and browser-based paste viewing
- Safe rendering (no script execution)
- Health check endpoint for service status

## Tech Stack

- Next.js (App Router)
- TypeScript
- Vercel KV (Upstash Redis) for persistence
- Deployed on Vercel

## API Overview

- **GET `/api/healthz`**  
  Health check endpoint.

- **POST `/api/pastes`**  
  Creates a new paste.

- **GET `/api/pastes/:id`**  
  Fetches a paste as JSON (each fetch counts as a view).

- **GET `/p/:id`**  
  Displays the paste as an HTML page.

Unavailable, expired, or over-used pastes always return **HTTP 404**.

---

## Running Locally

```bash
npm install
npm run dev
````

> Local development requires Vercel KV environment variables to be configured.

---

## Persistence & Testing Notes

* Pastes are stored using **Vercel KV**, making the app safe for serverless deployments.
* View limits and expiry rules are enforced consistently across API and HTML routes.
* Deterministic time handling is supported for automated tests using a custom request header.

---

## Notes

* No secrets or credentials are committed to the repository
* No hardcoded localhost URLs are used in production responses