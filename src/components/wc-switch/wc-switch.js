class WcSwitch extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['checked', 'disabled', 'label'];
  }

  get checked() { return this.hasAttribute('checked'); }
  set checked(val) { val ? this.setAttribute('checked', '') : this.removeAttribute('checked'); }

  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(val) { val ? this.setAttribute('disabled', '') : this.removeAttribute('disabled'); }

  connectedCallback() {
    if (!this.hasAttribute('role')) this.setAttribute('role', 'switch');
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0');
    
    this.render();

    this.addEventListener('click', this._toggle);
    this.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this._toggle();
      }
    });
  }

  _toggle() {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.setAttribute('aria-checked', String(this.checked));
    this.dispatchEvent(new CustomEvent('change', { detail: { checked: this.checked }, bubbles: true }));
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
          --wc-color-surface: var(--wc-color-surface, rgba(255,255,255,0.1));
          --wc-font: var(--wc-font, 'Inter', sans-serif);
        }

        .switch-track {
          width: 44px;
          height: 24px;
          border-radius: 12px;
          background: ${isChecked ? 'var(--wc-color-primary)' : 'var(--wc-color-surface)'};
          position: relative;
          transition: background 0.3s ease;
        }

        :host(:focus-visible) .switch-track {
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
        }

        .switch-thumb {
          position: absolute;
          top: 2px;
          left: ${isChecked ? '22px' : '2px'};
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #fff;
          transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .label {
          margin-left: 12px;
          font-family: var(--wc-font);
          color: rgba(255,255,255,0.9);
          font-size: 15px;
          user-select: none;
        }
      </style>

      <div class="switch-track" part="track">
        <div class="switch-thumb" part="thumb"></div>
      </div>
      ${label ? `<div class="label" part="label">${label}</div>` : '<slot class="label"></slot>'}
    `;
  }
}

customElements.define('wc-switch', WcSwitch);
export default WcSwitch;
