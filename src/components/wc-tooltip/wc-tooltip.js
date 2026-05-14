class WcTooltip extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._uid = `wc-tooltip-${Math.random().toString(36).slice(2, 8)}`;
  }

  static get observedAttributes() {
    return ['content', 'position'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const content = this.getAttribute('content') || '';
    const pos     = this.getAttribute('position') || 'top';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          position: relative;
          --wc-color-primary: var(--wc-color-primary, #6366f1);
          --wc-font:          var(--wc-font,          'Inter', sans-serif);
          --wc-tooltip-bg:    var(--wc-tooltip-bg,    #1e2035);
          --wc-tooltip-text:  var(--wc-tooltip-text,  #e2e8f0);
        }

        .tooltip {
          position: absolute;
          background: var(--wc-tooltip-bg);
          color: var(--wc-tooltip-text);
          font-family: var(--wc-font);
          font-size: 13px;
          font-weight: 500;
          padding: 7px 12px;
          border-radius: 8px;
          white-space: nowrap;
          pointer-events: none;
          z-index: 100;
          opacity: 0;
          transition: opacity .2s ease;
          border: 1px solid rgba(255,255,255,.1);
          box-shadow: 0 8px 24px rgba(0,0,0,.4);
        }

        .tooltip::after {
          content: '';
          position: absolute;
          width: 0; height: 0;
          border: 6px solid transparent;
        }

        /* Positions */
        .pos-top { bottom: calc(100% + 10px); left: 50%; transform: translateX(-50%); }
        .pos-top::after { top: 100%; left: 50%; transform: translateX(-50%); border-color: var(--wc-tooltip-bg) transparent transparent transparent; }

        .pos-bottom { top: calc(100% + 10px); left: 50%; transform: translateX(-50%); }
        .pos-bottom::after { bottom: 100%; left: 50%; transform: translateX(-50%); border-color: transparent transparent var(--wc-tooltip-bg) transparent; }

        .pos-left { right: calc(100% + 10px); top: 50%; transform: translateY(-50%); }
        .pos-left::after { left: 100%; top: 50%; transform: translateY(-50%); border-color: transparent transparent transparent var(--wc-tooltip-bg); }

        .pos-right { left: calc(100% + 10px); top: 50%; transform: translateY(-50%); }
        .pos-right::after { right: 100%; top: 50%; transform: translateY(-50%); border-color: transparent var(--wc-tooltip-bg) transparent transparent; }

        :host(:hover) .tooltip, :host(:focus-within) .tooltip { opacity: 1; }
      </style>

      <slot aria-describedby="${this._uid}"></slot>
      <div
        class="tooltip pos-${pos}"
        id="${this._uid}"
        role="tooltip"
        part="tooltip"
      >${content}</div>
    `;
  }
}

customElements.define('wc-tooltip', WcTooltip);
export default WcTooltip;
