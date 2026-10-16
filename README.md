# Dashly

**Your services. One dashboard.**

Dashly is an open-source dashboard starter built with **React, TypeScript, Vite, and Chakra UI**. Fork it, configure your APIs, compose JSON-backed widgets, and deploy your own instance.

## Features

- Multiple workspaces for separating projects
- Configurable REST API integrations with base URLs and default headers
- Optional bearer-token and HTTP Basic authentication
- Custom widgets that fetch JSON from an endpoint and display the full response or a nested data path
- Responsive dark interface, local configuration, and GitHub Pages deployment

## Quick start

Requirements: Node.js 20+ and pnpm.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Build and preview:

```bash
pnpm build
pnpm preview
```

## Connect an API

1. Open **Integrations** and add a name and HTTPS base URL.
2. Choose no authentication, bearer token, or HTTP Basic authentication.
3. Add a widget and choose the integration, endpoint path, and optional JSON path such as `data.account.name`.
4. Refresh the widget to fetch the latest response.

The API must allow browser requests through CORS. Only JSON GET requests are currently supported by the built-in widget fetcher. Provider-specific adapters and write operations can be added as extensions.

## Configuration and security

- The optional `VITE_API_ENDPOINT` build variable can provide a default backend URL.
- Workspace, integration, and widget definitions are stored in this browser's localStorage.
- API credentials are stored in sessionStorage for the current browser session and are not synced to a server.
- Browser storage is **not a secure secrets vault**. For privileged credentials, private APIs, multi-user deployments, or OAuth flows, add a trusted server-side proxy, secure secret storage, and server-enforced authorization.
- Do not put private API keys, bot tokens, or client secrets in `VITE_*` environment variables; these values are public in the built frontend.

The backend URL setting is configuration only. Dashly does not ship a backend or user-account system by default.

## Deployment

Push to `main` to build and deploy with the included GitHub Actions workflow. GitHub Pages is suitable for the static frontend; integrations that need secrets or bypass CORS require a separate backend.

## License

MIT
