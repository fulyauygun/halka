# Halka — web

Next.js 16 (App Router) + TypeScript + Tailwind v4 web uygulaması. Halka Soroban kontratıyla
(`../contracts/circle`) Freighter cüzdanı üzerinden konuşur.

## Çalıştır

```bash
npm install
npm run dev      # http://localhost:3010
npm run build
```

## Kontrat entegrasyonu

`src/lib/contracts/circle.ts`, deploy edilmiş testnet kontratı için
`stellar contract bindings typescript` ile üretilip buraya taşınmış tip-güvenli bir client'tır
(regenerate edilirse tekrar buraya kopyalanmalı — kendi başına npm paketi olarak tutulmuyor).

- `src/lib/circle-client.ts` — read-only ve cüzdan-imzalı client oluşturucular
- `src/lib/wallet.tsx` — Freighter bağlantı context'i (`useWallet()`)
- `src/lib/use-circle.ts` — SWR tabanlı circle state okuma hook'u
- `src/lib/errors.ts` — kontrat hata kodlarının Türkçe kullanıcı mesajlarına çevirisi

## Sayfalar

- `/` — halka oluşturma formu
- `/circle/[id]` — round-status dashboard (deposit/payout/reclaim aksiyonları)
- `/circle/[id]/join` — davet linkiyle katılım akışı

## Notlar

- Token adresleri (native XLM SAC, testnet USDC SAC) `src/lib/config.ts`'te sabit — ikisi de
  public/testnet bilgisi olduğu için env değişkenine gerek duyulmadı.
- `eslint.config.mjs`, üretilen `src/lib/contracts/**` dosyasını lint kapsamı dışında tutar
  (regenerate edilebilir kod, elle düzeltme yapılmamalı).
