# Evidence paketi (SOW §6.1)

Instaward SOW'un "Planned Evidence to Be Submitted" tablosuna birebir karşılık gelir.

## Deliverable 1 — Soroban kontratı

| Kalem | Değer |
| --- | --- |
| Repo | https://github.com/fulyauygun/halka |
| Kontrat kaynağı | [contracts/circle/src](../contracts/circle/src) |
| Testnet contract ID | `CBOGI62MN5V3M7QSOKS7E6YWLLAO73LJIS3TMBMEFIADG2LDC37HUI5Q` |
| Explorer | https://stellar.expert/explorer/testnet/contract/CBOGI62MN5V3M7QSOKS7E6YWLLAO73LJIS3TMBMEFIADG2LDC37HUI5Q |
| Unit testler | 21 test, `cargo test --workspace` — CI'da her push'ta çalışır |
| Uçtan uca doğrulama | [docs/week2-e2e-verification.md](week2-e2e-verification.md), [docs/week4-demo-tx-log.md](week4-demo-tx-log.md) |

## Deliverable 2 — Web uygulaması

| Kalem | Değer |
| --- | --- |
| Canlı URL | https://web-psi-liart-24.vercel.app |
| Kaynak | [web/src](../web/src) |
| Akışlar | Halka oluşturma (`/`), davetle katılım (`/circle/[id]/join`), round-status dashboard + deposit/payout/reclaim (`/circle/[id]`) |
| Gerçek kontrata bağlı kanıt | circle #0 ve #1'in dashboard'da canlı, doğru state ile göründüğü — bkz. yukarıdaki tx-hash log'larındaki sonuçlarla birebir eşleşme |

## Deliverable 3 — Demo (opsiyonel)

| Kalem | Değer |
| --- | --- |
| 5 üyeli / 5 round'luk tam döngü (CLI, gerçek testnet) | [docs/week4-demo-tx-log.md](week4-demo-tx-log.md) — 36 işlem, tamamı stellar.expert'te doğrulanabilir |
| UI + video (gerçek Freighter cüzdanıyla) | Kullanıcı tarafından tamamlanacak — bkz. [docs/ui-demo-runbook.md](ui-demo-runbook.md) |
| README / mimari doküman | [docs/architecture.md](architecture.md) |

## Genel

| Kalem | Değer |
| --- | --- |
| Ana README | [README.md](../README.md) |
| CI durumu | [GitHub Actions](https://github.com/fulyauygun/halka/actions) — contracts + web job'ları her push'ta |
| Testnet hesapları | [docs/testnet-accounts.md](testnet-accounts.md) |
