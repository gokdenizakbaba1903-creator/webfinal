class WcButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['theme', 'disabled', 'size', 'loading'];
  }

  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(val) { val ? this.setAttribute('disabled', '') : this.removeAttribute('disabled'); }

  get theme() { return this.getAttribute('theme') || 'primary'; }
  set theme(val) { this.setAttribute('theme', val); }

  get size() { return this.getAttribute('size') || 'md'; }
  set size(val) { this.setAttribute('size', val); }

  connectedCallback() {
    this.setAttribute('role', 'button');
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0');
    this.render();
    this._handleKeydown = (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !this.disabled) {
        e.preventDefault();
        this.click();
      }
    };
    this.addEventListener('keydown', this._handleKeydown);
    this.addEventListener('mousedown', this._createRipple);
  }

  disconnectedCallback() {
    this.removeEventListener('keydown', this._handleKeydown);
    this.removeEventListener('mousedown', this._createRipple);
  }

  _createRipple(e) {
    if (this.disabled || this.hasAttribute('loading')) return;
    
    const button = this.shadowRoot.querySelector('button');
    if (!button) return;

    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    const rect = button.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');

    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) existingRipple.remove();

    button.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this.render();
  }

  render() {
    const theme   = this.getAttribute('theme') || 'primary';
    const size    = this.getAttribute('size') || 'md';
    const disabled = this.hasAttribute('disabled');
    const loading  = this.hasAttribute('loading');

    const sizes = {
      sm: 'padding:6px 16px;font-size:12px;border-radius:6px;',
      md: 'padding:10px 22px;font-size:14px;border-radius:8px;',
      lg: 'padding:14px 32px;font-size:16px;border-radius:10px;',
    };

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          --wc-color-primary:        var(--wc-color-primary,        #6366f1);
          --wc-color-primary-glow:   var(--wc-color-primary-glow,   rgba(99,102,241,.4));
          --wc-color-primary-end:    var(--wc-color-primary-end,    #8b5cf6);
          --wc-color-danger:         var(--wc-color-danger,         #ef4444);
          --wc-color-danger-glow:    var(--wc-color-danger-glow,    rgba(239,68,68,.4));
          --wc-color-success:        var(--wc-color-success,        #10b981);
          --wc-color-success-glow:   var(--wc-color-success-glow,   rgba(16,185,129,.4));
          --wc-font:                 var(--wc-font,                 'Inter', sans-serif);
          --wc-radius:               var(--wc-radius,               8px);
        }

        button {
          font-family: var(--wc-font);
          font-weight: 600;
          letter-spacing: .025em;
          transition: all .2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          white-space: nowrap;
          outline: none;
          position: relative;
          overflow: hidden;
          border: none;
          color: #fff;
          cursor: pointer;
        }

        /* Sizes */
        button.size-sm { padding: 6px 16px; font-size: 12px; border-radius: 6px; }
        button.size-md { padding: 10px 22px; font-size: 14px; border-radius: 8px; }
        button.size-lg { padding: 14px 32px; font-size: 16px; border-radius: 10px; }

        /* Themes */
        button.theme-primary {
          background: linear-gradient(135deg, var(--wc-color-primary), var(--wc-color-primary-end));
          box-shadow: 0 4px 15px var(--wc-color-primary-glow);
        }
        button.theme-danger {
          background: linear-gradient(135deg, var(--wc-color-danger), #dc2626);
          box-shadow: 0 4px 15px var(--wc-color-danger-glow);
        }
        button.theme-success {
          background: linear-gradient(135deg, var(--wc-color-success), #059669);
          box-shadow: 0 4px 15px var(--wc-color-success-glow);
        }
        button.theme-ghost {
          background: transparent;
          color: var(--wc-color-primary);
          border: 2px solid var(--wc-color-primary);
          box-shadow: none;
        }

        /* States & Animations */
        button {
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        button[disabled] {
          pointer-events: none;
          cursor: not-allowed;
          opacity: 0.5;
          filter: grayscale(0.5);
        }

        /* Işık / Parlama (Shine) Efekti */
        button::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 50%; height: 100%;
          background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
          transform: skewX(-25deg);
          transition: left 0.5s ease;
          pointer-events: none;
        }
        button:hover:not([disabled])::after {
          left: 150%;
        }

        button:hover:not([disabled]) { 
          transform: translateY(-2px) scale(1.02); 
          filter: brightness(1.1);
        }
        
        button.theme-primary:hover:not([disabled]) { box-shadow: 0 8px 25px var(--wc-color-primary-glow); }
        button.theme-danger:hover:not([disabled])  { box-shadow: 0 8px 25px var(--wc-color-danger-glow); }
        button.theme-success:hover:not([disabled]) { box-shadow: 0 8px 25px var(--wc-color-success-glow); }
        button.theme-ghost:hover:not([disabled])   { 
          background: rgba(99, 102, 241, 0.1);
          box-shadow: 0 4px 15px var(--wc-color-primary-glow);
        }

        button:active:not([disabled]) { 
          transform: translateY(1px) scale(0.97); 
          filter: brightness(0.95);
        }

        button:focus-visible { outline: 2px solid var(--wc-color-primary); outline-offset: 3px; }

        /* Ripple (Dalga) Efekti */
        span.ripple {
          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 600ms linear;
          background-color: rgba(255, 255, 255, 0.4);
          pointer-events: none;
        }
        button.theme-ghost span.ripple { background-color: var(--wc-color-primary-glow); }

        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }

        .spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      </style>
      <button class="theme-${theme} size-${size}" ${disabled ? 'disabled' : ''} aria-disabled="${disabled}" part="button">
        ${loading ? '<span class="spinner"></span>' : ''}
        <slot></slot>
      </button>
    `;
  }
}

customElements.define('wc-button', WcButton);
export default WcButton;
