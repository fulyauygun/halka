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
cargo test --workspace        # unit testleri çalıştır
stellar contract build        # wasm32v1-none hedefine derle
```

## Durum

- [x] Ortam kurulumu (Rust + wasm32v1-none + Stellar CLI)
- [x] Workspace iskeleti
- [ ] Circle/Member veri modeli
- [ ] create_circle / join_circle
- [ ] deposit / payout / reclaim
- [ ] Testnet deploy
- [ ] Web uygulaması (Freighter)
- [ ] Demo + evidence paketi
