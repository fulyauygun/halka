# Halka — web

Next.js 16 (App Router) + TypeScript + Tailwind v4 web app. Talks to the Halka Soroban contract
(`../contracts/circle`) through Stellar Wallets Kit.

## Run it

```bash
npm install
npm run dev      # http://localhost:3010
npm run build
npm run test:contract # requires dedicated testnet account secrets; see ../docs/month-two-integration.md
```

## Contract integration

`src/lib/contracts/circle.ts` is a type-safe client generated for the deployed testnet contract
via `stellar contract bindings typescript` and relocated here (if regenerated, it needs to be
copied back over — it isn't kept as a standalone npm package).

- `src/lib/circle-client.ts` — read-only, wallet-signed, and transaction preflight helpers
- `src/lib/wallet.tsx` — Stellar Wallets Kit connection context (`useWallet()`)
- `src/lib/use-circle.ts` — SWR-based hook for reading circle state
- `src/lib/errors.ts` — maps contract error codes to plain-language user-facing messages

The picker is limited to Freighter/Varial, Albedo, and Hana. The Kit signs transactions and Soroban
authorization entries in the selected wallet. Halka never stores private keys or signing material.
Before deposit, payout, or reclaim, the app checks current circle state and constructs the unsigned
Soroban call, which is simulated by Soroban RPC before the wallet is asked to sign. Simulation is
advisory; contract rules remain authoritative. See [the Month Two integration report](../docs/month-two-integration.md).

## Pages

- `/` — circle creation form
- `/circle/[id]` — round-status dashboard (deposit/payout/reclaim actions)
- `/circle/[id]/join` — join-via-invite-link flow

## Notes

- Token addresses (native XLM SAC, testnet USDC SAC) are hardcoded in `src/lib/config.ts` — both
  are public/testnet information, so no env variable was needed.
- `eslint.config.mjs` excludes the generated `src/lib/contracts/**` file from linting (it's
  regeneratable code and shouldn't be hand-edited).
