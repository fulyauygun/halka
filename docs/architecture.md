# Architecture and setup

## Setup (local development)

### Contract

```bash
# Rust + Soroban target
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
rustup target add wasm32v1-none

# Stellar CLI (macOS/Homebrew)
brew install stellar-cli

# Test and build
cargo test --workspace
stellar contract build

# Testnet deploy
stellar keys generate deployer --network testnet --fund
stellar contract deploy \
  --wasm target/wasm32v1-none/release/circle.wasm \
  --source deployer --network testnet --alias circle
```

### Web app

```bash
cd web
npm install
npm run dev   # http://localhost:3010
```

If the contract changes, the TypeScript bindings need to be regenerated:

```bash
stellar contract bindings typescript \
  --contract-id <CONTRACT_ID> --network testnet \
  --output-dir web/src/contracts/circle --overwrite
cp web/src/contracts/circle/src/index.ts web/src/lib/contracts/circle.ts
rm -rf web/src/contracts
```

## Data model

```
Circle
├── creator: Address
├── token: Address                 (pooled SAC — native XLM or USDC)
├── members: Vec<Address>          (fixed, invite-only)
├── payout_order: Vec<Address>     (a permutation of members)
├── contribution_amount: i128
├── round_index: u32               (current round within payout_order)
├── round_deposit_count: u32
├── round_deadline: u64            (meaningful once Active)
├── round_timeout_secs: u64
└── status: Forming | Active | Completed

Storage (per circle_id):
├── Joined(circle_id, member) -> bool
└── Deposited(circle_id, round_index, member) -> bool
```

**Lifecycle:** `create_circle` → (every member calls `join_circle`) → once all members have
joined, `Forming → Active` and the first round's `round_deadline` is set → each round: N
deposits + 1 payout → `round_index` advances, new deadline set → after the last round,
`Active → Completed`.

## Contract function reference

| Function | Auth | Description |
| --- | --- | --- |
| `create_circle(creator, token, members, payout_order, contribution_amount, round_timeout_secs) -> u64` | `creator` | Creates a new circle, returns its `circle_id`. `members.len() >= 2`, and `payout_order` must be a permutation of `members`. |
| `join_circle(circle_id, member)` | `member` | Confirms an invited member's participation. The circle becomes `Active` once every member has joined. |
| `deposit(circle_id, member)` | `member` (+ token transfer auth) | Pulls the fixed contribution from `member` into the contract. Once per round. |
| `payout(circle_id)` | — (permissionless) | Once a round is complete (`round_deposit_count == members.len()`), pays the full pool to the member whose turn it is. |
| `reclaim(circle_id, member)` | `member` | Once the round's timeout has passed, lets `member` withdraw their own contribution. |
| `get_circle(circle_id) -> Circle` | — | Read-only. |
| `has_joined(circle_id, member) -> bool` | — | Read-only. |
| `has_deposited_current_round(circle_id, member) -> bool` | — | Read-only. |

## Design decisions and rationale

- **`payout` is permissionless:** the contract already enforces its own invariant from state
  (it won't pay out without a full round of deposits), so restricting the caller to a specific
  party would only add a single point of failure, not any additional safety.
- **`reclaim` is per-member after a timeout:** if a round stalls (a member fails to deposit),
  the other members' funds don't stay locked forever — each of them can independently withdraw
  their own share.
- **Fixed `payout_order`:** V1 scope was deliberately kept narrow; a random/fair ordering
  (drand-based) is a planned V2 (see the project SOW's "Out-of-Scope" section).
- **CLI demos use native XLM:** the testnet USDC SAC is verified and ready to use
  (`CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA`), but since Circle's faucet
  (faucet.circle.com) requires a manual browser step, the CLI-driven verification runs used
  native XLM instead — since the contract's `token` parameter is generic, switching to USDC in
  production is just a different address, no contract changes needed.

## Known limitations

- No random/fair payout-order draw (V1: fixed order, set by the creator).
- No late-payment/default penalty mechanism (only reclaim-after-timeout).
- No yield generation on the pool balance (V2 roadmap: Blend integration).
- Fiat on/off ramps, a mobile app, and passkey onboarding are out of scope.
- No security audit has been performed — this is a testnet/hackathon-scope prototype.
