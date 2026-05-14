class WcInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['type', 'value', 'label', 'placeholder', 'disabled', 'error', 'icon'];
  }

  get value() { return this.getAttribute('value') || ''; }
  set value(val) { this.setAttribute('value', val); }

  connectedCallback() {
    this.render();
    this._input = this.shadowRoot.querySelector('input');
    
    this._input.addEventListener('input', (e) => {
      this.setAttribute('value', e.target.value);
      this.dispatchEvent(new CustomEvent('wc-input', { detail: { value: e.target.value }, bubbles: true }));
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this._input) {
      if (name === 'value') this._input.value = newValue;
      else this.render();
    }
  }

  render() {
    const type = this.getAttribute('type') || 'text';
    const label = this.getAttribute('label');
    const placeholder = this.getAttribute('placeholder') || ' ';
    const disabled = this.hasAttribute('disabled');
    const error = this.getAttribute('error');
    const icon = this.getAttribute('icon');
    const val = this.getAttribute('value') || '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          --wc-color-primary: var(--wc-color-primary, #6366f1);
          --wc-color-danger: var(--wc-color-danger, #ef4444);
          --wc-color-text: var(--wc-color-text, #f1f5f9);
          --wc-color-muted: var(--wc-color-muted, #94a3b8);
          --wc-color-surface: var(--wc-color-surface, rgba(255,255,255,0.05));
          --wc-color-border: var(--wc-color-border, rgba(255,255,255,0.1));
          --wc-font: var(--wc-font, 'Inter', sans-serif);
          font-family: var(--wc-font);
        }

        .input-group {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        input {
          width: 100%;
          background: var(--wc-color-surface);
          border: 1px solid ${error ? 'var(--wc-color-danger)' : 'var(--wc-color-border)'};
          color: var(--wc-color-text);
          padding: 14px 16px;
          padding-left: ${icon ? '40px' : '16px'};
          border-radius: 8px;
          font-size: 15px;
          outline: none;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        input:focus {
          border-color: ${error ? 'var(--wc-color-danger)' : 'var(--wc-color-primary)'};
          box-shadow: 0 0 0 3px ${error ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.2)'};
        }

        input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: rgba(255,255,255,0.02);
        }

        .icon {
          position: absolute;
          left: 14px;
          color: var(--wc-color-muted);
          font-size: 18px;
          pointer-events: none;
        }

        label {
          position: absolute;
          left: ${icon ? '40px' : '16px'};
          top: 50%;
          transform: translateY(-50%);
          color: var(--wc-color-muted);
          transition: all 0.2s ease;
          pointer-events: none;
          font-size: 15px;
        }

        /* Floating Label Logic */
        input:focus ~ label,
        input:not(:placeholder-shown) ~ label {
          top: -10px;
          left: 10px;
          font-size: 12px;
          background: #0f172a; /* Fallback background to hide border line */
          padding: 0 6px;
          color: ${error ? 'var(--wc-color-danger)' : 'var(--wc-color-primary)'};
        }

        .error-msg {
          color: var(--wc-color-danger);
          font-size: 13px;
          margin-top: 6px;
          display: ${error ? 'block' : 'none'};
        }
      </style>

      <div class="input-group">
        <div class="input-wrapper">
          ${icon ? `<span class="icon">${icon}</span>` : ''}
          <input 
            type="${type}" 
            placeholder="${label ? ' ' : placeholder}" 
            value="${val}"
            ${disabled ? 'disabled' : ''}
          />
          ${label ? `<label>${label}</label>` : ''}
        </div>
        ${error ? `<div class="error-msg">${error}</div>` : ''}
      </div>
    `;

    // Re-attach input reference after re-render
    this._input = this.shadowRoot.querySelector('input');
  }
}

customElements.define('wc-input', WcInput);
export default WcInput;
