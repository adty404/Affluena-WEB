# Affluena-WEB — Plan 3: Categories & Tags Integration + Hardcoded UI Fixes + Stale Documentation

**Goal:** Wire the categories & tags UI (list, create, edit) to live backend endpoints, replacing mock data with real TanStack Query state. Fix all hardcoded user values in Sidebar and ProfileSettingsPage. Fix the duplicate AuthSession type and useMe localStorage bypass. Update stale documentation in API and README.

**Mirrors:** `Affluena-API/docs/API_CONTRACT.md` § Category, § Tag, § Auth (sessions)

**Branch:** `feat/plan-3-categories-tags` (already created from `feat/gap-closure-phase-3-forgot-reset`)

**Backend ground truth verified 2026-06-18:**

- `GET /api/v1/categories?type=income|expense&limit=&offset=&sort=` → `{ categories: [...], pagination: { total, limit, offset } }`
- `POST /api/v1/categories` `{ name, type, parent_id? }` → `Category`
- `GET /api/v1/categories/:id` → `Category`
- `PUT /api/v1/categories/:id` `{ name, type, parent_id? }` → `Category`
- `DELETE /api/v1/categories/:id` → `204 No Content`
- `GET /api/v1/tags?limit=&offset=&sort=` → `{ tags: [...], pagination: { total, limit, offset } }`
- `POST /api/v1/tags` `{ name }` → `Tag`
- `GET /api/v1/tags/:id` → `Tag`
- `PUT /api/v1/tags/:id` `{ name }` → `Tag`
- `DELETE /api/v1/tags/:id` → `204 No Content`

**Category shape (response):**
```ts
{
  id: string;
  user_id: string;
  parent_id?: string;
  name: string;
  type: 'income' | 'expense';
  created_at: string; // RFC3339
  updated_at: string;
}
```

**Tag shape (response):**
```ts
{
  id: string;
  user_id: string;
  name: string;
  created_at: string; // RFC3339
  updated_at: string;
}
```

**Business rules:**
- Categories support `?type=income` or `?type=expense` filter
- Category trees max 3 levels deep; parent must be same `type` as child
- Tags are name-only (no color, no type)
- DELETE returns 204 (no body)

---

## Scope Deviations from Original Mock

The mock (`src/data/mockCategories.ts`, `src/data/mockTags.ts`) carried fields the backend does not provide:

| Field | Mock (Category) | Backend | Resolution |
|-------|------------------|---------|------------|
| `icon` | emoji string `🍽` | (none) | Removed. Table renders name only. |
| `color` | `'green'\|'blue'\|...` | (none) | Removed. Row styling derives from `type` (`income`=green, `expense`=red). |
| `monthlyUsage` | number | (none) | Removed from list page. |
| `transactionCount` | number | (none) | Removed from list page. |
| `children` | `Category[]` | (none — flat list via `?type=`) | List page requests `?type=income` and `?type=expense` separately. Parent-child represented by `parent_id` field; UI reconstructs tree client-side from flat list. |

| Field | Mock (Tag) | Backend | Resolution |
|-------|-------------|---------|------------|
| `color` | `'green'\|'blue'\|...` | (none) | Removed. Pill styling uses a deterministic hash of `name` for color. |
| `transactionCount` | number | (none) | Removed from list page. |
| `totalAmount` | number | (none) | Removed from list page. |
| `lastUsed` | string | (none) | Removed from list page. |

Mock files (`mockCategories.ts`, `mockTags.ts`) are **kept** until cross-plan consumers (e.g. transaction form dropdowns, budget selectors) are wired to the real API. The mock files are rewritten to match the new `Category` and `Tag` types so they type-check, and the `flatCategories` export is preserved but now computed from the flat list.

---

## Files

### Created

- `src/api/categories.ts` — list/get/create/update/delete
- `src/api/tags.ts` — list/get/create/update/delete
- `src/hooks/useCategories.ts` — `useCategories`, `useCategory`, `useCreateCategory`, `useUpdateCategory`, `useDeleteCategory`
- `src/hooks/useTags.ts` — `useTags`, `useTag`, `useCreateTag`, `useUpdateTag`, `useDeleteTag`
- `src/schemas/category.ts` — `categoryCreateSchema`, `categoryUpdateSchema`, `categoryTypeOptions`, `categoryTypeLabels`
- `src/schemas/tag.ts` — `tagCreateSchema`, `tagUpdateSchema`
- `Affluena-QA/helpers/categories.ts` — `createCategory`, `listCategories`, `getCategory`, `deleteCategory`, `rawCreateCategory`, `rawUpdateCategory`
- `Affluena-QA/helpers/tags.ts` — `createTag`, `listTags`, `getTag`, `deleteTag`, `rawCreateTag`, `rawUpdateTag`
- `Affluena-QA/tests/categories/category-crud.spec.ts` — full CRUD E2E
- `Affluena-QA/tests/tags/tag-crud.spec.ts` — full CRUD E2E
- `Affluena-WEB/docs/superpowers/plans/2026-06-18-plan-3-categories-tags.md` — this file
- `Affluena-WEB/docs/superpowers/plans/2026-06-18-plan-3-categories-tags-smoke.md` — verification checklist

### Modified

- `src/types/category.ts` — rewrite to match backend shape; add `CategoryListResponse`, `CategoryCreateRequest`, `CategoryUpdateRequest`
- `src/types/tag.ts` — rewrite to match backend shape; add `TagListResponse`, `TagCreateRequest`, `TagUpdateRequest`
- `src/types/auth.ts` — rename first `AuthSession` (lines 10–20) to `AuthSessionRecord`; keep second (lines 29–32) as `AuthSession`; update all consumers
- `src/hooks/useMe.ts` — replace `window.localStorage.getItem('affluena.access_token')` with `import { getAccessToken } from '@/lib/token'` and `Boolean(getAccessToken())`
- `src/hooks/useAuthSettings.ts` — replace raw `['auth', 'sessions']` query key with `queryKeys.auth.sessions` (add to factory)
- `src/lib/queryClient.ts` — add `sessions` to the `auth` namespace in `queryKeys`
- `src/components/layout/Sidebar.tsx` — replace hardcoded name/initials/role with `useMe()` data
- `src/pages/settings/ProfileSettingsPage.tsx` — replace hardcoded `defaultValue` for name/handle with `useMe()` data; note: backend only provides `email` and `created_at`, so name/handle fields become email-derived until settings/account endpoint exists
- `src/pages/categories/CategoryListPage.tsx` — wire to `useCategories`; add loading/error/empty states; replace mock imports with hook data
- `src/pages/categories/CategoryFormPage.tsx` — react-hook-form + zod; create vs edit via `useCreateCategory` / `useUpdateCategory`; delete via `useDeleteCategory`; remove mock imports
- `src/pages/tags/TagListPage.tsx` — wire to `useTags`; add loading/error/empty states; replace mock imports with hook data
- `src/pages/tags/TagFormPage.tsx` — react-hook-form + zod; create vs edit via `useCreateTag` / `useUpdateTag`; delete via `useDeleteTag`; remove mock imports
- `src/data/mockCategories.ts` — rewrite to match new `Category` type (flat list, no icon/color/children)
- `src/data/mockTags.ts` — rewrite to match new `Tag` type (no color/transactionCount/totalAmount/lastUsed)
- `Affluena-API/docs/FRONTEND_API_MAPPING.md` — update stale "Backend gap" entries for forgot-password, reset-password, goals/:id/edit, settings/account, settings/security, settings/sessions
- `Affluena-API/docs/API_CONTRACT.md` — fix recurring `frequency` enum (remove `"daily"`); add `GET/DELETE /auth/sessions` endpoints; update logout note
- `Affluena-WEB/README.md` — remove stale line ~44 about "local demo data" / "intentionally not included"

### Deleted

None. Mock files are kept (rewritten) for cross-plan consumers.

---

## Tasks

### A. Hardcoded UI & Type Fixes (independent of categories/tags)

**Task 1.** Fix duplicate `AuthSession` type in `src/types/auth.ts`

- Rename the first interface (lines 10–20, the DB-row shape used by `listSessions`/`revokeSession`) to `AuthSessionRecord`
- Keep the second interface (lines 29–32, the `{ user, tokens }` wrapper returned by `login`/`register`/`refresh`) as `AuthSession`
- Update `src/api/auth.ts`: the `listSessions` return type → `AuthSessionRecord[]` (or `{ sessions: AuthSessionRecord[] }`)
- Update `src/hooks/useAuthSettings.ts`: `useSessions` return type → uses `AuthSessionRecord`
- Verify `npx tsc --noEmit` passes

**Task 2.** Fix `useMe` localStorage bypass in `src/hooks/useMe.ts`

- Add `import { getAccessToken } from '@/lib/token'`
- Replace the `enabled` check: `typeof window !== 'undefined' && Boolean(window.localStorage.getItem('affluena.access_token'))` → `Boolean(getAccessToken())`
- Remove any now-unused direct `localStorage` references
- Verify `useMe` still correctly disables the query when unauthenticated

**Task 3.** Add `sessions` to `queryKeys` factory in `src/lib/queryClient.ts`

- Add `sessions: ['auth', 'sessions'] as const` to the `auth` namespace in `queryKeys`
- Update `src/hooks/useAuthSettings.ts` to use `queryKeys.auth.sessions` instead of raw `['auth', 'sessions']`

**Task 4.** Replace Sidebar hardcoded values in `src/components/layout/Sidebar.tsx` lines ~102–110

- Import `useMe` from `@/hooks/useMe`
- Replace hardcoded `"AP"` initials with initials derived from `user.email` (first character of local part, uppercased)
- Replace hardcoded `"Aditya Prasetyo"` display name with `user.email` (backend only provides `email`; full name is a future settings/account concern)
- Replace hardcoded `"Personal Finance Pro"` subtitle with `"Affluena User"` or remove the subtitle line
- Handle loading state: show skeleton or no user block while `useMe` is fetching
- Handle unauthenticated state: hide user block or show "Sign in" CTA

**Task 5.** Replace ProfileSettingsPage hardcoded defaults in `src/pages/settings/ProfileSettingsPage.tsx` lines ~41, 45, 46, 49, 50

- Import `useMe` from `@/hooks/useMe`
- Replace `defaultValue="Aditya Prasetyo"` with `defaultValue={user?.email ?? ''}` for the full-name field (email-derived until backend supports name)
- Replace `defaultValue="@adty404"` handle with an empty or disabled field (backend has no handle concept)
- Replace `defaultValue="IDR"` currency with a placeholder or empty until a preferences endpoint exists
- Replace `defaultValue="Dashboard"` start-page and `defaultValue="Comfortable"` compact-mode with neutral defaults
- Add a comment noting these defaults will be replaced when Plan 11 (Settings cleanup) lands
- Verify `npx tsc --noEmit` passes

### B. Categories & Tags API Layer

**Task 6.** Rewrite `src/types/category.ts`

- Replace the mock-derived `Category` type with the backend shape: `{ id, user_id, parent_id?, name, type, created_at, updated_at }`
- Replace the mock `CategoryType` with `type CategoryType = 'income' | 'expense'`
- Add request/response types:
  ```ts
  export interface CategoryListResponse { categories: Category[]; pagination: Pagination }
  export interface CategoryCreateRequest { name: string; type: CategoryType; parent_id?: string }
  export interface CategoryUpdateRequest { name: string; type: CategoryType; parent_id?: string }
  ```
- Import `Pagination` from `src/api/types` (already exists)
- Verify `npx tsc --noEmit` passes (this will temporarily break pages — fixed in Task 13–16)

**Task 7.** Rewrite `src/types/tag.ts`

- Replace the mock-derived `Tag` type with the backend shape: `{ id, user_id, name, created_at, updated_at }`
- Add request/response types:
  ```ts
  export interface TagListResponse { tags: Tag[]; pagination: Pagination }
  export interface TagCreateRequest { name: string }
  export interface TagUpdateRequest { name: string }
  ```
- Import `Pagination` from `src/api/types`

**Task 8.** Create `src/schemas/category.ts`

- Mirror `src/schemas/wallet.ts` pattern
- `categoryTypeEnum = z.enum(['income', 'expense'])`
- `categoryCreateSchema = z.object({ name: z.string().min(1, 'Nama kategori wajib diisi'), type: categoryTypeEnum, parent_id: z.string().uuid().optional() })`
- `categoryUpdateSchema = categoryCreateSchema` (same fields allowed on update)
- Export `CategoryCreateFormValues = z.infer<typeof categoryCreateSchema>`
- Export `CategoryUpdateFormValues = z.infer<typeof categoryUpdateSchema>`
- Export `categoryTypeOptions = [{ label: 'Pemasukan', value: 'income' }, { label: 'Pengeluaran', value: 'expense' }]`
- Export `categoryTypeLabels: Record<CategoryType, string> = { income: 'Pemasukan', expense: 'Pengeluaran' }`

**Task 9.** Create `src/schemas/tag.ts`

- `tagCreateSchema = z.object({ name: z.string().min(1, 'Nama tag wajib diisi') })`
- `tagUpdateSchema = z.object({ name: z.string().min(1, 'Nama tag wajib diisi') })`
- Export `TagCreateFormValues = z.infer<typeof tagCreateSchema>`
- Export `TagUpdateFormValues = z.infer<typeof tagUpdateSchema>`

**Task 10.** Create `src/api/categories.ts`

- Mirror `src/api/wallets.ts` pattern
- `listCategories(params: ListParams & { type?: CategoryType })` — adds `type` to query; calls `apiFetch<CategoryListResponse>('/api/v1/categories', { method: 'GET', query: { ...params, type: params.type } })`
- `getCategory(id: string)` — `apiFetch<Category>(`/api/v1/categories/${id}`, { method: 'GET' })`
- `createCategory(data: CategoryCreateRequest)` — `apiFetch<Category>('/api/v1/categories', { method: 'POST', body: data })`
- `updateCategory(id: string, data: CategoryUpdateRequest)` — `apiFetch<Category>(`/api/v1/categories/${id}`, { method: 'PUT', body: data })`
- `deleteCategory(id: string)` — `apiFetch<void>(`/api/v1/categories/${id}`, { method: 'DELETE' })`
- Import types from `src/types/category`

**Task 11.** Create `src/api/tags.ts`

- `listTags(params: ListParams)` — `apiFetch<TagListResponse>('/api/v1/tags', { method: 'GET', query: { ... } })`
- `getTag(id: string)` — `apiFetch<Tag>(`/api/v1/tags/${id}`, { method: 'GET' })`
- `createTag(data: TagCreateRequest)` — `apiFetch<Tag>('/api/v1/tags', { method: 'POST', body: data })`
- `updateTag(id: string, data: TagUpdateRequest)` — `apiFetch<Tag>(`/api/v1/tags/${id}`, { method: 'PUT', body: data })`
- `deleteTag(id: string)` — `apiFetch<void>(`/api/v1/tags/${id}`, { method: 'DELETE' })`

**Task 12.** Create `src/hooks/useCategories.ts`

- Mirror `src/hooks/useWallets.ts` pattern
- `useCategories(params?)` — `useQuery({ queryKey: queryKeys.categories.list(params?.type), queryFn: () => listCategories(params), enabled: true })`
- `useCategory(id)` — `useQuery({ queryKey: queryKeys.categories.detail(id), queryFn: () => getCategory(id!), enabled: Boolean(id) })`
- `useCreateCategory()` — `useMutation({ mutationFn: createCategory, onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.categories.all }) })`
- `useUpdateCategory()` — `useMutation({ mutationFn: ({ id, data }) => updateCategory(id, data), onSuccess: (_d, { id }) => { qc.invalidateQueries({ queryKey: queryKeys.categories.all }); qc.invalidateQueries({ queryKey: queryKeys.categories.detail(id) }) } })`
- `useDeleteCategory()` — `useMutation({ mutationFn: deleteCategory, onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.categories.all }) })`

**Task 13.** Create `src/hooks/useTags.ts`

- Same pattern as `useCategories`
- `useTags(params?)`, `useTag(id)`, `useCreateTag()`, `useUpdateTag()`, `useDeleteTag()`
- Use `queryKeys.tags.list()`, `queryKeys.tags.detail(id)`, `queryKeys.tags.all`

### C. Page Wiring (depends on Tasks 6–13)

**Task 14.** Wire `src/pages/categories/CategoryListPage.tsx`

- Remove `import { mockCategories, flatCategories } from '@/data/mockCategories'`
- Import `useCategories` from `@/hooks/useCategories`
- Render two lists: `useCategories({ type: 'income' })` and `useCategories({ type: 'expense' })` or a single `useCategories()` with client-side grouping
- Add loading skeleton (reuse pattern from WalletListPage)
- Add error state with retry button
- Add empty state with CTA link to `/categories/new`
- Remove all `icon` and `color` column rendering; style rows based on `type` (income=green, expense=red accent)
- Replace tree rendering: build tree client-side from flat list using `parent_id`
- Verify `npx tsc --noEmit` passes

**Task 15.** Wire `src/pages/categories/CategoryFormPage.tsx`

- Remove `import { flatCategories } from '@/data/mockCategories'`
- Import `useForm` from `react-hook-form`, `zodResolver` from `@hookform/resolvers/zod`
- Import `categoryCreateSchema`, `categoryUpdateSchema`, `categoryTypeOptions`, `categoryTypeLabels` from `@/schemas/category`
- Import `useCreateCategory`, `useUpdateCategory`, `useDeleteCategory` from `@/hooks/useCategories`
- Import `useCategory` from `@/hooks/useCategories` for edit mode (via `useParams`)
- Determine create vs edit mode from URL (`/categories/new` vs `/categories/:id/edit`)
- Create mode: empty form, `useCreateCategory` mutation on submit
- Edit mode: pre-fill from `useCategory(id)`, `useUpdateCategory` mutation on submit
- Delete: use `useDeleteCategory` inside confirmation modal
- Add `parent_id` selector (dropdown of categories of the same `type`, max depth validation enforced client-side)
- Remove all hardcoded color options
- Add toast on success, inline error on validation failure
- Navigate to `/categories` on success

**Task 16.** Wire `src/pages/tags/TagListPage.tsx`

- Remove `import { mockTags } from '@/data/mockTags'`
- Import `useTags` from `@/hooks/useTags`
- Add loading skeleton, error state, empty state with CTA
- Remove `color` column and `transactionCount`/`totalAmount`/`lastUsed` columns
- Render tag pills with deterministic color derived from `name` hash
- Remove "Tagged Preview" hardcoded rows or make them dynamic based on real data
- Verify `npx tsc --noEmit` passes

**Task 17.** Wire `src/pages/tags/TagFormPage.tsx`

- Remove `import { mockTags } from '@/data/mockTags'`
- Import `useForm`, `zodResolver`, `tagCreateSchema`, `tagUpdateSchema`
- Import `useCreateTag`, `useUpdateTag`, `useDeleteTag` from `@/hooks/useTags`
- Import `useTag` for edit mode
- Create mode: empty form, `useCreateTag` mutation on submit
- Edit mode: pre-fill from `useTag(id)`, `useUpdateTag` mutation on submit
- Delete: `useDeleteTag` inside confirmation modal
- Remove hardcoded color options
- Add toast on success, inline error on validation failure
- Navigate to `/tags` on success

**Task 18.** Rewrite `src/data/mockCategories.ts`

- Replace mock data array with objects matching the new `Category` type (flat list, `id` as UUID-like strings, `parent_id` references, no `icon`/`color`/`monthlyUsage`/`transactionCount`/`children` fields)
- Preserve `flatCategories` export (now simply the array itself since it's already flat, or `mockCategories.flatMap(...)` if nesting helper is desired)
- Type-check against `Category` from `@/types/category`
- Add `// @deprecated — Use useCategories() hook instead. Kept for cross-plan consumers.` comment

**Task 19.** Rewrite `src/data/mockTags.ts`

- Replace mock data with objects matching the new `Tag` type (`id`, `user_id`, `name`, `created_at`, `updated_at`; no `color`/`transactionCount`/`totalAmount`/`lastUsed`)
- Type-check against `Tag` from `@//types/tag`
- Add `// @deprecated — Use useTags() hook instead. Kept for cross-plan consumers.` comment

### D. Stale Documentation Updates (independent, can run in parallel)

**Task 20.** Update `Affluena-API/docs/FRONTEND_API_MAPPING.md`

- Line ~10: Change `/forgot-password` **Backend gap** → `POST /api/v1/auth/forgot-password` (implemented in Phase 3)
- Line ~11: Change `/reset-password` **Backend gap** → `POST /api/v1/auth/reset-password` (implemented in Phase 3)
- Line ~74: Change `/goals/:id/edit` **Backend gap** → `PUT /api/v1/goals/:id` (implemented, commit 7b8d319)
- Lines ~86–88: Change `/settings/account`, `/settings/security`, `/settings/sessions` **Backend gap** → now implemented (Phase 2):
  - `/settings/account` → `PUT /api/v1/auth/me` (or appropriate endpoint)
  - `/settings/security` → `PUT /api/v1/auth/password`
  - `/settings/sessions` → `GET /api/v1/auth/sessions`, `DELETE /api/v1/auth/sessions/:id`
- Scan remaining "Backend gap" entries and update any others that are now implemented

**Task 21.** Update `Affluena-API/docs/API_CONTRACT.md`

- Fix the `frequency` enum in the Recurring section: change `"daily"|"weekly"|"monthly"` to `"weekly"|"monthly"` (actual code only accepts weekly/monthly)
- Replace the "Logout/Revoke is handled purely client-side (token deletion) currently" note with actual session management endpoints:
  - `GET /api/v1/auth/sessions` → `{ sessions: [...], pagination: {...} }` (list sessions)
  - `DELETE /api/v1/auth/sessions/:id` → revoke a specific session (except current)
- Add `POST /api/v1/auth/forgot-password` and `POST /api/v1/auth/reset-password` to the Auth section

**Task 22.** Update `Affluena-WEB/README.md`

- Remove line ~44: `"Data is still local demo data under src/data; backend/API integration is intentionally not included."`
- Replace with: `"Auth and Wallets pages use live backend APIs. Other pages (Categories, Tags, Transactions, etc.) still use mock data until their respective integration plans land."`

### E. QA E2E Tests (depends on B tasks being complete)

**Task 23.** Create `Affluena-QA/helpers/categories.ts`

- Mirror `helpers/wallets.ts` pattern
- Define `Category` interface matching backend shape
- Define `CategoryListResponse` interface
- Define `CreateCategoryPayload` interface
- Implement: `createCategory`, `listCategories`, `getCategory`, `deleteCategory`, `rawCreateCategory`, `rawUpdateCategory`
- Each function takes `(request: APIRequestContext, accessToken: string, ...)` and hits the backend at `${backendBase()}/api/v1/categories...`

**Task 24.** Create `Affluena-QA/helpers/tags.ts`

- Same pattern as `helpers/categories.ts`
- Define `Tag` interface, `TagListResponse` interface, `CreateTagPayload` interface
- Implement: `createTag`, `listTags`, `getTag`, `deleteTag`, `rawCreateTag`, `rawUpdateTag`

**Task 25.** Create `Affluena-QA/tests/categories/category-crud.spec.ts`

- Mirror `tests/wallets/wallet-create.spec.ts` pattern (Pattern B: API bootstrap + `addInitScript`)
- Import `test, expect` from `'../../fixtures/user'`
- Use `registerUser` + `generateEmail` from `'../../helpers/api-client'`
- Test cases:
  - List categories (empty state) — `GET /categories?type=income` returns empty
  - Create income category via UI — fill name, select type "Pemasukan", submit, verify in list
  - Create expense category via UI — fill name, select type "Pengeluaran", submit, verify
  - Create sub-category — select parent, verify max depth enforcement
  - Edit category — navigate to edit, change name, verify update
  - Delete category — confirm modal, verify gone from list
  - Validation: empty name blocks submit — `expect(page.locator('.form-error')).toContainText(/wajib diisi/i)`
  - Type filter: list shows only income categories when filtered
- Tag describe block with `@smoke`

**Task 26.** Create `Affluena-QA/tests/tags/tag-crud.spec.ts`

- Same pattern as category tests
- Test cases:
  - List tags (empty state)
  - Create tag via UI — fill name, submit, verify in list
  - Edit tag — change name, verify update
  - Delete tag — confirm modal, verify gone
  - Validation: empty name blocks submit
  - Duplicate name check (if backend enforces uniqueness)
- Tag with `@smoke`

---

## Acceptance Criteria

- [ ] `npx tsc --noEmit` clean (zero errors) in Affluena-WEB
- [ ] `npm run build` succeeds in Affluena-WEB
- [ ] `npx vitest run` passes (existing test suite)
- [ ] `npm run typecheck` passes in Affluena-QA
- [ ] Manual browser smoke: create income category → see it in list → edit name → delete
- [ ] Manual browser smoke: create tag → see it in list → edit name → delete
- [ ] Manual browser smoke: Sidebar shows authenticated user's email (not "Aditya Prasetyo")
- [ ] Manual browser smoke: ProfileSettingsPage shows email-derived defaults (not "Aditya Prasetyo")
- [ ] Manual browser smoke: no duplicate AuthSession type errors
- [ ] Playwright E2E (Affluena-QA) `npx playwright test tests/categories/ tests/tags/` passes against live backend + dev server
- [ ] FRONTEND_API_MAPPING.md has no stale "Backend gap" entries for forgot-password, reset-password, goals/:id/edit, settings/account, settings/security, settings/sessions
- [ ] API_CONTRACT.md recurring frequency enum matches actual code (weekly|monthly only)
- [ ] API_CONTRACT.md includes session management endpoints
- [ ] README.md no longer claims "intentionally not included" for backend integration

## Known Limitations

- **No category icon field**: Backend does not provide an icon string or emoji. The list/form pages drop the icon column and selector. Can be re-added if the backend adds an `icon` field in a later sprint.
- **No category color field**: Backend does not provide a color. UI derives visual distinction from `type` (income=green accent, expense=red accent).
- **No tag color field**: Same as category color — pills use a deterministic hash of `name` for visual variety.
- **No tag transaction count or last-used date**: Backend returns only `id`, `user_id`, `name`, `created_at`, `updated_at`. Analytics columns removed from list page. Will re-appear when a `/tags/:id/stats` endpoint is scoped.
- **No category transaction count or monthly usage**: Same limitation. Stats removed from list page.
- **User name not available from backend**: `GET /api/v1/auth/me` returns only `id, email, created_at, updated_at`. Sidebar and profile show email-derived info. Full name requires a settings/account endpoint (Plan 11).
- **Mock files retained**: `mockCategories.ts` and `mockTags.ts` are kept (rewritten to new shape) for cross-plan consumers. Remove when transaction/budget pages are wired.

## Follow-up Plans

- **Plan 4:** Transactions (will consume `category_id` and `tag_ids` from real API, drop remaining mock imports)
- **Plan 5:** Budgets (will consume categories from real API)
- **Plan 7:** Debts (will drop mock import if any)
- **Plan 8:** Goals (will drop mock import if any)
- **Plan 11:** Settings cleanup (will add full name / handle / preferences when backend adds a user update endpoint)

---

## Commit Strategy

Atomic commits in order, one per task group. Each commit leaves `tsc --noEmit` and `build` clean.

| Commit | Tasks | Branch | Message |
|--------|-------|--------|---------|
| 1 | 1–3 | `feat/plan-3-categories-tags` | `fix(auth): rename AuthSession duplicate to AuthSessionRecord, fix useMe localStorage bypass, add sessions queryKey` |
| 2 | 4–5 | `feat/plan-3-categories-tags` | `fix(ui): replace Sidebar and ProfileSettingsPage hardcoded user values with useMe data` |
| 3 | 6–9 | `feat/plan-3-categories-tags` | `feat(types,schemas): add backend-aligned Category/Tag types and Zod schemas` |
| 4 | 10–13 | `feat/plan-3-categories-tags` | `feat(api,hooks): add categories/tags API modules and TanStack Query hooks` |
| 5 | 14–17 | `feat/plan-3-categories-tags` | `feat(pages): wire CategoryListPage, CategoryFormPage, TagListPage, TagFormPage to live API` |
| 6 | 18–19 | `feat/plan-3-categories-tags` | `chore(data): rewrite mockCategories/mockTags to match backend types` |
| 7 | 20–22 | `feat/plan-3-categories-tags` | `docs: update FRONTEND_API_MAPPING, API_CONTRACT, and README stale entries` |
| 8 | 23–26 | `feat/plan-3-categories-tags` | `test(qa): add categories and tags CRUD E2E specs with helpers` |
