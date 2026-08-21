# Evidence package (SOW §6.1)

Maps directly to the Instaward SOW's "Planned Evidence to Be Submitted" table.

## Deliverable 1 — Soroban contract

| Item | Value |
| --- | --- |
| Repo | https://github.com/fulyauygun/halka |
| Contract source | [contracts/circle/src](../contracts/circle/src) |
| Testnet contract ID | `CBOGI62MN5V3M7QSOKS7E6YWLLAO73LJIS3TMBMEFIADG2LDC37HUI5Q` |
| Explorer | https://stellar.expert/explorer/testnet/contract/CBOGI62MN5V3M7QSOKS7E6YWLLAO73LJIS3TMBMEFIADG2LDC37HUI5Q |
| Unit tests | 21 tests, `cargo test --workspace` — runs in CI on every push |
| End-to-end verification | [docs/week2-e2e-verification.md](week2-e2e-verification.md), [docs/week4-demo-tx-log.md](week4-demo-tx-log.md) (native XLM SAC), [docs/usdc-verification.md](usdc-verification.md) (real testnet Circle USDC SAC, per the SOW's "testnet USDC" spec) |

## Deliverable 2 — Web application

| Item | Value |
| --- | --- |
| Live URL | https://web-psi-liart-24.vercel.app |
| Source | [web/src](../web/src) |
| Flows | Circle creation (`/`), join via invite (`/circle/[id]/join`), round-status dashboard + deposit/payout/reclaim (`/circle/[id]`) |
| Proof of live contract connection | Circles #0 and #1 render on the dashboard with correct, live state — matching the tx-hash logs above exactly |
| Screenshots | [docs/screenshots/](screenshots/) — [home / create-circle form](screenshots/01-home-create-circle.png), [circle #0 dashboard, completed](screenshots/02-circle-0-completed.png), [circle #1 dashboard, completed](screenshots/03-circle-1-completed.png), [join flow, closed-invitation state](screenshots/04-join-flow-closed.png). Captured directly from the live URL above during Ambassador review. |

## Deliverable 3 — Demo (optional)

| Item | Value |
| --- | --- |
| Full 5-member / 5-round cycle (CLI, real testnet) | [docs/week4-demo-tx-log.md](week4-demo-tx-log.md) — 36 transactions, all independently verifiable on stellar.expert |
| Full 3-member / 3-round cycle with real testnet USDC (CLI, real testnet) | [docs/usdc-verification.md](usdc-verification.md) — 11 transactions, all independently verifiable on stellar.expert |
| UI + video (real Freighter wallet) | To be completed by the user — see [docs/ui-demo-runbook.md](ui-demo-runbook.md). This is the one remaining piece: it requires entering a wallet private key into the browser and clicking through Freighter's own signing prompts, which cannot be done by an AI agent regardless of authorization — it has to be a human at the keyboard. |
| README / architecture doc | [docs/architecture.md](architecture.md) |

## General

| Item | Value |
| --- | --- |
| Main README | [README.md](../README.md) |
| CI status | [GitHub Actions](https://github.com/fulyauygun/halka/actions) — contracts + web jobs on every push |
| Testnet accounts | [docs/testnet-accounts.md](testnet-accounts.md) |
