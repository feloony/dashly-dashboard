# OpenUtility Dashboard

The web dashboard for **OpenUtility**, built with React, TypeScript, Vite, and Chakra UI.

🌐 **Live site:** https://feloony.github.io/workingonit/

## What’s included

- Discord sign-in and session-aware authentication
- Backend API integration for account and server data
- Responsive dashboard interface
- GitHub Actions workflow for automatic GitHub Pages deployment

## Recent updates

- Improved API request handling and credentialed cookie-session support.
- Only sends the bearer-token header when a session token is available, helping avoid unnecessary CORS preflight failures.
- Added a clearer error when the backend API endpoint is not configured.
- Updated the project documentation and deployment instructions.

## Development

**Requirements:** Node.js 20+ and pnpm.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Create a production build:

```bash
pnpm build
pnpm preview
```

## Deployment configuration

The GitHub Actions workflow builds and deploys the site when changes are pushed to `main`.

Configure these frontend variables for deployment:

- `VITE_API_ENDPOINT` — HTTPS URL of the backend API.
- `VITE_DISCORD_CLIENT_ID` — Discord application client ID.

These `VITE_*` values are public in the browser bundle. **Never put bot tokens, client secrets, or other private credentials in them.**

## License

MIT
