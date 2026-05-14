class WcRadio extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['checked', 'disabled', 'name', 'value', 'label'];
  }

  get checked() { return this.hasAttribute('checked'); }
  set checked(val) { val ? this.setAttribute('checked', '') : this.removeAttribute('checked'); }

  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(val) { val ? this.setAttribute('disabled', '') : this.removeAttribute('disabled'); }

  get value() { return this.getAttribute('value'); }
  get name() { return this.getAttribute('name'); }

  connectedCallback() {
    if (!this.hasAttribute('role')) this.setAttribute('role', 'radio');
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0');
    
    this.render();

    this.addEventListener('click', this._select);
    this.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this._select();
      }
    });
  }

  _select() {
    if (this.disabled || this.checked) return;
    
    // Uncheck other radios with the same name in the same scope
    if (this.name) {
      const root = this.getRootNode();
      const peers = root.querySelectorAll(`wc-radio[name="${this.name}"]`);
      peers.forEach(peer => {
        if (peer !== this) peer.checked = false;
      });
    }

    this.checked = true;
    this.setAttribute('aria-checked', 'true');
    this.dispatchEvent(new CustomEvent('change', { detail: { value: this.value }, bubbles: true }));
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === 'checked') this.setAttribute('aria-checked', String(this.checked));
      this.render();
    }
  }

  render() {
    const isChecked = this.hasAttribute('checked');
    const isDisabled = this.hasAttribute('disabled');
    const label = this.getAttribute('label') || '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-flex;
          align-items: center;
          cursor: ${isDisabled ? 'not-allowed' : 'pointer'};
          opacity: ${isDisabled ? '0.5' : '1'};
          outline: none;
          --wc-color-primary: var(--wc-color-primary, #6366f1);
          --wc-color-border: var(--wc-color-border, rgba(255,255,255,0.2));
          --wc-font: var(--wc-font, 'Inter', sans-serif);
        }

        .radio-box {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid ${isChecked ? 'var(--wc-color-primary)' : 'var(--wc-color-border)'};
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          position: relative;
        }

        :host(:focus-visible) .radio-box {
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
          border-color: var(--wc-color-primary);
        }

        .radio-inner {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--wc-color-primary);
          transform: scale(${isChecked ? '1' : '0'});
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .label {
          margin-left: 10px;
          font-family: var(--wc-font);
          color: rgba(255,255,255,0.9);
          font-size: 15px;
          user-select: none;
        }
      </style>

      <div class="radio-box" part="box">
        <div class="radio-inner"></div>
      </div>
      ${label ? `<div class="label" part="label">${label}</div>` : '<slot class="label"></slot>'}
    `;
  }
}

customElements.define('wc-radio', WcRadio);
export default WcRadio;
