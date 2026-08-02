# UI demo + video runbook (Deliverable 3, opsiyonel)

Kontratın ve web app'in doğruluğu zaten kanıtlandı: [Week 2 CLI doğrulaması](week2-e2e-verification.md)
ve [Week 4'ün 5 üyeli/5 round'luk tam döngüsü](week4-demo-tx-log.md) gerçek testnet'te çalıştırıldı,
her işlem stellar.expert'te bağımsız doğrulanabilir. Bu doküman, SOW'un Deliverable 3'ünün istediği
**literal formatı** (web app üzerinden, gerçek bir cüzdanla tıklanarak yapılan 5 round'luk demo +
ekran kaydı) senin kendi Freighter cüzdanınla tamamlaman için bir runbook'tur — bu adım private
key girişi ve cüzdan onayı gerektirdiği için otomatik yapılamıyor.

Tahmini süre: 20-30 dakika (kayıt hariç).

## 1. Hazırlık

- [Freighter](https://freighter.app) tarayıcı eklentisini kur.
- Freighter ayarlarından ağı **Testnet** yap.
- Ekran kaydı için bir araç hazırla (macOS: QuickTime "New Screen Recording", ya da OBS).

## 2. Test cüzdanlarını Freighter'a aktar

Bu proje için oluşturulmuş 5 test hesabının secret key'lerini yerelde şu komutlarla al (repoya
commit edilmedi, sadece senin makinende):

```bash
for m in member1 member2 member3 member4 member5; do
  echo "$m: $(stellar keys secret $m)"
done
```

Freighter'da **"Add another wallet" → "Import secret key"** ile her birini ayrı bir hesap olarak
ekle (5 hesap, tek Freighter kurulumu içinde — sekmeden hesap değiştirebilirsin).

## 3. Yeni bir circle oluştur (canlı demo için taze bir tur)

Canlı app: **https://web-psi-liart-24.vercel.app**

circle_id 0 ve 1 zaten dolu/tamamlanmış durumda — video için taze bir circle_id (muhtemelen `2`)
oluşturacaksın.

1. Freighter'da **member1** hesabına geç, siteye bağlan.
2. Ana sayfada "Yeni halka oluştur" formunu doldur:
   - Üyeler: member1, member2, member3, member4, member5'in G… adresleri (`stellar keys public-key member1` vb.)
   - Token: **XLM (testnet, faucet gerektirmez)** — faucet beklemeden hemen devam edebilmek için
   - Round süresi: kısa tut (örn. 1 saat) — demo sırasında beklemeyeceksin zaten
   - Katkı miktarı: küçük bir değer (örn. 1)
3. "Halkayı oluştur"a bas, Freighter'da imzayı onayla. `/circle/{id}` sayfasına yönlenirsin — bu
   ID'yi not al.

## 4. Katılım (join) — 5 kez

Her üye için:

1. Freighter'da ilgili hesaba geç (member2, member3, member4, member5 sırayla — member1 zaten
   oluştururken örtük katılmadı, o da katılmalı).
2. Dashboard'daki "Davet linkini kopyala"yı kullan ya da doğrudan `/circle/{id}/join` adresine git.
3. "Katıl" butonuna bas, Freighter'da onayla.

Tüm 5 üye katılınca circle otomatik **Aktif** durumuna geçer.

## 5. 5 round boyunca deposit + payout

Her round için (5 kez tekrarla):

1. Sırayla member1 → member5 hesaplarına geçip her birinde dashboard'dan **"Katkı payını yatır"**
   butonuna bas, Freighter'da onayla.
2. Tüm 5 üye yatırınca **"Payout'u tetikle"** butonu görünür — herhangi bir bağlı hesapla
   (genelde son işlemi yapan) tetikleyebilirsin.
3. Dashboard'da "Ödeme geçmişi" bölümünün güncellendiğini, sıradaki round'a geçildiğini göster.

5. round'dan sonra circle **Tamamlandı** durumuna geçer, "Ödeme geçmişi" 5 satır gösterir.

## 6. Video

- 3-4 dakikaya sığdırmak için: circle oluşturma + 1-2 join + 1 tam round (deposit×5 + payout)
  gerçek zamanlı, kalan round'ları hızlandırılmış (time-lapse) gösterebilirsin.
- Türkçe anlatım, sonradan İngilizce altyazı ekle (YouTube otomatik altyazı + düzenleme,
  ya da Descript/CapCut gibi bir araç).
- Videoyu YouTube (unlisted) veya benzer bir yere yükle, linki bu dosyaya ve
  [week4-demo-tx-log.md](week4-demo-tx-log.md)'ye ekle.

## 7. Tx hash'lerini topla

Video çekimi sırasında oluşan işlemlerin hash'lerini toplamanın en kolay yolu: her cüzdanın
stellar.expert hesap sayfasını aç (`https://stellar.expert/explorer/testnet/account/<G-adresi>`)
ve son işlemleri listele; ya da Freighter'ın işlem geçmişinden her onaydan sonraki tx linkine tıkla.
Bu listeyi [week4-demo-tx-log.md](week4-demo-tx-log.md)'ye "UI demo (video)" başlığı altında ekle.
