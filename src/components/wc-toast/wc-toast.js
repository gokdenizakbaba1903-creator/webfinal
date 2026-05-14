/**
 * wc-toast — Bildirim (Toast) Sistemi
 *
 * Kullanım:
 *   Önce sayfaya DOM üzerinden ekleyin:
 *   <wc-toast></wc-toast>
 *
 *   Sonra JavaScript ile tetikleyin:
 *   document.querySelector('wc-toast').show({
 *     message: 'Kayıt başarılı!',
 *     type: 'success', // 'success' | 'danger' | 'warning' | 'info' (default)
 *     duration: 3000   // ms cinsinden süre
 *   });
 */
class WcToast extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._queue = [];
    this._isShowing = false;
  }

  connectedCallback() {
    this.render();
  }

  show({ message, type = 'info', duration = 3000 }) {
    this._queue.push({ message, type, duration });
    if (!this._isShowing) this._processQueue();
  }

  _processQueue() {
    if (this._queue.length === 0) {
      this._isShowing = false;
      return;
    }

    this._isShowing = true;
    const toast = this._queue.shift();
    this._displayToast(toast);
  }

  _displayToast({ message, type, duration }) {
    const icons = {
      success: '✅',
      danger:  '⚠️',
      warning: '⚡',
      info:    'ℹ️',
    };

    const container = this.shadowRoot.querySelector('.toast-container');
    const toastEl = document.createElement('div');
    toastEl.className = `toast ${type}`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    
    toastEl.innerHTML = `
      <span class="icon">${icons[type] || icons.info}</span>
      <span class="message">${message}</span>
      <button class="close-btn" aria-label="Kapat">✕</button>
    `;

    container.appendChild(toastEl);

    // Animasyon için frame bekle
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toastEl.classList.add('show');
      });
    });

    // Kapatma işlemi
    let isClosed = false;
    const close = () => {
      if (isClosed) return;
      isClosed = true;
      toastEl.classList.remove('show');
      toastEl.classList.add('hide');
      toastEl.addEventListener('transitionend', () => {
        toastEl.remove();
        this._processQueue();
      }, { once: true });
    };

    // Timeout ile kapatma
    let timer = setTimeout(close, duration);

    // Buton ile kapatma
    toastEl.querySelector('.close-btn').addEventListener('click', () => {
      clearTimeout(timer);
      close();
    });

    // Hover durumunda duraklat (opsiyonel geliştirme)
    toastEl.addEventListener('mouseenter', () => clearTimeout(timer));
    toastEl.addEventListener('mouseleave', () => {
      if (!isClosed) timer = setTimeout(close, duration);
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          pointer-events: none; /* Container tıklamaları engellemesin */
          /* CSS Custom Properties */
          --wc-color-surface: var(--wc-color-surface, #13131f);
          --wc-color-text:    var(--wc-color-text,    #f1f5f9);
          --wc-font:          var(--wc-font,          'Inter', sans-serif);
          --wc-color-success: var(--wc-color-success, #10b981);
          --wc-color-danger:  var(--wc-color-danger,  #ef4444);
          --wc-color-warning: var(--wc-color-warning, #f59e0b);
          --wc-color-info:    var(--wc-color-primary, #6366f1);
        }

        .toast-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: flex-end;
        }

        .toast {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          background: var(--wc-color-surface);
          border-left: 4px solid var(--wc-color-info); /* Default info */
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0,0,0,.5);
          color: var(--wc-color-text);
          font-family: var(--wc-font);
          font-size: 14px;
          font-weight: 500;
          pointer-events: auto; /* Toast'a tıklanabilsin */
          opacity: 0;
          transform: translateX(100%) scale(0.95);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          min-width: 250px;
          max-width: 400px;
        }

        .toast.show {
          opacity: 1;
          transform: translateX(0) scale(1);
        }

        .toast.hide {
          opacity: 0;
          transform: translateX(100%) scale(0.95);
          transition: all 0.25s ease-in;
        }

        /* Tip Varyasyonları */
        .toast.success { border-left-color: var(--wc-color-success); }
        .toast.danger  { border-left-color: var(--wc-color-danger); }
        .toast.warning { border-left-color: var(--wc-color-warning); }
        .toast.info    { border-left-color: var(--wc-color-info); }

        .icon { font-size: 18px; }
        .message { flex: 1; line-height: 1.4; }

        .close-btn {
          background: transparent;
          border: none;
          color: rgba(255,255,255,.5);
          font-size: 14px;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: background 0.2s, color 0.2s;
        }

        .close-btn:hover {
          background: rgba(255,255,255,.1);
          color: #fff;
        }
      </style>
      <div class="toast-container" part="container"></div>
    `;
  }
}

customElements.define('wc-toast', WcToast);
export default WcToast;
