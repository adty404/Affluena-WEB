# Foundation Smoke Checklist

> **Current status (2026-06-20):** Historical smoke checklist. The current app includes this foundation plus broader API integration and current verification is `npm install`, `npm run build`, and `npm run test:run`.

Date: 2026-06-17
Branch: `feat/backend-integration-foundation`
Plan: `2026-06-17-backend-integration-foundation-auth.md`

## Automated (verified 2026-06-17)

- [x] **Backend up**: `curl http://localhost:8080/healthz` → `200 {"status":"ok"}`
- [x] **Register API**: `POST /api/v1/auth/register` with `foundationsmoke@test.local` / `password123` → 201 with `{ user, tokens }` shape
- [x] **Login API**: `POST /api/v1/auth/login` returns same session shape, user id matches register response
- [x] **`/me` API**: `GET /api/v1/auth/me` with Bearer token returns `{ user: { id, email, created_at, updated_at } }`
- [x] **TypeScript**: `npx tsc --noEmit` → no errors
- [x] **Unit tests**: `npx vitest run` → 9/9 pass (3 token + 3 client + 3 money)
- [x] **Production build**: `npm run build` → success (chunk-size warning acceptable)

## Manual (requires browser, pending dev-server session)

- [ ] **Login UI**: open `/login`, submit form with foundationsmoke creds, observe redirect to `/dashboard` and `localStorage.affluena.access_token` populated
- [ ] **Register UI**: open `/register`, submit new email/password, observe redirect to `/dashboard` and auto-login
- [ ] **Profile UI**: navigate to `/settings/profile`, observe real email rendered (disabled input) and member-since date from `created_at`
- [ ] **Topbar**: observe initials avatar derived from email, popover shows real email
- [ ] **Logout**: click Logout in topbar popover, observe redirect to `/login`, `localStorage` cleared, query cache cleared
- [ ] **Protected route redirect**: open private window without token, navigate to `/dashboard`, observe redirect to `/login`
- [ ] **401 refresh path**: in DevTools, corrupt `affluena.access_token` value but keep valid refresh token, trigger any protected request, observe automatic refresh + retry succeeds
- [ ] **401 expire redirect**: corrupt both access and refresh tokens, trigger any protected request, observe redirect to `/login?reason=expired`

## Known gaps surfaced by foundation work

- `ProfileSettingsPage` retains fields backend cannot accept (Full name, Handle, currency preferences). Backend `/api/v1/auth/me` returns only `id`, `email`, `created_at`, `updated_at`. These inputs stay disabled until Plan 11 (Settings cleanup) decides between localStorage fallback and new backend endpoints.
- `ForgotPasswordPage` / `ResetPasswordPage` / `OnboardingPage` untouched — backend has no matching endpoints (gap noted in `Affluena-API/docs/FRONTEND_API_MAPPING.md:10-11`).
- Login redirect target uses `location.state.from?.pathname ?? '/dashboard'`. Direct visits to `/login` go to `/dashboard`. Pre-flight redirect to `/login?reason=expired` will land on `/login` and lose the `from` hint — by design, expired session forces dashboard.

## Follow-up

Foundation is complete. Plans 2–11 (per `2026-06-17-backend-integration-foundation-auth.md` follow-up section) remain.
