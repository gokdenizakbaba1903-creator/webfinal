class WcDropdown extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._isOpen = false;
    this._items  = [];
  }

  connectedCallback() {
    this._readItems();
    this.render();
    this._outsideHandler = (e) => { if (!this.contains(e.target)) this._close(); };
    document.addEventListener('click', this._outsideHandler);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this._outsideHandler);
  }

  _readItems() {
    const nodes = [...this.querySelectorAll('[slot="item"]')];
    this._items = nodes.map(el => ({
      html:  el.innerHTML,
      style: el.getAttribute('style') || '',
      id:    el.id || '',
    }));
    nodes.forEach(el => { el.style.display = 'none'; });
  }

  _toggle() {
    this._isOpen = !this._isOpen;
    this._updateMenu();
    this.dispatchEvent(new CustomEvent('wc-toggle', {
      detail: { isOpen: this._isOpen },
      bubbles: true, composed: true,
    }));
  }

  _close() {
    this._isOpen = false;
    this._updateMenu();
  }

  _updateMenu() {
    const menu  = this.shadowRoot.querySelector('.menu');
    const arrow = this.shadowRoot.querySelector('.arrow');
    if (menu) {
      menu.style.opacity       = this._isOpen ? '1' : '0';
      menu.style.pointerEvents = this._isOpen ? 'auto' : 'none';
      menu.style.transform     = this._isOpen ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(.97)';
    }
    if (arrow) arrow.style.transform = this._isOpen ? 'rotate(180deg)' : 'rotate(0)';

    // Erişilebilirlik: aria-expanded güncelle
    const trigger = this.shadowRoot.getElementById('trigger');
    if (trigger) trigger.setAttribute('aria-expanded', String(this._isOpen));
  }

  render() {
    const label    = this.getAttribute('label') || 'Seçin';
    const itemsHTML = this._items.map((item, i) => `
      <div
        class="menu-item"
        data-index="${i}"
        ${item.id ? `id="sd-${item.id}"` : ''}
        role="option"
        tabindex="0"
        style="${item.style}"
      >${item.html}</div>`).join('');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          position: relative;
          font-family: var(--wc-font, 'Inter', sans-serif);
          /* CSS Custom Properties */
          --wc-color-primary:  var(--wc-color-primary,  #6366f1);
          --wc-color-surface:  var(--wc-color-surface,  #13131f);
          --wc-color-border:   var(--wc-color-border,   rgba(255,255,255,.12));
          --wc-color-text:     var(--wc-color-text,     #e2e8f0);
          --wc-radius:         var(--wc-radius,         10px);
          --wc-font:           var(--wc-font,           'Inter', sans-serif);
        }

        .trigger {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 18px;
          background: rgba(255,255,255,.06);
          border: 1px solid var(--wc-color-border);
          border-radius: var(--wc-radius);
          color: var(--wc-color-text);
          font-size: 14px; font-weight: 500;
          cursor: pointer; user-select: none; transition: all .2s;
          font-family: var(--wc-font);
        }
        .trigger:hover { background: rgba(99,102,241,.15); border-color: rgba(99,102,241,.4); }
        .trigger:focus-visible { outline: 2px solid var(--wc-color-primary); outline-offset: 2px; }
        .arrow { font-size: 11px; opacity: .7; transition: transform .2s ease; }

        .menu {
          position: absolute; top: calc(100% + 8px); left: 0;
          min-width: 100%; min-width: max-content;
          background: var(--wc-color-surface);
          border: 1px solid var(--wc-color-border);
          border-radius: 12px; overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,.5);
          z-index: 999;
          opacity: 0; pointer-events: none;
          transform: translateY(-8px) scale(.97);
          transition: opacity .2s ease, transform .2s ease;
        }
        .menu-item {
          display: block; padding: 10px 16px;
          color: var(--wc-color-text); font-size: 14px;
          cursor: pointer; transition: background .15s;
          white-space: nowrap; font-family: var(--wc-font);
        }
        .menu-item:hover { background: rgba(99,102,241,.2); color: #a5b4fc; }
        .menu-item:focus-visible { outline: none; background: rgba(99,102,241,.2); color: #a5b4fc; }
      </style>

      <div
        class="trigger"
        id="trigger"
        tabindex="0"
        role="button"
        aria-haspopup="listbox"
        aria-expanded="false"
      >
        ${label}
        <span class="arrow">▼</span>
      </div>
      <div class="menu" role="listbox" part="menu">
        ${itemsHTML}
      </div>`;

    // Trigger events
    const trigger = this.shadowRoot.getElementById('trigger');
    trigger.addEventListener('click', (e) => { e.stopPropagation(); this._toggle(); });
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this._toggle(); }
      if (e.key === 'Escape') this._close();
      if (e.key === 'ArrowDown' && !this._isOpen) { this._toggle(); }
    });

    // Menü öğesi events
    this.shadowRoot.querySelectorAll('.menu-item').forEach((item, i) => {
      item.addEventListener('click', () => {
        const origId = this._items[i]?.id;
        if (origId) document.getElementById(origId)?.click();
        this.dispatchEvent(new CustomEvent('wc-select', {
          detail: { index: i, text: item.textContent.trim() },
          bubbles: true, composed: true,
        }));
        this._close();
      });
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
        if (e.key === 'Escape') { this._close(); trigger.focus(); }
      });
    });
  }
}

customElements.define('wc-dropdown', WcDropdown);
export default WcDropdown;
