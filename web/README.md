# Halka — web

Next.js 16 (App Router) + TypeScript + Tailwind v4 web app. Talks to the Halka Soroban contract
(`../contracts/circle`) through the Freighter wallet.

## Run it

```bash
npm install
npm run dev      # http://localhost:3010
npm run build
```

## Contract integration

`src/lib/contracts/circle.ts` is a type-safe client generated for the deployed testnet contract
via `stellar contract bindings typescript` and relocated here (if regenerated, it needs to be
copied back over — it isn't kept as a standalone npm package).

- `src/lib/circle-client.ts` — read-only and wallet-signed client constructors
- `src/lib/wallet.tsx` — Freighter connection context (`useWallet()`)
- `src/lib/use-circle.ts` — SWR-based hook for reading circle state
- `src/lib/errors.ts` — maps contract error codes to plain-language user-facing messages

## Pages

- `/` — circle creation form
- `/circle/[id]` — round-status dashboard (deposit/payout/reclaim actions)
- `/circle/[id]/join` — join-via-invite-link flow

## Notes

- Token addresses (native XLM SAC, testnet USDC SAC) are hardcoded in `src/lib/config.ts` — both
  are public/testnet information, so no env variable was needed.
- `eslint.config.mjs` excludes the generated `src/lib/contracts/**` file from linting (it's
  regeneratable code and shouldn't be hand-edited).
