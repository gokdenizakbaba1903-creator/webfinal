class WcAlert extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['theme', 'title'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this.render();
  }

  connectedCallback() {
    if (!this.hasAttribute('role')) this.setAttribute('role', 'alert');
    this.render();
  }

  render() {
    const theme = this.getAttribute('theme') || 'info'; // info, success, warning, danger
    const title = this.getAttribute('title');

    const icons = {
      info: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>',
      success: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>',
      warning: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>',
      danger: '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>'
    };

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          --wc-font: var(--wc-font, 'Inter', sans-serif);
          --wc-color-info: var(--wc-color-primary, #3b82f6);
          --wc-color-success: var(--wc-color-success, #10b981);
          --wc-color-warning: var(--wc-color-warning, #f59e0b);
          --wc-color-danger: var(--wc-color-danger, #ef4444);
        }

        .alert {
          display: flex;
          align-items: flex-start;
          padding: 16px;
          border-radius: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          font-family: var(--wc-font);
        }

        .alert.theme-info {
          background: rgba(59, 130, 246, 0.1);
          border-color: rgba(59, 130, 246, 0.2);
        }
        .alert.theme-info .icon { color: var(--wc-color-info); }

        .alert.theme-success {
          background: rgba(16, 185, 129, 0.1);
          border-color: rgba(16, 185, 129, 0.2);
        }
        .alert.theme-success .icon { color: var(--wc-color-success); }

        .alert.theme-warning {
          background: rgba(245, 158, 11, 0.1);
          border-color: rgba(245, 158, 11, 0.2);
        }
        .alert.theme-warning .icon { color: var(--wc-color-warning); }

        .alert.theme-danger {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.2);
        }
        .alert.theme-danger .icon { color: var(--wc-color-danger); }

        .icon {
          flex-shrink: 0;
          margin-right: 16px;
          margin-top: 2px;
        }

        svg {
          width: 24px;
          height: 24px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .content {
          flex: 1;
        }

        .title {
          font-weight: 600;
          font-size: 15px;
          color: #fff;
          margin-bottom: 6px;
        }

        .message {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.5;
        }
      </style>

      <div class="alert theme-${theme}" part="base">
        <div class="icon" part="icon">
          <svg viewBox="0 0 24 24">${icons[theme] || icons.info}</svg>
        </div>
        <div class="content">
          ${title ? `<div class="title" part="title">${title}</div>` : ''}
          <div class="message" part="message">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('wc-alert', WcAlert);
export default WcAlert;
