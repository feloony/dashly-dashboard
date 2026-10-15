# OpenUtility Dashboard

OpenUtility's Discord server dashboard, built with React, TypeScript, Vite, and Chakra UI.

## Current feature status

- **Welcome Message — implemented in the frontend:** configure a welcome channel and message.
- **Music, gaming, reaction roles, memes, and AutoMod — not implemented in this dashboard:** these template placeholders have been removed from the feature menu. Do not advertise them as working until both the dashboard form and backend/bot behavior are implemented and tested.

The welcome-message workflow is only fully functional when the connected backend and bot implement the matching API routes and apply saved configuration.

## Development

Requirements: Node.js 20+ and pnpm.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

## Build

```sh
pnpm build
pnpm preview
```

The build runs TypeScript project checks before creating the Vite production bundle.

## Required deployment environment

Configure these in the frontend hosting provider (Vercel, for example):

- `VITE_API_ENDPOINT` — absolute HTTPS origin for the deployed dashboard backend, with no trailing slash. The production API host could not be verified from this frontend repository alone; do not use localhost in production.
- `VITE_DISCORD_CLIENT_ID` — the real Discord application ID for this bot. The invite link is hidden when this is missing and no Administrator permission is requested by default.

The Vite `VITE_*` values are public client-side configuration, not secrets. Never put a Discord client secret, bot token, signing secret, or database credential in these variables.

## Backend security contract

Frontend guild filters are only for presentation and are not an authorization boundary. The backend must, on every request that reads or changes a guild:

1. Validate the session/token server-side and reject expired or revoked sessions.
2. Resolve the authenticated Discord user and verify they are still a member of the requested guild.
3. Check the user's current Discord permissions (at least Manage Server or Administrator for settings changes).
4. Verify the bot is in the guild and validate the requested feature ID and payload.
5. Apply CSRF protection when cookie-based sessions are used, configure CORS for the exact dashboard origin, and use secure, HttpOnly, SameSite cookies where supported.
6. Never trust a guild ID, role ID, channel ID, or permission claim supplied only by the browser.

The OAuth callback currently accepts a short-lived session token in the URL fragment and keeps it in sessionStorage for the current tab. This is safer than persistent localStorage but still exposes the token to JavaScript. Prefer a backend-managed HttpOnly cookie and a server-side OAuth state/PKCE flow where the backend supports it. The backend source is not part of this repository, so OAuth state validation, token expiry/revocation, CORS, CSRF, and endpoint authorization still require a separate backend audit.

## Production checklist

- Set and verify `VITE_API_ENDPOINT` and `VITE_DISCORD_CLIENT_ID` in the hosting environment.
- Confirm the backend supports `GET /auth`, `POST /auth/signout`, `GET /guilds/:guild`, `GET/PATCH/POST/DELETE /guilds/:guild/features/:feature`, and `GET /guilds/:guild/roles` / `channels`.
- Test login, logout, unauthorized access, guild permission changes, feature enable/disable, saving, and error responses against a staging backend before production.
- Do not deploy until the backend authorization requirements above have been verified.
