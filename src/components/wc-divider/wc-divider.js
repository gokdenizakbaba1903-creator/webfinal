class WcDivider extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['orientation'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const orientation = this.getAttribute('orientation') || 'horizontal';
    const hasText = this.innerHTML.trim().length > 0;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: ${orientation === 'vertical' ? 'inline-block' : 'block'};
          --wc-color-border: var(--wc-color-border, rgba(255, 255, 255, 0.15));
          --wc-color-text: var(--wc-color-text, rgba(255, 255, 255, 0.6));
          --wc-font: var(--wc-font, 'Inter', sans-serif);
          margin: ${orientation === 'vertical' ? '0 16px' : '24px 0'};
        }

        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          color: var(--wc-color-text);
          font-family: var(--wc-font);
          font-size: 14px;
        }

        .divider::before,
        .divider::after {
          content: '';
          background: var(--wc-color-border);
        }

        /* Horizontal */
        .divider.horizontal::before,
        .divider.horizontal::after {
          flex: 1;
          height: 1px;
        }

        .divider.horizontal.has-text::before {
          margin-right: 16px;
        }

        .divider.horizontal.has-text::after {
          margin-left: 16px;
        }

        /* Vertical */
        .divider.vertical {
          flex-direction: column;
          height: 100%;
          min-height: 20px;
        }

        .divider.vertical::before,
        .divider.vertical::after {
          flex: 1;
          width: 1px;
        }

        .divider.vertical.has-text::before {
          margin-bottom: 8px;
        }

        .divider.vertical.has-text::after {
          margin-top: 8px;
        }
      </style>

      <div class="divider ${orientation} ${hasText ? 'has-text' : ''}" part="base" role="separator" aria-orientation="${orientation}">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('wc-divider', WcDivider);
export default WcDivider;
