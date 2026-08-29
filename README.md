# Hexocode

Hexocode is a React and TypeScript website. The project contains the marketing-site interface, reusable UI
components, page layouts, and an in-browser history router.

The project is currently configured as a standalone Vite frontend. Cloudflare,
Wrangler, D1, R2, and the former worker deployment layer have been removed.
The frontend can therefore be developed and built without a Cloudflare
account or database.

## Requirements

- Node.js 18 or newer
- npm 9 or newer

Check the installed versions with:

```bash
node --version
npm --version
```

## Getting started

Install the dependencies from the project root:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Vite serves the application at `http://localhost:5173` by default. The
development server supports hot module replacement, so changes to React,
TypeScript, CSS, and assets appear without a manual rebuild.

## Available commands

| Command | Description |
| --- | --- |
| `npm install` | Install dependencies from `package-lock.json`. |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create an optimized production build in `dist/`. |
| `npx tsc --noEmit` | Type-check the project without writing files. |
| `npm audit` | Check npm dependencies for known vulnerabilities. |

The `dist/` directory is generated output and is intentionally ignored by
Git. Do not commit it unless a hosting provider specifically requires
generated files in the repository.

## Project structure

```text
.
├── client/
│   ├── components/       Reusable layout, card, navigation, and UI components
│   ├── lib/              API types, routing, hooks, authentication, and site state
│   ├── pages/            Public pages and the existing admin page interface
│   ├── main.tsx          React entry point and route selection
│   └── styles.css        Global styles and design tokens
├── public/
│   └── static/           Logo and static project images
├── index.html             HTML document and application mount point
├── vite.client.config.ts  Vite configuration for the React application
├── tailwind.config.js     Tailwind content paths and theme extensions
├── postcss.config.js      PostCSS and Tailwind integration
├── tsconfig.json          TypeScript compiler configuration
└── package.json            Scripts and dependency declarations
```

## Application architecture

`client/main.tsx` mounts the React application and selects a page based on the
current browser path. `client/lib/router.ts` uses the History API, so internal
navigation does not require a full page reload.

The visual system is built with Tailwind CSS and shared components. Brand
colors, typography, spacing, and other design tokens are defined in
`client/styles.css` and extended through `tailwind.config.js`.

Static assets are served from `public/`. For example, the logo is available at
`/static/logo.png` in the browser.

## Data and backend note

The former backend and database implementation was removed from this project.
The home page is designed to render as a standalone frontend without an API.

Some older public and admin screens still contain typed calls to `/api/...`
through `client/lib/api.ts`. Those screens require a compatible backend if they
are used. They are not provided by this Vite-only repository. Do not enter
real credentials into the admin screens unless a backend has been intentionally
restored and secured.

## Creating an admin

Admin login uses Supabase Auth. To configure it:

1. Create a project at [supabase.com](https://supabase.com).
2. In Supabase, open **Authentication → Users** and choose **Add user**.
3. Create the administrator with an email and a strong password. Keep email
   confirmation enabled unless you intentionally control the account.
4. Copy `.env.example` to `.env.local`.
5. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from **Project
   Settings → API**.
6. Restart `npm run dev`, then open `/admin/login`.

Only the Supabase publishable/anonymous key belongs in the frontend. Never use
the service-role key in `.env.local`, source code, or a browser build. Admin
authorization for data-management operations must be enforced with Supabase
Row Level Security policies; a client-side route guard is not a security
boundary.

## Building and hosting

Create a production bundle with:

```bash
npm run build
```

The output is written to `dist/` and can be uploaded to any static hosting
provider that supports single-page applications. Configure the host to serve
`index.html` as the fallback for client-side routes such as `/projects` and
`/about`.

This repository no longer contains deployment commands or configuration for
Cloudflare, Wrangler, Workers, D1, or R2. Choose and configure a hosting
provider separately when you are ready to publish the site.

## Security checklist before publishing

Before pushing or deploying:

1. Run `npm audit`.
2. Run `npx tsc --noEmit`.
3. Run `npm run build`.
4. Confirm that no `.env` files, API keys, private keys, passwords, or tokens
   are staged.
5. Confirm that `node_modules/` and `dist/` are not staged.
6. Review the final changes with `git status` and `git diff --cached`.

Environment files such as `.env`, `.env.local`, `.env.production`, and
`.env.*.local` are ignored by `.gitignore`. Never place secrets directly in
client-side code: values shipped to a browser are publicly readable.

## License

No license has been specified yet. Add a `LICENSE` file before distributing
the project if you want to define reuse and distribution terms.
