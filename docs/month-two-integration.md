# Month Two: integration and verification

This note records the Month Two implementation for the Halka Instaward. The contract remains
the final authority for deposits, payouts, and reclaims. The web app has no key generation,
custody, recovery, export, or server-side signing path.

## Regression checks

The contract unit suite covers the lifecycle and contract invariants locally:

```sh
cargo test --workspace
```

The web integration harness runs against the deployed testnet contract. It creates fresh circles
on each run and exercises create, join, deposit, payout, timeout reclaim, duplicate deposit,
non-member deposit, incomplete-round payout, early reclaim, and reclaim by an address without a
recorded deposit. It uses native testnet XLM and writes newline-delimited JSON with scenario,
outcome, time, and transaction hash to `docs/testnet-regression.jsonl`.

Never put secret keys in the repository or shell command history. Use dedicated, funded **testnet**
accounts and provide the following environment variables to the local run:

```sh
export HALKA_TESTNET_CREATOR_SECRET='S...'
export HALKA_TESTNET_MEMBER1_SECRET='S...'
export HALKA_TESTNET_MEMBER2_SECRET='S...'
export HALKA_TESTNET_OUTSIDER_SECRET='S...'
cd web
npm ci
npm run test:contract
```

The default fixture addresses are the existing `deployer`, `member1`, `member2`, and `member4`
accounts in [testnet-accounts.md](testnet-accounts.md); member4 serves as the non-member in the
two circles created by the harness. Secrets stay in the local Stellar CLI identity store; export
them locally only when you choose to run the harness. Each run creates new circles and sends
testnet transactions. The rejection cases are simulated and are never submitted. Adjust the
fixture accounts and environment variables if using separate dedicated accounts.

## Wallet flow and preflight

Stellar Wallets Kit is configured for Testnet and limited in the Halka picker to Varial (the
Freighter-compatible wallet), Albedo, and Hana. The user selects and connects a wallet in the Kit
modal. Halka keeps only the connected public address and wallet display name in React state; it
does not persist credentials or signing material. Transaction envelopes and Soroban authorization
entries are delegated to the selected wallet for signatures.

For deposit, payout, and reclaim, Halka fetches the circle through the existing read-only contract
client, reads the latest Testnet ledger timestamp, and checks the current round, membership,
deposit status, payout eligibility, or reclaim deadline. It then constructs the unsigned contract
invocation through the generated Soroban client. That client simulates the invocation through
Soroban RPC before `signAndSend` can request a wallet signature. A simulation result in error is
shown to the user and is not submitted. These checks can become stale; the contract enforces every
rule again at execution.

When a round is incomplete, the dashboard also offers a read-only “Check why payout is unavailable”
action. It simulates `payout` through Soroban RPC and displays the mapped `RoundNotComplete`
message without requesting a wallet signature or submitting a transaction.

| Contract condition | Message shown before signature |
| --- | --- |
| `AlreadyDepositedThisRound` | You've already deposited your contribution for this round. |
| `NotMember` | Your connected wallet is not an eligible member of this circle. |
| `RoundNotComplete` | Not all members have contributed for this round yet. |
| `RoundNotTimedOut` | The reclaim window for this round hasn't opened yet. |
| `NothingToReclaim` | You have no contribution to reclaim. |
| Soroban simulation returns a contract error | The mapped plain-language contract message; no signature is requested. |

## Wallet compatibility and acceptance report

The app is wired to the three requested Kit modules. A connected-wallet acceptance run must still
be performed in a browser with each wallet available; this repository has not recorded those
manual runs or their transaction hashes yet.

| Wallet | Connection/signing integration | Manual testnet result | Known limitation / fallback |
| --- | --- | --- | --- |
| Freighter / Varial | Implemented through Stellar Wallets Kit | Not run in this environment | If unavailable, select another listed wallet or install the wallet and retry. |
| Albedo | Implemented through Stellar Wallets Kit | Not run in this environment | Opens Albedo's external approval flow; if unavailable, select another listed wallet. |
| Hana | Implemented through Stellar Wallets Kit | Not run in this environment | Requires the Hana wallet to be available in the browser; otherwise select another listed wallet. |

For each manual check, record connection, displayed account, one signed circle action, confirmation,
and refreshed circle state. Record the wallet name, action, outcome, and transaction hash here after
the check. Run the UI demonstration using [ui-demo-runbook.md](ui-demo-runbook.md). No transaction
hashes or video are claimed until the corresponding wallet run has actually occurred.

## Commands

```sh
cargo test --workspace
cd web && npm ci && npm run lint && npx tsc --noEmit && npm run build
```
