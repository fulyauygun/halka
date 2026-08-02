# Week 2 — Testnet end-to-end verification

## Deploy

- **Contract ID:** `CBOGI62MN5V3M7QSOKS7E6YWLLAO73LJIS3TMBMEFIADG2LDC37HUI5Q`
- **Wasm hash:** `0825ab30038a798e426c05c7ba158c353f829799440750dab20d2f97f2b5b685`
- Upload tx: [c1b74c58...fc3df6b](https://stellar.expert/explorer/testnet/tx/c1b74c58c1d9d15a3d8e382cd42f8d38c82d12f0c7df55f8b692d0808fc3df6b)
- Create-instance tx: [7cc03d1c...9777d1](https://stellar.expert/explorer/testnet/tx/7cc03d1c742b4a149c264ebaa97b5fc5b625763640c04d8c1aa384e3589777d1)

## Token used

This verification run used **native XLM's Stellar Asset Contract**
(`CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC`) as the pooled token —
`deployer`/`member1-5` were already funded with XLM via Friendbot, so no extra trustline/mint
setup was needed. The contract's `token` parameter is fully generic (it accepts any SAC address),
so this run is a direct proof that the deposit/payout logic works correctly on the real chain.

The official Circle testnet USDC SAC address has also been verified and is ready to use in
future runs (Week 3/4):
- USDC issuer: `GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5`
- USDC SAC: `CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA` (live, verified via a `symbol()` call)
- To get testnet USDC: [faucet.circle.com](https://faucet.circle.com) (select Stellar, enter the test address) — requires a manual/browser step.

## Scenario: circle_id 0, 3 members, 3 rounds, contribution = 10 XLM/round

| Step | Who | Tx |
| --- | --- | --- |
| `create_circle` | deployer (creator) | [02678e19...4f95d43](https://stellar.expert/explorer/testnet/tx/02678e19ab93dd35bfb6627aeb87e73fa52f12f259adf2ba576e6bb264f95d43) |
| `join_circle` | member1 | [328c7e82...96641](https://stellar.expert/explorer/testnet/tx/328c7e82d05d0d0922bf0345289c5548b4b6b1cebd04b7b16d738d6315496641) |
| `join_circle` | member2 | [3b5b39ab...8f3e47](https://stellar.expert/explorer/testnet/tx/3b5b39abf80cae4ea32d868489104303f42804939f6c115d3a3c4f5a808f3e47) |
| `join_circle` | member3 | [d1679046...b9172ff](https://stellar.expert/explorer/testnet/tx/d1679046b27b7621015649e4547d0975e2a3c46746a2a65fec8582274b9172ff) |
| `deposit` (round 0) | member1 | [80b505c8...a0b85bb5](https://stellar.expert/explorer/testnet/tx/80b505c8f6708f13261ddc7e3106b16392802270c8e53ba7d02422d5a0b85bb5) |
| `deposit` (round 0) | member2 | [0cb6d967...af32521](https://stellar.expert/explorer/testnet/tx/0cb6d967a534b86bfd3bfb9a209d1dbb62c0db9a7bea1d9c409b6832afe32521) |
| `deposit` (round 0) | member3 | [e4f22cea...b4a9a50c70c5b](https://stellar.expert/explorer/testnet/tx/e4f22cea8edf55b03e844be00b13acfeeeafc2d5a0aff7de269b4a9a50c70c5b) |
| `payout` (round 0 → member1) | deployer (permissionless) | [049ad6a3...5a763f35](https://stellar.expert/explorer/testnet/tx/049ad6a306f9f163eada89fe218ed95e47ca291fc6c809bb035e25375a763f35) |

## Verified outcomes

- `create_circle` → `circle_id = 0`; the circle became `Active` once all 3 members called
  `join_circle` (`round_deadline` was set).
- Each of the 3 deposits transferred 10 XLM (`100000000` stroops) to the contract — verified via
  the SAC `transfer` events.
- The `payout` call transferred the full pool (`300000000` stroops = 30 XLM) to
  `payout_order[0]` (member1) — verified via the SAC `transfer` event.
- A `get_circle` call after the payout returned `round_index = 1`, `round_deposit_count = 0`,
  `status = Active` (1 of 3 rounds complete, circle still active) — contract state advanced
  exactly as expected.
- member1's balance after the payout was `100199740975` stroops (~10,019.97 XLM) — consistent
  with the starting balance (~10,000 XLM from Friendbot) + 30 XLM payout − 10 XLM deposit − tx fees.

This run proves that the `create_circle → join_circle → deposit ×N → payout` flow works
correctly on real Stellar testnet, driven via the CLI, and is independently verifiable on
stellar.expert.
