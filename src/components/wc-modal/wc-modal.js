class WcModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['open', 'title'];
  }

  get open() { return this.hasAttribute('open'); }
  set open(val) { val ? this.setAttribute('open', '') : this.removeAttribute('open'); }

  connectedCallback() {
    this.setAttribute('role', 'dialog');
    this.setAttribute('aria-modal', 'true');
    this._escHandler = (e) => { if (e.key === 'Escape' && this.open) this._close(); };
    document.addEventListener('keydown', this._escHandler);
    this.render();
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this._escHandler);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this.render();
  }

  _close() {
    this.open = false;
    
    // Basit ve kolay kullanım: Callback fonksiyonu tetikleme
    if (typeof this.onClose === 'function') {
      this.onClose();
    }
  }

  /**
   * Focus Trap — Modal açıkken Tab tuşu modal içinde döner.
   * WCAG 2.1 - Success Criterion 2.1.2 (No Keyboard Trap) gereksinimi.
   */
  _trapFocus(e) {
    if (e.key !== 'Tab') return;
    const focusable = [...this.shadowRoot.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )];
    // Işık DOM'daki slotted elementleri de ekle
    const slotted = [...this.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )];
    const all = [...focusable, ...slotted].filter(el => !el.disabled);
    if (!all.length) { e.preventDefault(); return; }

    const first = all[0];
    const last  = all[all.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first || this.shadowRoot.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last || this.shadowRoot.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  render() {
    const isOpen = this.hasAttribute('open');
    const title  = this.getAttribute('title') || '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --wc-color-surface:  var(--wc-color-surface,  #13131f);
          --wc-color-border:   var(--wc-color-border,   rgba(255,255,255,.12));
          --wc-color-text:     var(--wc-color-text,     #f1f5f9);
          --wc-color-danger:   var(--wc-color-danger,   #ef4444);
          --wc-color-primary:  var(--wc-color-primary,  #6366f1);
          --wc-radius:         var(--wc-radius,         16px);
          --wc-font:           var(--wc-font,           'Inter', sans-serif);
        }

        .overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,.75);
          backdrop-filter: blur(6px);
          z-index: 1000;
          display: ${isOpen ? 'flex' : 'none'};
          align-items: center; justify-content: center;
          animation: ${isOpen ? 'fadeIn .2s ease' : 'none'};
        }
        .modal {
          background: var(--wc-color-surface);
          border: 1px solid var(--wc-color-border);
          border-radius: calc(var(--wc-radius) + 4px);
          padding: 32px;
          min-width: 320px; max-width: 560px; width: 90%;
          box-shadow: 0 25px 80px rgba(0,0,0,.7);
          animation: ${isOpen ? 'slideUp .3s cubic-bezier(.34,1.56,.64,1)' : 'none'};
          font-family: var(--wc-font);
        }
        .header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 20px;
        }
        .modal-title {
          font-size: 20px; font-weight: 700;
          color: var(--wc-color-text); margin: 0;
        }
        .close-btn {
          background: rgba(255,255,255,.08); border: none;
          color: rgba(255,255,255,.6); width: 34px; height: 34px;
          border-radius: 8px; cursor: pointer; font-size: 16px;
          display: flex; align-items: center; justify-content: center;
          transition: all .2s;
        }
        .close-btn:hover { background: rgba(239,68,68,.2); color: var(--wc-color-danger); }
        .close-btn:focus-visible { outline: 2px solid var(--wc-color-primary); outline-offset: 2px; }
        .body { color: rgba(255,255,255,.7); font-size: 15px; line-height: 1.6; }
        .footer { margin-top: 24px; display: flex; justify-content: flex-end; gap: 10px; }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp {
          from{transform:translateY(30px) scale(.95);opacity:0}
          to{transform:translateY(0) scale(1);opacity:1}
        }
      </style>

      <div class="overlay" id="overlay" part="overlay">
        <div class="modal" part="modal" aria-labelledby="modal-title">
          <div class="header">
            <h2 class="modal-title" id="modal-title">${title}</h2>
            <button class="close-btn" id="close-btn" aria-label="Kapat">✕</button>
          </div>
          <div class="body"><slot></slot></div>
          <div class="footer"><slot name="footer"></slot></div>
        </div>
      </div>`;

    this.style.position    = 'fixed';
    this.style.zIndex      = isOpen ? '1000' : '-1';
    this.style.pointerEvents = isOpen ? 'auto' : 'none';
    this.style.inset       = '0';
    this.style.width       = '0';
    this.style.height      = '0';
    this.style.overflow    = 'hidden';

    // Kapat butonu
    this.shadowRoot.getElementById('close-btn')
      ?.addEventListener('click', () => this._close());

    // Overlay dışına tıklama
    this.shadowRoot.getElementById('overlay')
      ?.addEventListener('click', (e) => {
        if (e.target === this.shadowRoot.getElementById('overlay')) this._close();
      });

    // Focus trap — modal açıksa aktif
    if (this._trapHandler) {
      this.shadowRoot.removeEventListener('keydown', this._trapHandler);
      document.removeEventListener('keydown', this._trapHandler);
    }
    if (isOpen) {
      this._trapHandler = (e) => this._trapFocus(e);
      document.addEventListener('keydown', this._trapHandler);

      // Modal açılınca ilk odaklanılabilir elemana focus ver
      requestAnimationFrame(() => {
        const firstBtn = this.shadowRoot.getElementById('close-btn');
        firstBtn?.focus();
      });
    }
  }
}

customElements.define('wc-modal', WcModal);
export default WcModal;
