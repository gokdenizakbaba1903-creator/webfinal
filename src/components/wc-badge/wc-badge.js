/**
 * wc-badge — Bildirim sayacı ve etiket bileşeni
 *
 * Kullanım:
 *   <!-- Sayaç modu -->
 *   <wc-badge count="5" theme="danger">
 *     <wc-button>Bildirimler</wc-button>
 *   </wc-badge>
 *
 *   <!-- Etiket modu -->
 *   <wc-badge text="YENİ" theme="success"></wc-badge>
 *
 *   <!-- Pulse animasyonu -->
 *   <wc-badge count="3" theme="danger" pulse></wc-badge>
 *
 * Attribute'lar:
 *   count   — Sayı gösterimi (0'da gizlenir)
 *   text    — Metin etiketi (count'tan önce gelir)
 *   theme   — primary | danger | success | warning
 *   pulse   — Boolean; canlı bildirim animasyonu
 *   max     — Maksimum sayı (varsayılan 99); aşılınca "99+" gösterir
 */
class WcBadge extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['count', 'text', 'theme', 'pulse', 'max'];
  }

  get count()  { return parseInt(this.getAttribute('count') || '0'); }
  set count(v) { this.setAttribute('count', String(v)); }

  get text()   { return this.getAttribute('text') || ''; }
  set text(v)  { this.setAttribute('text', v); }

  get theme()  { return this.getAttribute('theme') || 'danger'; }
  set theme(v) { this.setAttribute('theme', v); }

  get pulse()  { return this.hasAttribute('pulse'); }
  set pulse(v) { v ? this.setAttribute('pulse', '') : this.removeAttribute('pulse'); }

  get max()    { return parseInt(this.getAttribute('max') || '99'); }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this.render();
  }

  connectedCallback() {
    this.render();
  }

  _getLabel() {
    if (this.text) return this.text;
    const c = this.count;
    if (c === 0) return null;
    return c > this.max ? `${this.max}+` : String(c);
  }

  render() {
    const label  = this._getLabel();
    const hidden = label === null;
    const pulse  = this.pulse;
    const theme  = this.theme;

    // Tema renkleri
    const themeColors = {
      primary: { bg: 'var(--wc-color-primary, #6366f1)',  glow: 'rgba(99,102,241,.6)' },
      danger:  { bg: 'var(--wc-color-danger, #ef4444)',   glow: 'rgba(239,68,68,.6)'  },
      success: { bg: 'var(--wc-color-success, #10b981)',  glow: 'rgba(16,185,129,.6)' },
      warning: { bg: 'var(--wc-color-warning, #f59e0b)',  glow: 'rgba(245,158,11,.6)' },
    };
    const c = themeColors[theme] || themeColors.danger;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          position: relative;
          --wc-color-primary: var(--wc-color-primary, #6366f1);
          --wc-color-danger:  var(--wc-color-danger,  #ef4444);
          --wc-color-success: var(--wc-color-success, #10b981);
          --wc-color-warning: var(--wc-color-warning, #f59e0b);
          --wc-font:          var(--wc-font,          'Inter', sans-serif);
        }

        .badge {
          position: absolute;
          top: -6px; right: -6px;
          min-width: 20px; height: 20px;
          padding: 0 5px;
          background: ${c.bg};
          color: #fff;
          font-family: var(--wc-font);
          font-size: 11px;
          font-weight: 700;
          border-radius: 10px;
          display: ${hidden ? 'none' : 'flex'};
          align-items: center;
          justify-content: center;
          line-height: 1;
          border: 2px solid var(--wc-color-surface, #07070f);
          z-index: 1;
          white-space: nowrap;
          box-shadow: 0 2px 8px ${c.glow};
          animation: ${pulse ? 'pulse-ring 1.5s ease-out infinite' : 'none'};
        }

        /* Slot yoksa (text/count badge olarak kullanılıyorsa) */
        :host(:not(:has(slot > *))) .badge {
          position: static;
          top: auto; right: auto;
          display: ${hidden ? 'none' : 'inline-flex'};
        }

        .pulse-ring {
          position: absolute;
          top: -6px; right: -6px;
          width: 24px; height: 24px;
          border-radius: 50%;
          background: ${c.bg};
          opacity: 0;
          display: ${(pulse && !hidden) ? 'block' : 'none'};
          animation: pulse-ring 1.5s ease-out infinite;
          z-index: 0;
          pointer-events: none;
        }

        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: .7; }
          100% { transform: scale(2.2); opacity: 0;  }
        }

        slot { display: inline-block; }
      </style>

      <slot></slot>
      <span class="pulse-ring"></span>
      <span class="badge" part="badge" aria-label="${label ? `${label} bildirim` : ''}">${label ?? ''}</span>`;
  }
}

customElements.define('wc-badge', WcBadge);
export default WcBadge;
