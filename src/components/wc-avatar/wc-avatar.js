class WcAvatar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['src', 'name', 'size', 'status'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this.render();
  }

  connectedCallback() {
    this.render();
  }

  _getInitials(name) {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  render() {
    const src = this.getAttribute('src');
    const name = this.getAttribute('name') || '';
    const size = this.getAttribute('size') || 'md'; // sm, md, lg
    const status = this.getAttribute('status'); // online, offline, away, busy

    const initials = !src ? this._getInitials(name) : '';

    const sizeMap = {
      sm: { w: '32px', f: '12px', s: '8px' },
      md: { w: '48px', f: '18px', s: '12px' },
      lg: { w: '64px', f: '24px', s: '16px' }
    };
    
    const currentSize = sizeMap[size] || sizeMap.md;

    const statusColors = {
      online: '#10b981', // success
      offline: '#64748b', // slate
      away: '#f59e0b', // warning
      busy: '#ef4444' // danger
    };

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          position: relative;
          --wc-color-primary: var(--wc-color-primary, #6366f1);
          --wc-font: var(--wc-font, 'Inter', sans-serif);
        }

        .avatar {
          width: ${currentSize.w};
          height: ${currentSize.w};
          border-radius: 50%;
          background: ${src ? 'transparent' : 'var(--wc-color-primary)'};
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--wc-font);
          font-weight: 600;
          font-size: ${currentSize.f};
          overflow: hidden;
          user-select: none;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .status {
          position: absolute;
          bottom: 0;
          right: 0;
          width: ${currentSize.s};
          height: ${currentSize.s};
          border-radius: 50%;
          background: ${statusColors[status] || 'transparent'};
          border: 2px solid #0f172a; /* Match body background ideally */
          display: ${status && statusColors[status] ? 'block' : 'none'};
        }
      </style>

      <div class="avatar" part="base" aria-label="${name || 'Avatar'}">
        ${src ? `<img src="${src}" alt="${name}" loading="lazy" />` : initials}
      </div>
      <div class="status" part="status" aria-hidden="true"></div>
    `;
  }
}

customElements.define('wc-avatar', WcAvatar);
export default WcAvatar;
