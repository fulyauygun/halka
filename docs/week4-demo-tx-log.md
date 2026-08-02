# Week 4 — Full 5-member, 5-round demo cycle (testnet)

A full cycle that satisfies the substance of Deliverable 3: 5 test wallets (`member1`–`member5`),
each depositing its contribution across 5 rounds, with the full pool paid out to the member
whose turn it is each round. All 36 transactions ran on real Stellar testnet and are
independently verifiable on stellar.expert.

**Note — CLI vs. UI:** this run was executed via the Soroban CLI (the same method as the Week 2
end-to-end verification, extended to 5 members and a full 5 rounds). This is the proof that the
contract logic works correctly on the real chain. The version clicked through the web UI with a
real Freighter wallet, plus a screen recording (the literal format Deliverable 3 asks for), still
needs to be completed separately following the steps in
[docs/ui-demo-runbook.md](ui-demo-runbook.md).

- **Contract ID:** `CBOGI62MN5V3M7QSOKS7E6YWLLAO73LJIS3TMBMEFIADG2LDC37HUI5Q`
- **Circle ID:** `1`
- **Token:** native XLM SAC (`CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC`)
- **Contribution:** 5 XLM / member / round · **Round pool:** 25 XLM
- **Members:** `member1`…`member5` (see [docs/testnet-accounts.md](testnet-accounts.md))
- **Result:** `status: Completed`, `round_index: 5` — [get_circle query](https://stellar.expert/explorer/testnet/contract/CBOGI62MN5V3M7QSOKS7E6YWLLAO73LJIS3TMBMEFIADG2LDC37HUI5Q)

## create_circle

| Who | Tx |
| --- | --- |
| deployer (creator) | [9eaf024f…62e3ed4b](https://stellar.expert/explorer/testnet/tx/9eaf024fa0c67798ff729283f2bce06f2248bd1645d49dd0fa0e16e162e3ed4b) |

## join_circle

| Member | Tx |
| --- | --- |
| member1 | [ac2be646…f8467339](https://stellar.expert/explorer/testnet/tx/ac2be646b953346f166e672975492433de908f805db11a58fd9158b1f8467339) |
| member2 | [5687cd77…fba7382a2f](https://stellar.expert/explorer/testnet/tx/5687cd77166a84e35fdceaa081b642a9815108cf4619b80a820f45fba7382a2f) |
| member3 | [7aa9d99c…952e5c1942](https://stellar.expert/explorer/testnet/tx/7aa9d99c1e4da0f4303a4b13eb5b6f9191ea5d02a9fee797eba895952e5c1942) |
| member4 | [7ba61894…387b8773c88](https://stellar.expert/explorer/testnet/tx/7ba61894c1bf2c9912c0e8d906765cde3e94690e67895f182362d387b8773c88) |
| member5 | [429cf481…447f32dd3](https://stellar.expert/explorer/testnet/tx/429cf48148f17f5a9ba04cb88073c768e75ebcf604b96569ebc4456447f32dd3) |

## Round 1 → member1

| Action | Who | Tx |
| --- | --- | --- |
| deposit | member1 | [2ce7e321…8888266a9](https://stellar.expert/explorer/testnet/tx/2ce7e32108e0b33126ffebc93fde9ae95e6d790a2dd46f70a724a1e8888266a9) |
| deposit | member2 | [990e8059…f8ed10feb](https://stellar.expert/explorer/testnet/tx/990e80591796e61bcabbd849989dbce92654e6010efea0b5a1a8b9cf8ed10feb) |
| deposit | member3 | [f0e249ae…adde7a455](https://stellar.expert/explorer/testnet/tx/f0e249ae80692adc5bd83a71ad01f50a70b3e926da733b7ededcaa7adde7a455) |
| deposit | member4 | [55ba7401…5bae3b3d0f](https://stellar.expert/explorer/testnet/tx/55ba7401ef395fa9ea2721ba89c28d9a223c53b4e42c67a6c9265f5bae3b3d0f) |
| deposit | member5 | [e1750814…7ed8eb202](https://stellar.expert/explorer/testnet/tx/e17508a143bf8e3d6b5dbcf3bfea4832426c2ee8d88e3e1886c4b807ed8eb202) |
| **payout → member1** | deployer | [748d05d9…6bc9202](https://stellar.expert/explorer/testnet/tx/748d05d93abdaeb0b8a903ba6feed1a8977516adaa917c160434ebfbd6bc9202) |

## Round 2 → member2

| Action | Who | Tx |
| --- | --- | --- |
| deposit | member1 | [2729667c…0372b505a](https://stellar.expert/explorer/testnet/tx/2729667cc5e72df395d1834efe74c32a64915ec28290420d6ec60070372b505a) |
| deposit | member2 | [55269a27…c0fc08b6d](https://stellar.expert/explorer/testnet/tx/55269a274acb5b6d708aa9bc496781adbab3b3935a7c55d6b2fdb88c0fc08b6d) |
| deposit | member3 | [cea48c36…a887c6e3bf](https://stellar.expert/explorer/testnet/tx/cea48c363c001386dc1185e4c792171a6b2ebd9dea500686b5a25fa887c6e3bf) |
| deposit | member4 | [38ecbdc5…4e0e584c3d97211d](https://stellar.expert/explorer/testnet/tx/38ecbdc599b13def74c2176d1e29bd72ee53edc853dbd2fd4e0e584c3d97211d) |
| deposit | member5 | [3422b096…774e902943ac474d](https://stellar.expert/explorer/testnet/tx/3422b0960ceb580cdacec6d9426209ff67d3706199629b67774e902943ac474d) |
| **payout → member2** | deployer | [c5001fa9…3db3132c967](https://stellar.expert/explorer/testnet/tx/c5001fa9932efa2eaa29b55a745f600d9597ab5b4b7beacfd017517cbcd92af4) |

## Round 3 → member3

| Action | Who | Tx |
| --- | --- | --- |
| deposit | member1 | [b7e40d4a…4c04d540d5ca](https://stellar.expert/explorer/testnet/tx/b7e40d4a91e0a8cf8939e1db4316383bebacd4498269b66158e49c04d540d5ca) |
| deposit | member2 | [93a2328d…8054e7f651231](https://stellar.expert/explorer/testnet/tx/93a2328de6f7e60a8417a08aea65753e2de01146284b7dea43a8054e7f651231) |
| deposit | member3 | [0ae09136…ddbabe4f6059](https://stellar.expert/explorer/testnet/tx/0ae09136e77daf80bff71fcbd7c99da29fbc2cb8da095ce3e237ddbabe4f6059) |
| deposit | member4 | [3bf73db8…5466f169c0d059933](https://stellar.expert/explorer/testnet/tx/3bf73db89e2b98c04fad5f70c60763e47f78f6e7fe7e45b5466f169c0d059933) |
| deposit | member5 | [e9fe13f5…56067e551eb5a04](https://stellar.expert/explorer/testnet/tx/e9fe13f59d60d8b01ae2f4d6ad2406d4e9152c6b6bad15dda56067e551eb5a04) |
| **payout → member3** | deployer | [53b36ba5…4983e43db3132c967](https://stellar.expert/explorer/testnet/tx/53b36ba59c2afcd29c1934a52217703bcdeb6b477640b6a4983e43db3132c967) |

## Round 4 → member4

| Action | Who | Tx |
| --- | --- | --- |
| deposit | member1 | [99232f9e…445a4633cd83041aa](https://stellar.expert/explorer/testnet/tx/99232f9e27982243815793cebd448d23c5dbb5049142003445a4633cd83041aa) |
| deposit | member2 | [7938d81d…c00e33f6987de84ff0](https://stellar.expert/explorer/testnet/tx/7938d81d816fb8d98545840eaba48b2dcd77deb24a408ec00e33f6987de84ff0) |
| deposit | member3 | [96c469d3…45df58f40ecbf33dc](https://stellar.expert/explorer/testnet/tx/96c469d3f14fa2f46565edee760c03929107f46f860543e45df58f40ecbf33dc) |
| deposit | member4 | [0ab7ac90…1ce1c611111b4c1bae](https://stellar.expert/explorer/testnet/tx/0ab7ac90c8257b76457199655be3d134cdb98de55cb0231ce1c611111b4c1bae) |
| deposit | member5 | [550067f6…00804f2da0200dbdef](https://stellar.expert/explorer/testnet/tx/550067f662458f47a135757242edb9ed6f7352a420746d00804f2da0200dbdef) |
| **payout → member4** | deployer | [2e80508e…73ab0d728e7d40b5b](https://stellar.expert/explorer/testnet/tx/2e80508e5da1417204d97e3ef25923df7f5f65fa3f499d473ab0d728e7d40b5b) |

## Round 5 → member5

| Action | Who | Tx |
| --- | --- | --- |
| deposit | member1 | [05c75f9b…4b58d43c85a9a1234](https://stellar.expert/explorer/testnet/tx/05c75f9b6ecf7cae6baa77723e6999e732b3013d95e98ae4b58d43c85a9a1234) |
| deposit | member2 | [23235e2e…a974d2987a08208735](https://stellar.expert/explorer/testnet/tx/23235e2e37b0cf4334d8fca3e38cf8bcaae9e40f30573ba974d2987a08208735) |
| deposit | member3 | [2f914bab…aa48bb117114317db](https://stellar.expert/explorer/testnet/tx/2f914bab877e060a382282971e2bceb45e6f0350c6462a8aa48bb117114317db) |
| deposit | member4 | [d11f1c48…0e51e0e3fa14e46d3](https://stellar.expert/explorer/testnet/tx/d11f1c4805c34b6e573f876e09e3da771fb310a7ca0bd6e0e51e0e3fa14e46d3) |
| deposit | member5 | [35663d4b…d68aae3adb68b68794](https://stellar.expert/explorer/testnet/tx/35663d4b99d85d08061dddcab2036f620c4a6203caeeb3d68aae3adb68b68794) |
| **payout → member5** | deployer | [043f1744…be8009842e48d4c3f06](https://stellar.expert/explorer/testnet/tx/043f1744727d8363a91aba151a4dcdb5e5fd11fe3c001be8009842e48d4c3f06) |

## Verification

Each round's payout was verified via a SAC `transfer` event (contract → the member whose turn
it was, for the full pool amount of 25 XLM). The final `get_circle` call returned
`status: "Completed"`, `round_index: 5`, `round_deposit_count: 0` — the expected final state.
