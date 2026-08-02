# Mimari ve kurulum

## Kurulum (yerel geliştirme)

### Kontrat

```bash
# Rust + Soroban hedefi
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
rustup target add wasm32v1-none

# Stellar CLI (macOS/Homebrew)
brew install stellar-cli

# Test ve derleme
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

Kontrat değişirse TypeScript binding'leri yeniden üretilmeli:

```bash
stellar contract bindings typescript \
  --contract-id <CONTRACT_ID> --network testnet \
  --output-dir web/src/contracts/circle --overwrite
cp web/src/contracts/circle/src/index.ts web/src/lib/contracts/circle.ts
rm -rf web/src/contracts
```

## Veri modeli

```
Circle
├── creator: Address
├── token: Address                 (pooled SAC — native XLM veya USDC)
├── members: Vec<Address>          (sabit, invite-only)
├── payout_order: Vec<Address>     (members'ın bir permütasyonu)
├── contribution_amount: i128
├── round_index: u32               (payout_order içindeki mevcut round)
├── round_deposit_count: u32
├── round_deadline: u64            (Active olduktan sonra anlamlı)
├── round_timeout_secs: u64
└── status: Forming | Active | Completed

Storage (per circle_id):
├── Joined(circle_id, member) -> bool
└── Deposited(circle_id, round_index, member) -> bool
```

**Yaşam döngüsü:** `create_circle` → (her üye `join_circle` çağırır) → tüm üyeler katılınca
`Forming → Active`, ilk round'un `round_deadline`'ı set edilir → her round: N deposit + 1 payout
→ `round_index` ilerler, yeni deadline → son round'dan sonra `Active → Completed`.

## Kontrat fonksiyon referansı

| Fonksiyon | Auth | Açıklama |
| --- | --- | --- |
| `create_circle(creator, token, members, payout_order, contribution_amount, round_timeout_secs) -> u64` | `creator` | Yeni circle oluşturur, `circle_id` döner. `members.len() >= 2`, `payout_order` `members`'ın permütasyonu olmalı. |
| `join_circle(circle_id, member)` | `member` | Davetli üyenin katılımını onaylar. Tüm üyeler katılınca circle `Active` olur. |
| `deposit(circle_id, member)` | `member` (+ token transfer auth) | Sabit katkıyı `member`'dan kontrata çeker. Round başına bir kez. |
| `payout(circle_id)` | — (permissionless) | Round tamamlandığında (`round_deposit_count == members.len()`) tüm havuzu sıradaki üyeye öder. |
| `reclaim(circle_id, member)` | `member` | Round timeout'u geçtiyse, `member` kendi katkısını geri çeker. |
| `get_circle(circle_id) -> Circle` | — | Read-only. |
| `has_joined(circle_id, member) -> bool` | — | Read-only. |
| `has_deposited_current_round(circle_id, member) -> bool` | — | Read-only. |

## Tasarım kararları ve gerekçeleri

- **`payout` permissionless:** Kontrat kendi state'ine göre invariant'ı zaten uyguluyor (tam
  deposit olmadan ödeme yapmaz), bu yüzden çağrıyı belirli bir kişiye kısıtlamak tek bir
  başarısızlık noktası (single point of failure) eklemekten başka bir şey yapmaz.
- **`reclaim` timeout sonrası bireysel:** Round tıkanırsa (bir üye katkı yapmazsa), diğer üyelerin
  parası sonsuza kadar kilitlenmez — her biri kendi payını bağımsız olarak geri çekebilir.
- **Sabit `payout_order`:** V1 kapsamı bilinçli olarak dar tutuldu; rastgele/adil sıralama
  (drand tabanlı) V2 planı (bkz. proje SOW'u, "Out-of-Scope").
- **Native XLM ile CLI demoları:** Testnet USDC SAC'ı doğrulanmış ve kullanıma hazır
  (`CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA`), ama Circle'ın faucet'i
  (faucet.circle.com) tarayıcı üzerinden manuel bir adım gerektirdiği için CLI-driven
  doğrulama koşuları native XLM ile yapıldı — kontratın `token` parametresi jenerik olduğu
  için üretim kullanımında USDC'ye geçiş sadece bir adres değişikliği.

## Bilinen kısıtlar

- Rastgele/adil payout sırası çekilişi yok (V1: sabit sıra, oluşturan belirler).
- Gecikme/default cezası mekanizması yok (yalnızca timeout sonrası reclaim).
- Pool bakiyesine yield kazandırma yok (V2 roadmap: Blend entegrasyonu).
- Fiat on/off ramp, mobil uygulama, passkey onboarding kapsam dışı.
- Güvenlik denetimi (audit) yapılmadı — testnet/hackathon kapsamlı bir prototip.
