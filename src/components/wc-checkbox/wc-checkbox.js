class WcCheckbox extends HTMLElement {
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
    if (!this.hasAttribute('role')) this.setAttribute('role', 'checkbox');
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
          --wc-color-border: var(--wc-color-border, rgba(255,255,255,0.2));
          --wc-font: var(--wc-font, 'Inter', sans-serif);
        }

        .checkbox-box {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          border: 2px solid ${isChecked ? 'var(--wc-color-primary)' : 'var(--wc-color-border)'};
          background: ${isChecked ? 'var(--wc-color-primary)' : 'transparent'};
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        :host(:focus-visible) .checkbox-box {
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
          border-color: var(--wc-color-primary);
        }

        svg {
          width: 14px;
          height: 14px;
          fill: none;
          stroke: #fff;
          stroke-width: 3;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 16;
          stroke-dashoffset: ${isChecked ? '0' : '16'};
          transition: stroke-dashoffset 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .label {
          margin-left: 10px;
          font-family: var(--wc-font);
          color: rgba(255,255,255,0.9);
          font-size: 15px;
          user-select: none;
        }
      </style>

      <div class="checkbox-box" part="box">
        <svg viewBox="0 0 14 14">
          <polyline points="3 7.5 5.5 10 11 3.5"></polyline>
        </svg>
      </div>
      ${label ? `<div class="label" part="label">${label}</div>` : '<slot class="label"></slot>'}
    `;
  }
}

customElements.define('wc-checkbox', WcCheckbox);
export default WcCheckbox;
