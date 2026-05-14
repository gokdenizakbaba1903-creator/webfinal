# ⚡ My UI Library

Vanilla JavaScript, Shadow DOM ve Custom Elements API kullanılarak geliştirilmiş, framework bağımlılığı olmayan bir Web Components UI kütüphanesi.

![My UI Library Showcase](https://via.placeholder.com/1200x600/07070f/6366f1?text=My+UI+Library+-+Web+Components)

---

## 📁 Proje Yapısı

```
my-ui-library/
├── src/
│   ├── components/
│   │   ├── wc-button/   → wc-button.js
│   │   ├── wc-card/     → wc-card.js
│   │   ├── wc-modal/    → wc-modal.js
│   │   ├── wc-tooltip/  → wc-tooltip.js
│   │   ├── wc-dropdown/ → wc-dropdown.js
│   │   ├── wc-tabs/     → wc-tabs.js
│   │   ├── wc-badge/    → wc-badge.js
│   │   ├── wc-toast/    → wc-toast.js
│   │   ├── wc-input/    → wc-input.js
│   │   ├── wc-textarea/ → wc-textarea.js
│   │   ├── wc-checkbox/ → wc-checkbox.js
│   │   ├── wc-radio/    → wc-radio.js
│   │   ├── wc-switch/   → wc-switch.js
│   │   ├── wc-avatar/   → wc-avatar.js
│   │   ├── wc-spinner/  → wc-spinner.js
│   │   ├── wc-progress/ → wc-progress.js
│   │   ├── wc-accordion/→ wc-accordion.js
│   │   ├── wc-divider/  → wc-divider.js
│   │   ├── wc-alert/    → wc-alert.js
│   │   └── wc-skeleton/ → wc-skeleton.js
│   └── index.js         ← Tüm 20 bileşen buradan export edilir
├── index.html            ← Demo & Showcase sayfası
└── README.md
```

---

## 🚀 Hızlı Başlangıç

```html
<!-- Tüm bileşenleri tek seferde yükle -->
<script type="module" src="./src/index.js"></script>
```

Demo sayfasını açmak için `index.html` dosyasını bir **Live Server** ile açın (VS Code Live Server uzantısı önerilir).

---

## 🎨 Tema Desteği (CSS Custom Properties)

Tüm bileşenler global CSS değişkenleriyle (CSS Custom Properties) çalışacak şekilde tasarlanmıştır. Bu sayede uygulamanızın kök dizininden (`:root`) veya doğrudan element üzerinden tema uygulanabilir.

```css
:root {
  --wc-color-primary: #6366f1;
  --wc-color-surface: #13131f;
  --wc-radius: 12px;
  --wc-font: 'Inter', sans-serif;
}
```

*Not: Demo sayfasındaki `index.html` dosyasında Koyu, Açık ve Mor tema varyasyonlarını deneyebilirsiniz.*

---

## 🧩 Bileşenler

### `<wc-button>`
| Attribute | Değerler                         | Varsayılan  |
|-----------|----------------------------------|-------------|
| `theme`   | `primary`, `danger`, `success`, `ghost` | `primary` |
| `size`    | `sm`, `md`, `lg`                 | `md`        |
| `disabled`| Boolean attribute                | —           |
| `loading` | Boolean attribute                | —           |

### `<wc-card>` (HTML Template API ile geliştirildi)
| Attribute      | Değerler             | Varsayılan |
|----------------|----------------------|------------|
| `shadow-depth` | `low`, `medium`, `high` | `medium` |
| `hoverable`    | Boolean attribute    | —          |
| `image`        | URL string           | —          |

**Slotlar:** `title`, `description`, `image`, `actions`

### `<wc-modal>` (A11y Focus Trap Destekli)
| Attribute | Değerler       | Varsayılan |
|-----------|----------------|------------|
| `open`    | Boolean attr   | —          |
| `title`   | String         | —          |

**Basit Kullanım (Callback):**
```js
document.getElementById('myModal').onClose = () => {
  console.log('Modal kapatıldı!');
};
```

### `<wc-toast>` (Yeni! Kuyruk Yönetimli Bildirim Sistemi)
```js
document.querySelector('wc-toast').show({ 
  message: 'İşlem başarılı!', 
  type: 'success', // success | danger | warning | info
  duration: 3000 
});
```

### `<wc-badge>` (Yeni! Bildirim Sayacı)
| Attribute | Değerler       | Varsayılan |
|-----------|----------------|------------|
| `count`   | Number         | `0`        |
| `text`    | String         | —          |
| `theme`   | `primary`, vb. | `danger`   |
| `pulse`   | Boolean attr   | —          |

### Form Bileşenleri
- `<wc-input>`: İkon, hata durumu ve kayan etiket (floating label) desteği.
- `<wc-textarea>`: Otomatik yükseklik (auto-resize) ve karakter sayacı.
- `<wc-checkbox>`: Özel SVG animasyonlu onay kutusu.
- `<wc-radio>`: Grup içi seçim ve animasyonlu doldurma.
- `<wc-switch>`: Modern açma/kapama tuşu (iOS stili).

### Veri ve Geri Bildirim Bileşenleri
- `<wc-avatar>`: Resim veya baş harf destekli, online/offline durum noktalı kullanıcı avatarı.
- `<wc-spinner>`: Temalandırılabilir bekleme animasyonu.
- `<wc-progress>`: Dinamik yüzde ve parlama efektli yükleme çubuğu.
- `<wc-accordion>`: Akıcı CSS transition ile katlanabilir içerik paneli.
- `<wc-divider>`: Ortasına metin alabilen, yatay/dikey bölücü çizgi.
- `<wc-alert>`: Uyarı ve bilgi mesajları için ikonlu banner kutusu.
- `<wc-skeleton>`: Veri yüklenirken gösterilen parlama efektli yer tutucu.

### Diğer Bileşenler
- `<wc-tooltip>`: `content`, `position` (top, bottom, left, right)
- `<wc-dropdown>`: İç içe slot yapısı, dışarıya tıklandığında kapanma.
- `<wc-tabs>`: Klavye navigasyonu (Ok tuşları, Home, End).

---

## 🛠 Web Components API'leri Kullanımı

Bu projede Web Components'in 3 temel yapı taşı da eksiksiz kullanılmıştır:

1. **Custom Elements API:** `customElements.define('wc-*', WcClass)` kullanılarak yeni HTML etiketleri tarayıcıya öğretildi.
2. **Shadow DOM:** `attachShadow({ mode: 'open' })` ile CSS kapsüllemesi (encapsulation) sağlandı. Bileşen stilleri dışarıya sızmaz, dışarıdaki stiller bileşeni bozmaz.
3. **HTML Templates (`<template>`):** Özellikle `wc-card` bileşeninde `document.createElement('template')` kullanılmıştır. Bu yapı sayesinde bileşenlerin iç yapısı (DOM) sayfa yüklendiğinde bir kez parse edilir ve her `<wc-card>` kullanımında `.cloneNode(true)` ile yüksek performanslı bir şekilde kopyalanır.

---

## ♿ Erişilebilirlik (A11y)

Erişilebilirlik (A11y) bu kütüphanenin odak noktalarından biridir:

- **Focus Trap (Klavye Tuzağı Engelleme):** `<wc-modal>` açıldığında, klavye ile gezinme (Tab) sadece modal içerisinde kalır. Arka plandaki elementlere odaklanılamaz. (WCAG 2.1.2)
- **Klavye Navigasyonu:** `<wc-tabs>` bileşeninde yön tuşları, Home ve End tuşlarıyla sekme değiştirilebilir. `<wc-dropdown>` Enter, Boşluk ve Yön tuşlarıyla kontrol edilebilir.
- **ARIA Etiketleri:** `role="dialog"`, `aria-modal`, `aria-selected`, `aria-expanded` gibi etiketler state değişimlerinde dinamik olarak güncellenir.

---

## 🧠 Zorluklar ve Çözümler

- **Zorluk:** Shadow DOM içindeki elementlerin dışarıdan tamamen izole olması sebebiyle tema (renk/font) yönetiminin zorlaşması.
  - **Çözüm:** CSS Custom Properties (`--wc-*`) kullanıldı. Shadow DOM bu değişkenlerin dışarıdan içeriye sızmasına izin verir, böylece izolasyon bozulmadan tema desteği sağlandı.
- **Zorluk:** Dropdown ve Modal gibi "dışarıya tıklanınca kapanma" davranışı gerektiren bileşenlerde event target'ın Shadow Root sebebiyle her zaman host element olarak görünmesi.
  - **Çözüm:** Event listener'lar document seviyesine bağlandı ve `.contains(e.target)` metodu ile tıklamanın host elementin içinde mi dışında mı olduğu kontrol edildi.
- **Zorluk:** Modal açıkken arkadaki içeriğin Tab tuşuyla seçilebilmesi (A11y sorunu).
  - **Çözüm:** Custom bir `_trapFocus` metodu yazıldı. Shift+Tab ve Tab durumları kontrol edilerek odak döngüsü oluşturuldu.

---

## 📚 Kaynaklar

- [MDN Web Docs - Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
- [MDN - Using templates and slots](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots)
- [Web.dev - Custom Elements v1: Reusable Web Components](https://web.dev/custom-elements-v1/)
- [W3C - WAI-ARIA Authoring Practices (Focus Trap & Keyboard Nav)](https://www.w3.org/WAI/ARIA/apg/)

---

*My UI Library — Vanilla JS · ES6+ · Web Standards*
