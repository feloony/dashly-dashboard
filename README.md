# Dashly

**Your services. One dashboard.**

Dashly is an open-source dashboard starter built with **React, TypeScript, Vite, and Chakra UI**. Fork it, customize the interface, and adapt its integration layer to your own APIs and services.

## Highlights

- Responsive, dark-first dashboard interface
- Reusable metric cards, charts, service-health panels, and activity tables
- Modular React components and theme tokens
- Chakra UI styling with Inter and JetBrains Mono
- Vite development server and production builds

> The overview currently uses sample data. API widgets and provider connections must be configured for your own services. The inherited authentication/backend wiring is still Discord-oriented and is a separate step from the visual rebrand.

## Development

**Requirements:** Node.js 20+ and pnpm.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Create and preview a production build:

```bash
pnpm build
pnpm preview
```

## Configuration

- `VITE_API_ENDPOINT` — your backend API base URL.
- `VITE_DISCORD_CLIENT_ID` — currently used by the inherited Discord OAuth/invite flow.

Anything prefixed with `VITE_` is exposed in the browser bundle. **Never store private API keys, bot tokens, or client secrets in frontend environment variables.** Put secrets behind a trusted server-side API.

## License

MIT
