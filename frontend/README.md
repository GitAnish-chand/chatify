# Chatify Frontend

The Chatify frontend is a React 19 application built with Vite. At the current code state, it is a responsive Vite starter shell with global styling, static assets, and development/build tooling in place. Product-level chat screens, routing, API integration, and auth state management are not yet implemented.

This README documents the frontend as it exists today and identifies the integration seams for turning the shell into the Chatify client.

## Runtime Stack

| Concern | Technology |
| --- | --- |
| UI runtime | React 19 |
| Build tool | Vite 8 |
| Language | JavaScript, JSX |
| Styling | Plain CSS with global custom properties |
| Linting | ESLint 9 with React Hooks and React Refresh plugins |

## Source Layout

```text
frontend/
  index.html              # Vite HTML entry point
  vite.config.js          # React plugin configuration
  eslint.config.js        # ESLint flat config
  public/
    icons.svg             # SVG sprite used by the starter UI
    favicon.svg
  src/
    main.jsx              # React StrictMode bootstrap
    App.jsx               # Current single-screen starter component
    index.css             # Global design tokens and base styles
    App.css               # Component-level layout and UI styling
    assets/
      hero.png
      react.svg
      vite.svg
```

## Application Architecture

### Bootstrap

`src/main.jsx` mounts the React app with:

```jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

React `StrictMode` is enabled, which is useful for surfacing unsafe render behavior during development.

### Component Model

The current UI is a single component in `App.jsx`. It contains:

- Local `useState` state for the starter counter.
- Static visual assets loaded through Vite imports.
- A centered hero section.
- A responsive documentation/social link section.

There is not yet a component hierarchy for chat, authentication, layout, navigation, contact lists, or message threads.

### Routing

No client-side router is currently installed or configured. The production backend is prepared to serve `index.html` for unmatched paths, so React Router or another SPA router can be added without changing the deployment shape.

Recommended future route map:

| Route | Purpose |
| --- | --- |
| `/login` | User authentication |
| `/signup` | Account creation |
| `/chat` | Authenticated chat workspace |
| `/profile` | Profile image and account settings |

These routes are recommendations, not current implementation.

## Styling and UI System

The frontend uses plain CSS and CSS custom properties rather than a component library.

`index.css` defines global tokens for:

- text colors
- background colors
- borders
- accent colors
- shadows
- font families
- light/dark color schemes

`App.css` defines the current screen layout:

- centered hero composition
- responsive section stacking below `1024px`
- button hover and focus-visible states
- SVG sprite icon usage

The existing CSS already has a useful token boundary. A production UI system can grow from this by formalizing:

- layout primitives
- buttons and icon buttons
- form fields
- auth panels
- contact rows
- message bubbles
- empty/loading/error states

## API Communication

No frontend API layer exists yet. The backend API is cookie-based, so future browser requests must include credentials:

```js
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ email, password }),
})
```

Important integration detail: the backend currently does not configure CORS and the Vite config does not define an API proxy. There are two clean development options:

1. Add a Vite proxy from `/api` to the backend port.
2. Add credentialed CORS on the Express backend for the Vite dev origin.

Production can remain same-origin because the backend contains an Express static-serving branch for `frontend/dist`. In the current backend code, that branch depends on `ENV.NODE_ENV` being exposed by the backend environment module.

## Authentication Integration Plan

The backend stores JWT sessions in an HTTP-only `token` cookie. Because the cookie is not readable from JavaScript, the frontend should treat authentication as server-authoritative.

Recommended frontend auth architecture:

- Submit login/signup forms to `/api/auth/login` and `/api/auth/signup`.
- Use `credentials: "include"` on all auth-aware requests.
- Add a `GET /api/auth/me` endpoint on the backend for session hydration.
- Store only non-sensitive user profile data in React state.
- Redirect unauthenticated users based on API responses, not local token inspection.

This approach avoids placing bearer tokens in local storage and aligns with the backend session model.

## State Management

The current app uses local component state only:

```jsx
const [count, setCount] = useState(0)
```

There is no global store, server-state cache, context provider, or reducer layer yet.

Recommended future state split:

| State Type | Recommended Owner |
| --- | --- |
| Authenticated user | React context or server-state cache |
| Contacts | Server-state cache keyed by `/api/messages/contacts` |
| Active conversation | Route state or colocated chat state |
| Draft message | Local component state |
| Message history | Server-state cache with pagination |
| UI preferences | Local storage-backed context if needed |

## Performance Profile

The current frontend is small and ships through Vite's optimized build pipeline. Present performance characteristics:

- Static assets are imported and fingerprinted by Vite.
- React StrictMode helps catch unsafe component behavior during development.
- CSS is minimal and does not depend on runtime style generation.
- No heavy routing, state, or data-fetching libraries are currently included.

Future optimization points:

- Route-level code splitting once chat/profile/auth screens are added.
- Virtualization for long message lists.
- Optimistic UI for message sending.
- Image compression and preview handling before Cloudinary upload.
- Server-state caching for contacts and conversations.

## Development

Install dependencies:

```bash
npm install
```

Run the Vite dev server:

```bash
npm run dev
```

Build production assets:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

## Environment Variables

No frontend environment variables are currently used.

If the frontend later needs build-time configuration, Vite requires public client variables to use the `VITE_` prefix:

```env
VITE_API_BASE_URL=http://localhost:5000
```

For the current deployment model, a relative `/api` base path is preferable because the production Express server hosts the client and API on the same origin.

## Production Delivery

The repository root build script runs:

```bash
npm install --prefix backend
npm install --prefix frontend
npm run build --prefix frontend
```

The generated `frontend/dist` directory is intended to be served by the backend in production. This keeps deployment operationally simple: one Node process can serve both the API and the compiled React application once the backend production environment branch is wired through `ENV.NODE_ENV`.

## Next Engineering Milestones

- Replace the starter screen with Chatify auth and chat views.
- Add an API client module with `credentials: "include"`.
- Add client-side routing and protected route behavior.
- Add session hydration once the backend exposes a current-user endpoint.
- Introduce reusable UI primitives before adding many product screens.
- Add component tests for forms and chat interaction states.
