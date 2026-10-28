# Tasarım dili

Gardırop **minimal ve sakin** bir uygulamadır. Arayüz geri çekilir, kıyafetler öne çıkar.

## İlkeler

1. **Renk kıyafetlerden gelir.** Arayüz tek renklidir (siyah, beyaz, griler). Ekrandaki tek renkli öğeler kıyafet fotoğrafları ve renk etiketlerindeki küçük renk daireleridir.
2. **Bol boşluk.** Sıkışık görünen bir ekranda öğe çıkarılır, küçültülmez.
3. **Her ekranda tek ana aksiyon.** Dolu (siyah) buton ekran başına bir tanedir; diğerleri ikincil stildedir.
4. **Süs yok.** Gölge, gradyan, bulanıklık efekti ve dekoratif ikon kullanılmaz. Ayrım için ince çizgi veya hafif ton farkı yeterlidir.
5. **Fotoğraflar kırpılmaz.** Kıyafet görselleri `contain` ile, açık bir zemin üzerinde gösterilir (düz serilmiş "flat-lay" görünümü).

## Renkler

Tüm renkler [src/constants/theme.ts](src/constants/theme.ts) içindeki token'lardan gelir. Bileşenlerde hex kodu yazılmaz (renk etiketlerinin daireleri hariç).

| Token | Açık | Koyu | Kullanım |
| --- | --- | --- | --- |
| `background` | `#FFFFFF` | `#0E0E0E` | Ekran zemini |
| `backgroundElement` | `#F5F5F3` | `#1A1A1A` | Kart, fotoğraf zemini, pasif çip |
| `backgroundSelected` | `#EBEBE8` | `#262626` | Basılı / seçili yüzey |
| `text` | `#111111` | `#F5F5F3` | Ana metin |
| `textSecondary` | `#6B6B6B` | `#9A9A9A` | Yardımcı metin, sayaçlar |
| `border` | `#E4E4E0` | `#2A2A2A` | İnce çizgiler, çip kenarı |
| `accent` | `#111111` | `#F5F5F3` | Ana buton, seçili çip, "+" butonu |
| `onAccent` | `#FFFFFF` | `#111111` | `accent` üzerindeki metin |
| `danger` | `#B3261E` | `#F2B8B5` | Sadece silme gibi geri alınamaz aksiyonlar |

Zeminler saf gri değil, hafif sıcak kırık beyazdır; fotoğraflardaki kumaş tonlarıyla daha iyi uyum sağlar.

## Tipografi

- Sistem fontu (iOS'ta SF Pro). Ek font yüklenmez.
- Ekran başlığı: `subtitle` (32, 600). Bölüm başlığı: `smallBold` (14, 700). Gövde: `default` (16, 500). Yardımcı: `small` (14, 500).
- Büyük harfle yazılmış metin ve ünlem kullanılmaz.

## Şekil ve boşluk

- Boşluk ölçeği: `Spacing` (4, 8, 16, 24, 32, 64). Ekran kenar boşluğu 16.
- Köşe yarıçapı: grid kutuları 8, buton ve büyük görseller 16, çipler tam yuvarlak.
- Kenarlıklar `hairlineWidth` veya 1 px, renk `border`.

## Bileşenler

- **Buton:** `primary` (dolu `accent`), `secondary` (`backgroundElement` zemin), `danger` (zeminsiz, `danger` metin).
- **Çip:** Pasifken `backgroundElement` + `border` kenarlık, seçiliyken `accent` dolgu. Renk seçiminde solunda renk dairesi bulunur.
- **Grid kutusu:** `backgroundElement` zemin, 8 iç boşluk, görsel `contain`.

## Metin dili

- **Samimi, "sen" diye hitap eden** Türkçe: "İlk parçanı ekle", "Bu parça gardırobundan kalıcı olarak silinecek."
- Kısa ve net yazılır. Butonlar fiille başlar ("Kaydet", "Fotoğraf çek").
- Emoji kullanılmaz.
- Hata mesajı ne olduğunu ve kullanıcının ne yapabileceğini söyler: "Kamera izni gerekli. Ayarlar'dan kamera erişimine izin verebilirsin."
