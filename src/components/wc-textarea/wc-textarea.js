class WcTextarea extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['value', 'label', 'placeholder', 'disabled', 'error', 'maxlength', 'rows'];
  }

  get value() { return this.getAttribute('value') || ''; }
  set value(val) { this.setAttribute('value', val); }

  connectedCallback() {
    this.render();
    this._textarea = this.shadowRoot.querySelector('textarea');
    this._counter = this.shadowRoot.querySelector('.counter');
    
    this._textarea.addEventListener('input', (e) => {
      this.setAttribute('value', e.target.value);
      this._autoResize();
      this._updateCounter();
      this.dispatchEvent(new CustomEvent('wc-input', { detail: { value: e.target.value }, bubbles: true }));
    });

    // Initial resize
    setTimeout(() => this._autoResize(), 0);
  }

  _autoResize() {
    if (!this._textarea) return;
    this._textarea.style.height = 'auto';
    this._textarea.style.height = this._textarea.scrollHeight + 'px';
  }

  _updateCounter() {
    const max = this.getAttribute('maxlength');
    if (max && this._counter) {
      this._counter.textContent = `${this._textarea.value.length} / ${max}`;
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this._textarea) {
      if (name === 'value') {
        this._textarea.value = newValue;
        this._autoResize();
        this._updateCounter();
      } else {
        this.render();
      }
    }
  }

  render() {
    const label = this.getAttribute('label');
    const placeholder = this.getAttribute('placeholder') || ' ';
    const disabled = this.hasAttribute('disabled');
    const error = this.getAttribute('error');
    const maxlength = this.getAttribute('maxlength');
    const rows = this.getAttribute('rows') || '3';
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
        }

        textarea {
          width: 100%;
          background: var(--wc-color-surface);
          border: 1px solid ${error ? 'var(--wc-color-danger)' : 'var(--wc-color-border)'};
          color: var(--wc-color-text);
          padding: 14px 16px;
          border-radius: 8px;
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit;
          resize: none;
          overflow: hidden;
        }

        textarea:focus {
          border-color: ${error ? 'var(--wc-color-danger)' : 'var(--wc-color-primary)'};
          box-shadow: 0 0 0 3px ${error ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.2)'};
        }

        textarea:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: rgba(255,255,255,0.02);
        }

        label {
          position: absolute;
          left: 16px;
          top: 14px;
          color: var(--wc-color-muted);
          transition: all 0.2s ease;
          pointer-events: none;
          font-size: 15px;
        }

        textarea:focus ~ label,
        textarea:not(:placeholder-shown) ~ label {
          top: -10px;
          left: 10px;
          font-size: 12px;
          background: #0f172a;
          padding: 0 6px;
          color: ${error ? 'var(--wc-color-danger)' : 'var(--wc-color-primary)'};
        }

        .footer {
          display: flex;
          justify-content: space-between;
          margin-top: 6px;
          font-size: 13px;
        }

        .error-msg {
          color: var(--wc-color-danger);
          display: ${error ? 'block' : 'none'};
        }

        .counter {
          color: var(--wc-color-muted);
          margin-left: auto;
          display: ${maxlength ? 'block' : 'none'};
        }
      </style>

      <div class="input-group">
        <div class="input-wrapper">
          <textarea 
            rows="${rows}"
            placeholder="${label ? ' ' : placeholder}" 
            ${disabled ? 'disabled' : ''}
            ${maxlength ? `maxlength="${maxlength}"` : ''}
          >${val}</textarea>
          ${label ? `<label>${label}</label>` : ''}
        </div>
        <div class="footer">
          ${error ? `<div class="error-msg">${error}</div>` : '<div></div>'}
          ${maxlength ? `<div class="counter">0 / ${maxlength}</div>` : ''}
        </div>
      </div>
    `;

    this._textarea = this.shadowRoot.querySelector('textarea');
    this._counter = this.shadowRoot.querySelector('.counter');
    this._updateCounter();
  }
}

customElements.define('wc-textarea', WcTextarea);
export default WcTextarea;
