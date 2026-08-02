# Week 2 — Testnet uçtan uca doğrulama

## Deploy

- **Contract ID:** `CBOGI62MN5V3M7QSOKS7E6YWLLAO73LJIS3TMBMEFIADG2LDC37HUI5Q`
- **Wasm hash:** `0825ab30038a798e426c05c7ba158c353f829799440750dab20d2f97f2b5b685`
- Upload tx: [c1b74c58...fc3df6b](https://stellar.expert/explorer/testnet/tx/c1b74c58c1d9d15a3d8e382cd42f8d38c82d12f0c7df55f8b692d0808fc3df6b)
- Create-instance tx: [7cc03d1c...9777d1](https://stellar.expert/explorer/testnet/tx/7cc03d1c742b4a149c264ebaa97b5fc5b625763640c04d8c1aa384e3589777d1)

## Kullanılan token

Bu doğrulama koşusu **native XLM'in Stellar Asset Contract'ını** (`CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC`)
pooled token olarak kullandı — `deployer`/`member1-5` zaten Friendbot'tan XLM ile fonlı olduğu
için ek trustline/mint kurulumu gerekmedi. Kontratın `token` parametresi tamamen jenerik
(herhangi bir SAC adresini kabul eder), bu yüzden bu koşu payout/deposit mantığının gerçek
zincir üzerinde doğru çalıştığını birebir kanıtlıyor.

Resmi Circle testnet USDC SAC adresi de doğrulanmış durumda ve gelecekteki koşularda (Week 3/4)
doğrudan kullanılabilir:
- USDC issuer: `GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5`
- USDC SAC: `CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA` (canlı, `symbol()` çağrısıyla doğrulandı)
- Testnet USDC almak için: [faucet.circle.com](https://faucet.circle.com) (Stellar seçip test adresini gir) — manuel/tarayıcı adımı gerektiriyor.

## Senaryo: circle_id 0, 3 üye, 3 round, contribution = 10 XLM/round

| Adım | Kim | Tx |
| --- | --- | --- |
| `create_circle` | deployer (creator) | [02678e19...4f95d43](https://stellar.expert/explorer/testnet/tx/02678e19ab93dd35bfb6627aeb87e73fa52f12f259adf2ba576e6bb264f95d43) |
| `join_circle` | member1 | [328c7e82...96641](https://stellar.expert/explorer/testnet/tx/328c7e82d05d0d0922bf0345289c5548b4b6b1cebd04b7b16d738d6315496641) |
| `join_circle` | member2 | [3b5b39ab...8f3e47](https://stellar.expert/explorer/testnet/tx/3b5b39abf80cae4ea32d868489104303f42804939f6c115d3a3c4f5a808f3e47) |
| `join_circle` | member3 | [d1679046...b9172ff](https://stellar.expert/explorer/testnet/tx/d1679046b27b7621015649e4547d0975e2a3c46746a2a65fec8582274b9172ff) |
| `deposit` (round 0) | member1 | [80b505c8...a0b85bb5](https://stellar.expert/explorer/testnet/tx/80b505c8f6708f13261ddc7e3106b16392802270c8e53ba7d02422d5a0b85bb5) |
| `deposit` (round 0) | member2 | [0cb6d967...af32521](https://stellar.expert/explorer/testnet/tx/0cb6d967a534b86bfd3bfb9a209d1dbb62c0db9a7bea1d9c409b6832afe32521) |
| `deposit` (round 0) | member3 | [e4f22cea...b4a9a50c70c5b](https://stellar.expert/explorer/testnet/tx/e4f22cea8edf55b03e844be00b13acfeeeafc2d5a0aff7de269b4a9a50c70c5b) |
| `payout` (round 0 → member1) | deployer (permissionless) | [049ad6a3...5a763f35](https://stellar.expert/explorer/testnet/tx/049ad6a306f9f163eada89fe218ed95e47ca291fc6c809bb035e25375a763f35) |

## Doğrulanan sonuçlar

- `create_circle` → `circle_id = 0`, tüm 3 üye `join_circle`'dan sonra circle `Active`'e geçti
  (`round_deadline` set edildi).
- 3 deposit'in her biri kontrata 10 XLM (`100000000` stroop) transfer etti — SAC `transfer`
  event'leriyle doğrulandı.
- `payout` çağrısı, tam pool'u (`300000000` stroop = 30 XLM) `payout_order[0]` (member1) adresine
  transfer etti — SAC `transfer` event'iyle doğrulandı.
- Payout sonrası `get_circle` çağrısı: `round_index = 1`, `round_deposit_count = 0`,
  `status = Active` (3 round'un 1'i tamamlandığı için circle hâlâ aktif) — kontrat state'i
  beklendiği gibi ilerledi.
- member1 bakiyesi payout sonrası `100199740975` stroop (~10.019,97 XLM) — başlangıç
  (~10.000 XLM, Friendbot) + 30 XLM payout − 10 XLM deposit − işlem ücretleri ile tutarlı.

Bu koşu, `create_circle → join_circle → deposit ×N → payout` akışının gerçek Stellar testnet'inde,
CLI üzerinden, bağımsız olarak stellar.expert'te doğrulanabilir şekilde çalıştığını kanıtlıyor.
