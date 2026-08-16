# Halka — Digital "Altın Günü"

A dApp that digitizes Türkiye's traditional altın günü / rotating savings circle model on
Stellar Soroban, without custody risk. A group pays a fixed contribution every round; the pool
is automatically paid out to the member whose turn it is once that round is complete — the money
is never held by a single person or institution.

Built as part of a 30-day Stellar Instaward.

## Project structure

```
.
├── contracts/
│   └── circle/           # Rust/Soroban contract: create_circle, join_circle, deposit, payout, reclaim
│       ├── src/lib.rs
│       └── src/test.rs
├── web/                  # Next.js web app (Freighter wallet integration) — Week 3
├── docs/                 # Architecture doc, demo transaction-hash log
├── .github/workflows/    # CI: cargo test + stellar contract build
└── Cargo.toml            # Workspace root
```

## Contract development

```bash
cargo test --workspace        # run unit tests (21 tests)
stellar contract build        # build for the wasm32v1-none target
```

## Testnet

- **Contract ID:** `CBOGI62MN5V3M7QSOKS7E6YWLLAO73LJIS3TMBMEFIADG2LDC37HUI5Q`
- **Web app (live):** https://web-psi-liart-24.vercel.app
- End-to-end verification (tx-hash log): [docs/week2-e2e-verification.md](docs/week2-e2e-verification.md), [docs/week4-demo-tx-log.md](docs/week4-demo-tx-log.md) (native XLM SAC), [docs/usdc-verification.md](docs/usdc-verification.md) (real testnet Circle USDC SAC)
- Architecture & setup: [docs/architecture.md](docs/architecture.md)
- Evidence package (SOW §6.1): [docs/evidence-package.md](docs/evidence-package.md)
- UI demo + video runbook (Deliverable 3, optional — to be completed by the user): [docs/ui-demo-runbook.md](docs/ui-demo-runbook.md)
- Testnet accounts: [docs/testnet-accounts.md](docs/testnet-accounts.md)

## Web app

```bash
cd web
npm install
npm run dev      # http://localhost:3010 (see .claude/launch.json)
```

Next.js 16 (App Router) + TypeScript + Tailwind v4. Contract integration goes through a
type-safe client generated with `stellar contract bindings typescript` and relocated to
`web/src/lib/contracts/circle.ts`; wallet connection is via Freighter (`@stellar/freighter-api`).
See [web/README.md](web/README.md) for details.

## Status

- [x] Environment setup (Rust + wasm32v1-none + Stellar CLI)
- [x] Workspace scaffold
- [x] Circle/Member data model
- [x] create_circle / join_circle
- [x] deposit / payout / reclaim
- [x] Testnet deploy + CLI end-to-end verification
- [x] Web app (Freighter) — live on Vercel, connected to the real testnet contract
- [x] Full 5-member/5-round demo cycle (CLI, real testnet) + evidence package
- [x] Full 3-member/3-round demo cycle with real testnet USDC (CLI, real testnet)
- [ ] UI + video demo (Deliverable 3, optional — to be completed by the user with their own Freighter wallet, see runbook)
