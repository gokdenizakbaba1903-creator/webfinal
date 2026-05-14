class WcSpinner extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['size', 'theme'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const size = this.getAttribute('size') || 'md';
    const theme = this.getAttribute('theme') || 'primary';

    const sizeMap = {
      sm: '16px',
      md: '24px',
      lg: '36px',
      xl: '48px'
    };
    
    const currentSize = sizeMap[size] || sizeMap.md;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          --wc-color-primary: var(--wc-color-primary, #6366f1);
          --wc-color-danger: var(--wc-color-danger, #ef4444);
          --wc-color-success: var(--wc-color-success, #10b981);
          --wc-color-muted: var(--wc-color-muted, #94a3b8);
          line-height: 0;
        }

        .spinner {
          width: ${currentSize};
          height: ${currentSize};
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: var(--wc-color-${theme}, var(--wc-color-primary));
          border-radius: 50%;
          animation: spin 0.8s cubic-bezier(0.5, 0.1, 0.4, 0.9) infinite;
          box-sizing: border-box;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      </style>

      <div class="spinner" part="base" role="status" aria-label="Yükleniyor..."></div>
    `;
  }
}

customElements.define('wc-spinner', WcSpinner);
export default WcSpinner;
