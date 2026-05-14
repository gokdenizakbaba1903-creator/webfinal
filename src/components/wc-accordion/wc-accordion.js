class WcAccordion extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['open', 'title'];
  }

  get open() { return this.hasAttribute('open'); }
  set open(val) { val ? this.setAttribute('open', '') : this.removeAttribute('open'); }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === 'open') {
        this._updateState();
        this.dispatchEvent(new CustomEvent('toggle', { detail: { open: this.open }, bubbles: true }));
      } else {
        this.render();
      }
    }
  }

  connectedCallback() {
    this.render();
    this._header = this.shadowRoot.querySelector('.header');
    this._content = this.shadowRoot.querySelector('.content-wrapper');
    this._icon = this.shadowRoot.querySelector('.icon');
    
    this._header.addEventListener('click', () => {
      this.open = !this.open;
    });

    this._header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.open = !this.open;
      }
    });

    // Initial state setup without animation delay
    this._updateState(true);
  }

  _updateState(initial = false) {
    if (!this._content || !this._icon) return;
    
    const isOpen = this.open;
    this._header.setAttribute('aria-expanded', String(isOpen));
    
    if (isOpen) {
      this._content.style.height = this._content.scrollHeight + 'px';
      this._content.style.opacity = '1';
      this._icon.style.transform = 'rotate(180deg)';
    } else {
      this._content.style.height = '0px';
      this._content.style.opacity = '0';
      this._icon.style.transform = 'rotate(0deg)';
    }

    // Reset height to auto after animation so content inside can resize naturally
    if (isOpen && !initial) {
      this._content.addEventListener('transitionend', function handler(e) {
        if (e.propertyName === 'height') {
          this.style.height = 'auto';
          this.removeEventListener('transitionend', handler);
        }
      });
    }
  }

  render() {
    const title = this.getAttribute('title') || 'Accordion Title';
    const isOpen = this.hasAttribute('open');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          --wc-color-primary: var(--wc-color-primary, #6366f1);
          --wc-font: var(--wc-font, 'Inter', sans-serif);
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 0;
          cursor: pointer;
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
          color: rgba(255, 255, 255, 0.9);
          font-family: var(--wc-font);
          font-size: 16px;
          font-weight: 500;
          transition: color 0.2s;
          outline: none;
        }

        .header:hover {
          color: #fff;
        }

        .header:focus-visible {
          color: var(--wc-color-primary);
          text-decoration: underline;
        }

        .icon {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .content-wrapper {
          height: 0;
          opacity: 0;
          overflow: hidden;
          transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
        }

        .content {
          padding-bottom: 16px;
          color: rgba(255, 255, 255, 0.7);
          font-family: var(--wc-font);
          font-size: 15px;
          line-height: 1.6;
        }
      </style>

      <button class="header" aria-expanded="${isOpen}" aria-controls="content">
        <span part="title">${title}</span>
        <svg class="icon" width="20" height="20" viewBox="0 0 24 24">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div class="content-wrapper" id="content" part="content-wrapper">
        <div class="content" part="content">
          <slot></slot>
        </div>
      </div>
    `;

    // Re-attach elements if render runs again
    this._header = this.shadowRoot.querySelector('.header');
    this._content = this.shadowRoot.querySelector('.content-wrapper');
    this._icon = this.shadowRoot.querySelector('.icon');
    if (this.open) this._updateState(true);
  }
}

customElements.define('wc-accordion', WcAccordion);
export default WcAccordion;
