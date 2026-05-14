class WcSkeleton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['type', 'width', 'height'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const type = this.getAttribute('type') || 'text'; // text, circle, rect
    const width = this.getAttribute('width');
    const height = this.getAttribute('height');

    let defaultWidth = '100%';
    let defaultHeight = '16px';
    let borderRadius = '4px';

    if (type === 'circle') {
      defaultWidth = '48px';
      defaultHeight = '48px';
      borderRadius = '50%';
    } else if (type === 'rect') {
      defaultHeight = '120px';
      borderRadius = '8px';
    }

    const finalWidth = width || defaultWidth;
    const finalHeight = height || defaultHeight;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          width: ${finalWidth};
          height: ${finalHeight};
        }

        .skeleton {
          width: 100%;
          height: 100%;
          border-radius: ${borderRadius};
          background: rgba(255, 255, 255, 0.05);
          position: relative;
          overflow: hidden;
        }

        .skeleton::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.05) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      </style>

      <div class="skeleton" part="base" role="status" aria-label="Yükleniyor..."></div>
    `;
  }
}

customElements.define('wc-skeleton', WcSkeleton);
export default WcSkeleton;
