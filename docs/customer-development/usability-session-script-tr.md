# Halka testnet kullanılabilirlik oturumu

**Hedef:** Üç moderatörlü oturum. Her oturum yaklaşık 30 dakika sürer. Gerçek para veya ana ağ
kullanılmaz. Katılımcı kendi test cüzdanını kontrol eder ve cüzdandaki hiçbir gizli bilgiyi
moderatörle paylaşmaz.

## Oturum öncesi hazırlık

- Katılımcıya testnet kullanıldığını ve test varlıklarının gerçek para değeri olmadığını anlatın.
- Katılımcıdan ayrı bir test cüzdanı kullanmasını isteyin. Ana ağda kullandığı cüzdanın gizli
  anahtarını, kurtarma kelimelerini, QR yedeğini veya ekranını asla istemeyin.
- Cüzdanı, testnet XLM'yi ve test çemberini önceden doğrulayın. Katılımcının halka açık adresi
  ekranda görünürse kaydı paylaşmadan önce bulanıklaştırın.
- Sözleşme ve cüzdan ağı Testnet olmalıdır. Yanlış ağ görünürse durun; cüzdanın ağını katılımcı
  kendi cihazında düzeltsin.
- Ekran kaydı yalnızca ayrı, açık onay verilirse alın. Onay yoksa moderatör notları yeterlidir.
- Üç oturumu kaydedebilmek için her katılımcı için ayrılmış testnet hesabı/çemberi hazırlayın.
  Katılımcının test adresini çember oluşturulmadan önce almanız gerekir; adresi yalnızca testnet
  çemberi kurmak için kullanın ve özet rapora eklemeyin.

## Açılış metni

> Bugün Halka prototipini test ediyoruz; sizi değil. Ekranda bir şey anlaşılmazsa bunu ürün
> açısından öğrenmek istiyoruz. Testnet üzerindeyiz, gerçek para yok. Cüzdanınız sizde kalacak;
> gizli anahtar veya kurtarma kelimeleri istenmeyecek. İstediğiniz anda durabilir, bir adımı
> atlayabilir veya işlem imzalamamayı seçebilirsiniz. Bu oturumda cüzdanınızı kullanarak testnet
> işlemi yapmak ister misiniz? Ayrı olarak, ekran kaydına izin veriyor musunuz?

İşlem katılımı ile kayıt iznini ayrı sorun. Katılımcı işlem yapmak istemezse imza adımına
geçmeyin; gözlem oturumuna devam edebilir. Kayıt iznini reddetmesi oturumu engellemez.

## Senaryolar ve görevler

Görevleri sırayla verin. Önce açık uçlu sorun; katılımcıdan ekranda ne gördüğünü anlatmasını
isteyin. Görev sırasında çözümü açıklamayın.

### 1. Cüzdanı seçip bağlanın (H2)

> Bu test çemberine devam etmek için kendi testnet cüzdanınızı bağlayın. Hangi seçeneği
> seçeceğinizi ve ne olmasını beklediğinizi yüksek sesle anlatın.

Kaydedin: cüzdanı bulma, doğru ağı fark etme, hesap adresini tanıma, başarısız/başarılı deneme,
yardım ihtiyacı ve katılımcının kendi sözleriyle takıldığı yer.

### 2. Çember durumunu yorumlayın (H1/H3)

> Bu ekrana bakarak şu anda çemberde ne olduğunu ve bir sonraki adımın ne olacağını anlatır
> mısınız?

Kaydedin: aktif tur, kaç kişinin katkı yaptığı, katılımcının kendi durumunu ve ödeme sırasını
doğru açıklayıp açıklamadığı. Yönlendirici olmayan bir takip sorusu sorun: “Bunu ekranda nereden
anladınız?”

### 3. Eksik katkı varken ödeme uygunluğunu anlayın (H3)

Test çemberini bazı üyeler henüz katkı yapmamış durumda açın. Katılımcıya şunu sorun:

> Bu durumda ödeme yapılabilir mi? Yapılamıyorsa, sizce neyin tamamlanması gerekiyor? Ekranda
> bunu anlamanıza yardımcı olan ne var?

Katılımcı bir buton bulamazsa, var olmayan bir butona yönlendirmeyin. Bu da bulgudur: mevcut arayüz
eylemi göstermiyor olabilir. Ekrandaki durum metnini, katılımcının açıklamasını ve ek bilgi
aradığı noktaları kaydedin. Ayrı teknik doğrulamada testnet regresyon harness'ının
`payout_before_complete` simülasyon sonucu `RoundNotComplete` olarak kaydedilir; bu hatayı
gerçekleştirmek için kullanıcıya hatalı işlem imzalatmayın.

### 4. İmza öncesi katkı adımını değerlendirin (H2/H3/H4)

Katılımcı isterse testnet katkı akışını başlatabilir. İmza isteminden önce sorun:

> Bu işlem onaylanmadan önce ne olacağını düşünüyorsunuz? Hangi bilgiyi kontrol etmek istersiniz?

İşlem imzalama kararı katılımcınındır. İmzalamak istemezse durun. İmzalarsa, kendi cüzdanında
işlem ayrıntılarını inceleyip kendisi onaylasın. Hiçbir aşamada cüzdanı onun adına kullanmayın.

### 5. Güven sınırını kendi sözleriyle açıklayın (H4)

İşlemden sonra veya imzalamamayı seçerse şu soruyu sorun:

> Bu akışta cüzdan anahtarlarını kimin kontrol ettiğini ve katkının ne zaman hareket ettiğini
> düşünüyorsunuz? Bu sonuca hangi işaretler yol açtı?

Katılımcının cevabından sonra, Halka'nın anahtar saklamadığını ve sözleşme kurallarının fon
hareketini yönettiğini açıklayın. Açıklamadan önce ve sonra ne düşündüğünü ayrı kaydedin.

## Kapanış soruları

- En kafa karıştırıcı veya en güven verici adım hangisiydi? Neden?
- Bu testte hangi noktada yardım istediniz veya durmayı düşündünüz?
- Bir sonraki kullanımda neyi farklı görmeyi beklersiniz?

“Kullanır mıydınız?” sorusunu tek başına başarı ölçütü yapmayın. Gözlenen davranış ve katılımcının
anlattığı gerekçeyi kaydedin.

## Her oturumda ölçülecek gözlemler

| Gözlem | Kaydedilecek veri |
| --- | --- |
| Wallet connection | Seçilen cüzdan, bağlantı sonucu, ağ kontrolü, hata veya yardım |
| Circle comprehension | Aktif tur, katkı sayısı, üyenin durumu ve sıradaki adım açıklaması |
| Incomplete payout | Katılımcının neden ödeme yapılamadığını açıklayıp açıklayamadığı; hangi metne baktığı |
| Preflight comprehension | İmza öncesi işlemi, tutarı ve gerekçeyi açıklama; imzalama veya durma kararı |
| Trust boundary | Anahtarların kimde olduğunu ve fonların hangi kuralla hareket ettiğini açıklama |
| Moderator intervention | Verilen ipucu veya açıklama, hangi görevde ve ne zaman verildi |

Oturum bitince `summary-template.md` kopyasını anonim ID ile doldurun. Ekran videosu mevcut değilse
oluşturulmuş gibi göstermeyin; yalnızca gerçekten alınmış ve onaylanmış kayıtları ekleyin.
