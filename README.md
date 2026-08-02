# Halka — Dijital "Altın Günü"

Türkiye'deki geleneksel altın günü / rotating savings circle modelini Stellar Soroban üzerinde,
custody riski olmadan dijitalleştiren bir dApp. Bir grup, sabit bir katkı miktarını her round'da
öder; havuz, o round tamamlandığında sırası gelen üyeye otomatik olarak ödenir — parayı hiçbir
zaman tek bir kişi veya kurum elinde tutmaz.

30 günlük bir Stellar Instaward kapsamında geliştiriliyor.

## Proje Yapısı

```
.
├── contracts/
│   └── circle/           # Rust/Soroban kontratı: create_circle, join_circle, deposit, payout, reclaim
│       ├── src/lib.rs
│       └── src/test.rs
├── web/                  # Next.js web uygulaması (Freighter cüzdan entegrasyonu) — Week 3
├── docs/                 # Mimari doküman, demo transaction-hash log
├── .github/workflows/    # CI: cargo test + stellar contract build
└── Cargo.toml            # Workspace root
```

## Kontrat geliştirme

```bash
cargo test --workspace        # unit testleri çalıştır (21 test)
stellar contract build        # wasm32v1-none hedefine derle
```

## Testnet

- **Contract ID:** `CBOGI62MN5V3M7QSOKS7E6YWLLAO73LJIS3TMBMEFIADG2LDC37HUI5Q`
- Uçtan uca doğrulama (tx-hash log): [docs/week2-e2e-verification.md](docs/week2-e2e-verification.md)
- Testnet hesapları: [docs/testnet-accounts.md](docs/testnet-accounts.md)

## Durum

- [x] Ortam kurulumu (Rust + wasm32v1-none + Stellar CLI)
- [x] Workspace iskeleti
- [x] Circle/Member veri modeli
- [x] create_circle / join_circle
- [x] deposit / payout / reclaim
- [x] Testnet deploy + CLI uçtan uca doğrulama
- [ ] Web uygulaması (Freighter)
- [ ] Demo + evidence paketi
