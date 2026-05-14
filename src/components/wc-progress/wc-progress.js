class WcProgress extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['value', 'max', 'theme', 'label'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === 'value' || name === 'max') this._updateProgress();
      else this.render();
    }
  }

  connectedCallback() {
    this.render();
    // Delay initial update slightly for animation to work on mount
    setTimeout(() => this._updateProgress(), 50);
  }

  _updateProgress() {
    if (!this.shadowRoot) return;
    const bar = this.shadowRoot.querySelector('.bar-fill');
    if (!bar) return;

    let val = parseFloat(this.getAttribute('value')) || 0;
    let max = parseFloat(this.getAttribute('max')) || 100;
    
    if (val < 0) val = 0;
    if (val > max) val = max;
    
    const percentage = max > 0 ? Math.round((val / max) * 100) : 0;
    bar.style.width = `${percentage}%`;
  }

  render() {
    const theme = this.getAttribute('theme') || 'primary';
    const label = this.getAttribute('label');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          --wc-color-primary: var(--wc-color-primary, #6366f1);
          --wc-color-danger: var(--wc-color-danger, #ef4444);
          --wc-color-success: var(--wc-color-success, #10b981);
          --wc-color-warning: var(--wc-color-warning, #f59e0b);
          --wc-font: var(--wc-font, 'Inter', sans-serif);
        }

        .container {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 100%;
        }

        .label-row {
          display: flex;
          justify-content: space-between;
          font-family: var(--wc-font);
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        .track {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
          position: relative;
        }

        .bar-fill {
          height: 100%;
          width: 0%;
          background: var(--wc-color-${theme}, var(--wc-color-primary));
          border-radius: 4px;
          transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        /* Animated shine effect on the progress bar */
        .bar-fill::after {
          content: '';
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 2s infinite linear;
          transform: skewX(-20deg);
        }

        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(150%) skewX(-20deg); }
        }
      </style>

      <div class="container" part="container">
        ${label ? `
          <div class="label-row" part="label-row">
            <span>${label}</span>
          </div>
        ` : ''}
        <div class="track" part="track" role="progressbar" aria-valuemin="0" aria-valuemax="${this.getAttribute('max') || 100}" aria-valuenow="${this.getAttribute('value') || 0}">
          <div class="bar-fill" part="fill"></div>
        </div>
      </div>
    `;
  }
}

customElements.define('wc-progress', WcProgress);
export default WcProgress;
