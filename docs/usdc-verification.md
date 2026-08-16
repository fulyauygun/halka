# USDC end-to-end verification (testnet)

The Week 2 and Week 4 runs ([week2-e2e-verification.md](week2-e2e-verification.md),
[week4-demo-tx-log.md](week4-demo-tx-log.md)) both used native XLM's Stellar Asset Contract as
the pooled token, since getting testnet USDC from [faucet.circle.com](https://faucet.circle.com)
requires a manual browser step. This run closes that gap: it uses the **same deployed contract**
with the **real testnet Circle USDC SAC** as `token`, funded via the
[Sozu faucet](https://github.com/sozu-cash/faucet) (automated Circle USDC claim + trustline
setup), proving the contract's `token` parameter works end-to-end with the asset the SOW
specifies.

- **Contract ID:** `CBOGI62MN5V3M7QSOKS7E6YWLLAO73LJIS3TMBMEFIADG2LDC37HUI5Q`
- **Circle ID:** `3`
- **Token:** testnet Circle USDC SAC (`CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA`, issuer `GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5`)
- **Contribution:** 5 USDC / member / round · **Round pool:** 15 USDC
- **Members:** 3 freshly generated testnet wallets, each claimed 100 USDC via the Sozu faucet
  (see tx hashes below for the claim transactions)
- **Result:** `status: "Completed"`, `round_index: 3`, `round_deposit_count: 0` — verified via a
  `get_circle` read after the run

## Member wallets (public keys only)

| Alias | Public Key |
| --- | --- |
| usdc-m1 (creator) | `GB5KSLRQCHQCSSC672CEMKQP4C3ES53ZRYCCNWSAZN254APK5WX4XTRK` |
| usdc-m2 | `GCYDBKNWVQP7RBZZYFBJO7F4GDSXDV7DB2OHZDSREYPJGNA5KPO7MIIV` |
| usdc-m3 | `GA33SFC7UITYEPCI4BLSOETKOI3GETXP76V4M3GXPHJSN6PSOPNNFJY4` |

## create_circle

| Who | Tx |
| --- | --- |
| usdc-m1 (creator) | [994d744b…f04a](https://stellar.expert/explorer/testnet/tx/994d744ba8746d2a0f9a378faf57c1a2d09f14faddbf42e03b2d0b210aabf04a) |

## join_circle

| Member | Tx |
| --- | --- |
| usdc-m1 | [e6e162ce…d2bd1](https://stellar.expert/explorer/testnet/tx/e6e162ce8c796afc419b0b11ee4b249fd5490ecda69db3ec5b7b9529b67d2bd1) |
| usdc-m2 | [a47f7d2f…d1efa2](https://stellar.expert/explorer/testnet/tx/a47f7d2fc1825ce52b9eb30ddf1cffb7ff2356ebc58bf9420fe99d529fd1efa2) |
| usdc-m3 | [abd3f03c…dd47ab](https://stellar.expert/explorer/testnet/tx/abd3f03ce4e7c3aea4aa9c17c40e759c95bb52f666ced464ae23fb3bb5dd47ab) |

## Round 1 → usdc-m1

| Action | Who | Tx |
| --- | --- | --- |
| deposit (5 USDC) | usdc-m1 | [d1785bdd…8c741](https://stellar.expert/explorer/testnet/tx/d1785bddafbf6b6037aca39574c9875cfb4fc10a99e66963b25c2b86a078c741) |
| deposit (5 USDC) | usdc-m2 | [34d2b048…6d536](https://stellar.expert/explorer/testnet/tx/34d2b048829f92828eb0f0533fc1073df2802cbb3c09cfc1e0b7d1d2ccf6d536) |
| deposit (5 USDC) | usdc-m3 | [26c57d11…b010f](https://stellar.expert/explorer/testnet/tx/26c57d11cda5770e93effb847252255dda6a131a00f3c77d43a4dda65b1b010f) |
| **payout → usdc-m1 (15 USDC)** | usdc-m1 | [bcaa80ee…d735e96](https://stellar.expert/explorer/testnet/tx/bcaa80ee3f80d7bf0659bbf73cfe0b8ef37b43da7506a62b6ef788101d735e96) |

## Round 2 → usdc-m2

| Action | Who | Tx |
| --- | --- | --- |
| deposit (5 USDC) | usdc-m1 | [7dae1260…4e57](https://stellar.expert/explorer/testnet/tx/7dae12603f9b8fa9e550a653b4ce8843c057bb58ef3e13c30cc614605e404e57) |
| deposit (5 USDC) | usdc-m2 | [a1da3551…62171f](https://stellar.expert/explorer/testnet/tx/a1da3551145085b3656eebe77f9b31e1879742ca04ff43d2be5f4263a862171f) |
| deposit (5 USDC) | usdc-m3 | [d18e58c6…89368](https://stellar.expert/explorer/testnet/tx/d18e58c62941da4bc25e7362ba3f185d3db4008cabb16a553f1d602e26589368) |
| **payout → usdc-m2 (15 USDC)** | usdc-m1 | [a126fe58…946529](https://stellar.expert/explorer/testnet/tx/a126fe58e5168d2ca948709d3d9eb1eb4dbc9e893269a075e10c367386946529) |

## Round 3 → usdc-m3

| Action | Who | Tx |
| --- | --- | --- |
| deposit (5 USDC) | usdc-m1 | [f3b3a053…a61831](https://stellar.expert/explorer/testnet/tx/f3b3a053aa879e0b08bdc53f24a845cc3fd404ad47f656c951ee7158e9a61831) |
| deposit (5 USDC) | usdc-m2 | [7c38ef24…a171](https://stellar.expert/explorer/testnet/tx/7c38ef24196c0a99d341ac149b524619c99a7e844646474b3e68dbf4d315a171) |
| deposit (5 USDC) | usdc-m3 | [b665d75a…81fa7](https://stellar.expert/explorer/testnet/tx/b665d75a5bba91abe787d7a8a38973cfd2e9659831e630a3e0ca945b7a581fa7) |
| **payout → usdc-m3 (15 USDC)** | usdc-m1 | [9caee096…92c2cb1](https://stellar.expert/explorer/testnet/tx/9caee096ca394277fe38a631072ca5b4f5559843f60a17d001e63793192c2cb1) |

## Verification

Each deposit and payout emitted a SAC `transfer` event denominated in `USDC:GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5`
(visible directly in the CLI output above). The final `get_circle` call returned
`status: "Completed"`, `round_index: 3`, `round_deposit_count: 0`, `token:
"CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA"` — confirming the full lifecycle
(create → join × 3 → deposit × 3 rounds → payout × 3) works correctly with real testnet USDC.

## Still open

This run used the CLI (local keys), same as Week 2/4 — it proves the contract logic works with
USDC, not the web UI. The literal Deliverable 3 (UI click-through with Freighter + video) still
needs a human at the keyboard — see [ui-demo-runbook.md](ui-demo-runbook.md). That runbook can
now optionally use this USDC SAC as the "Token" choice instead of testnet XLM, if a fully
USDC-denominated video is preferred over the faster XLM path it currently recommends.
