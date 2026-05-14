/*
 * wc-card — HTML <template> API kullanımı
 *
 * Bu bileşen tarayıcının 3 native Web Component API'sini gösterir:
 *   1. Custom Elements API  → customElements.define()
 *   2. Shadow DOM           → attachShadow({ mode: 'open' })
 *   3. HTML Templates       → document.createElement('template') + content.cloneNode()
 *
 * <template> avantajı: HTML ayrıştırılır ama render edilmez,
 * cloneNode(true) ile her bileşen kendi kopyasını alır — performanslı & doğru yol.
 */

// ── Bileşen şablonu — bir kez parse edilir, her instance clone alır ──
const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      /* CSS Custom Properties — dışarıdan override edilebilir */
      --wc-color-primary:  var(--wc-color-primary,  #6366f1);
      --wc-color-surface:  var(--wc-color-surface,  rgba(255,255,255,.04));
      --wc-color-border:   var(--wc-color-border,   rgba(255,255,255,.1));
      --wc-color-text:     var(--wc-color-text,     #f1f5f9);
      --wc-color-muted:    var(--wc-color-muted,    rgba(255,255,255,.55));
      --wc-radius:         var(--wc-radius,         16px);
      --wc-font:           var(--wc-font,           'Inter', sans-serif);
    }

    .card {
      background: var(--wc-color-surface);
      backdrop-filter: blur(12px);
      border: 1px solid var(--wc-color-border);
      border-radius: var(--wc-radius);
      overflow: hidden;
      transition: all .3s ease;
      font-family: var(--wc-font);
    }

    /* hoverable attribute ile aktif olur */
    :host([hoverable]) .card:hover {
      transform: translateY(-6px);
      box-shadow: 0 30px 70px rgba(0,0,0,.5);
      border-color: var(--wc-color-primary);
    }
    :host([hoverable]) .card:hover .img-wrap img {
      transform: scale(1.05);
    }

    .img-wrap {
      width: 100%; aspect-ratio: 16/9; overflow: hidden;
    }
    .img-wrap img {
      width: 100%; height: 100%; object-fit: cover;
      display: block; transition: transform .3s;
    }

    .placeholder {
      width: 100%; aspect-ratio: 16/9;
      background: linear-gradient(135deg,#1e1b4b,#312e81);
      display: flex; align-items: center; justify-content: center;
      font-size: 36px;
    }

    .body { padding: 20px; }

    ::slotted([slot="title"]) {
      display: block; font-size: 18px; font-weight: 700;
      color: var(--wc-color-text); margin: 0 0 8px;
      font-family: var(--wc-font);
    }
    ::slotted([slot="description"]) {
      display: block; font-size: 14px;
      color: var(--wc-color-muted); line-height: 1.6;
      font-family: var(--wc-font);
    }

    .footer { padding: 0 20px 20px; }
    ::slotted([slot="actions"]) { display: flex; gap: 8px; margin-top: 12px; }
  </style>

  <div class="card" part="card">
    <!-- image veya placeholder — JS tarafından doldurulur -->
    <div class="img-area"></div>
    <div class="body">
      <slot name="title"></slot>
      <slot name="description"></slot>
    </div>
    <div class="footer">
      <slot name="actions"></slot>
    </div>
    <slot></slot>
  </div>`;

class WcCard extends HTMLElement {
  constructor() {
    super();
    // <template> içeriğini klonla ve shadow root'a ekle
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['shadow-depth', 'hoverable', 'image'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this._updateCard();
  }

  connectedCallback() {
    this._updateCard();
  }

  _updateCard() {
    const depth    = this.getAttribute('shadow-depth') || 'medium';
    const image    = this.getAttribute('image');
    const card     = this.shadowRoot.querySelector('.card');
    const imgArea  = this.shadowRoot.querySelector('.img-area');

    if (!card) return;

    // Shadow derinliği CSS variables üzerinden kontrol
    const shadows = {
      low:    '0 2px 8px rgba(0,0,0,.25)',
      medium: '0 8px 30px rgba(0,0,0,.4)',
      high:   '0 20px 60px rgba(0,0,0,.6)',
    };
    card.style.boxShadow = shadows[depth] || shadows.medium;

    // Görsel alanı güncelle
    if (image) {
      imgArea.innerHTML = `<div class="img-wrap"><img src="${image}" alt="" part="image"/></div>`;
    } else {
      imgArea.innerHTML = `<slot name="image"><div class="placeholder">🖼️</div></slot>`;
    }
  }
}

customElements.define('wc-card', WcCard);
export default WcCard;
