# Azar Hologram Admin Panel

Next.js staff interface for the Azar Hologram storefront. The panel provides a dedicated login and an administration area for managing the shop through the backend API.

## Architecture

- Next.js App Router and React
- Material UI and Redux Toolkit for the interface and client state
- Administration routes in `src/app/AdminPanel/`, sign-in in `src/app/Login/`, and shared hooks in `src/hooks/`

## Local development

```sh
npm ci
npm run dev -- --port 3001
```

Open `http://localhost:3001`. To sign in and exercise administration flows, use a local or staging backend and a test account configured for that environment. For a production build, use `npm run build` followed by `npm start`. The start script serves the build on port 3001.

## Project repositories

| Repository | Role |
| --- | --- |
| [hologram-web-shop](https://github.com/amirhoseinhoseinpoor/hologram-web-shop) | Customer storefront |
| [hologram-admin-shop](https://github.com/amirhoseinhoseinpoor/hologram-admin-shop) | Staff administration interface |
| [hologram-core-shop](https://github.com/amirhoseinhoseinpoor/hologram-core-shop) | Backend API and business logic |

[View the live storefront](https://azarhologram.net/)

