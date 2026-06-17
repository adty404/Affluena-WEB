# Wallets Smoke Checklist

Date: 2026-06-18
Branch: `feat/backend-integration-wallets`

## Automated (verified 2026-06-18)

- [x] TypeScript: `npx tsc --noEmit` → no errors
- [x] Build: `npm run build` → success
- [x] Unit tests: `npx vitest run` → 10/10 pass (foundation suite)

## Manual (browser, pending dev-server session)

- [ ] **List**: visit `/wallets` with 0 wallets → empty state shows CTA
- [ ] **Create**: click "Create Wallet", fill form, submit → redirect to `/wallets`, new wallet visible
- [ ] **Currency validation**: type 2-letter code → form shows "Mata uang 3 huruf"
- [ ] **Opening balance parsing**: type `Rp 1.000.000` → minor unit shows `1.000.000` (1M IDR)
- [ ] **Detail**: click a wallet → metadata panel shows correct name/type/balance/role
- [ ] **Edit**: change wallet name → PUT succeeds, list updates
- [ ] **Edit balance disabled**: no balance input on edit form (only on create)
- [ ] **Delete**: click Delete → modal confirm → wallet gone from list
- [ ] **Sharing**: visit `/wallets/:id/sharing` → shows current user role/status, invite form visible
- [ ] **Invite**: submit email → toast "Undangan terkirim"; backend logs POST `/wallets/:id/invites`
- [ ] **Error state**: stop backend, refresh list → error card shows server message
- [ ] **Loading state**: hard refresh while slow network → "Memuat…" skeleton

## Backend smoke (curl)

```bash
TOK=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H 'content-type: application/json' \
  -d '{"email":"<your-email>","password":"<your-password>"}' \
  | python3 -c "import sys,json;print(json.load(sys.stdin)['tokens']['access_token'])")

curl -s http://localhost:8080/api/v1/wallets -H "authorization: Bearer $TOK" | python3 -m json.tool
```

Expected: `{ "wallets": [...], "pagination": { "total": N, "limit": 100, "offset": 0 } }`
