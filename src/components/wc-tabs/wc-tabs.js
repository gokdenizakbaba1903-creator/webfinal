class WcTabs extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._active = 0;
  }

  static get observedAttributes() { return ['active']; }

  get active() { return parseInt(this.getAttribute('active') || '0'); }
  set active(val) { this.setAttribute('active', String(val)); }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this._active = parseInt(newValue || '0');
      this._updateState();
    }
  }

  connectedCallback() {
    this._active = this.active;
    const tabLabels = [...this.querySelectorAll('[slot^="tab"]')].map(el => el.textContent.trim());
    this._tabLabels  = tabLabels.length ? tabLabels : ['Sekme 1', 'Sekme 2', 'Sekme 3'];
    this._panelCount = this.querySelectorAll('[slot^="panel"]').length || this._tabLabels.length;
    this.render();
  }

  _selectTab(index) {
    this._active = index;
    this.setAttribute('active', String(index));
    this.dispatchEvent(new CustomEvent('wc-tab-change', {
      detail: { activeIndex: index },
      bubbles: true,
      composed: true,
    }));
    this._updateState();
  }

  _updateState() {
    const tabs      = this.shadowRoot.querySelectorAll('.tab');
    const panels    = this.shadowRoot.querySelectorAll('.panel');
    const indicator = this.shadowRoot.querySelector('.indicator');

    tabs.forEach((tab, i) => {
      const isActive = i === this._active;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
    });
    panels.forEach((panel, i) => {
      panel.style.display = i === this._active ? 'block' : 'none';
    });
    if (indicator && tabs[this._active]) {
      const t = tabs[this._active];
      indicator.style.left  = t.offsetLeft + 'px';
      indicator.style.width = t.offsetWidth + 'px';
    }
  }

  render() {
    const labels     = this._tabLabels;
    const panelCount = this._panelCount;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          /* CSS Custom Properties */
          --wc-color-primary:      var(--wc-color-primary,      #6366f1);
          --wc-color-primary-end:  var(--wc-color-primary-end,  #8b5cf6);
          --wc-color-primary-glow: var(--wc-color-primary-glow, rgba(99,102,241,.4));
          --wc-color-text:         var(--wc-color-text,         #f1f5f9);
          --wc-color-muted:        var(--wc-color-muted,        rgba(255,255,255,.5));
          --wc-font:               var(--wc-font,               'Inter', sans-serif);
          --wc-radius:             var(--wc-radius,             10px);
          font-family: var(--wc-font);
        }

        .tab-bar {
          display: flex; gap: 4px;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: var(--wc-radius);
          padding: 4px;
          position: relative;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .tab-bar::-webkit-scrollbar { display: none; }

        .tab {
          flex: 1; padding: 10px 20px;
          background: transparent; border: none;
          color: var(--wc-color-muted);
          font-family: var(--wc-font);
          font-size: 14px; font-weight: 500;
          cursor: pointer; border-radius: 9px;
          transition: color .2s;
          position: relative; z-index: 1;
          white-space: nowrap;
        }
        .tab.active { color: var(--wc-color-text); }
        .tab:hover:not(.active) { color: rgba(255,255,255,.75); }
        .tab:focus-visible { outline: 2px solid var(--wc-color-primary); outline-offset: -2px; }

        .indicator {
          position: absolute;
          height: calc(100% - 8px); top: 4px;
          background: linear-gradient(135deg, var(--wc-color-primary), var(--wc-color-primary-end));
          border-radius: 8px;
          transition: left .25s cubic-bezier(.4,0,.2,1), width .25s cubic-bezier(.4,0,.2,1);
          box-shadow: 0 4px 12px var(--wc-color-primary-glow);
        }

        .panels { margin-top: 16px; }
        .panel {
          animation: fadePanel .25s ease;
          color: rgba(255,255,255,.75);
          font-size: 15px; line-height: 1.7;
        }
        @keyframes fadePanel {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      </style>

      <div class="tab-bar" role="tablist">
        <div class="indicator"></div>
        ${labels.map((label, i) => `
          <button
            class="tab ${i === this._active ? 'active' : ''}"
            role="tab"
            aria-selected="${i === this._active}"
            aria-controls="panel-${i}"
            id="tab-${i}"
            data-index="${i}"
            tabindex="${i === this._active ? '0' : '-1'}"
          >${label}</button>`).join('')}
      </div>
      <div class="panels">
        ${Array.from({ length: panelCount }, (_, i) => `
          <div
            class="panel"
            style="display:${i === this._active ? 'block' : 'none'}"
            role="tabpanel"
            id="panel-${i}"
            aria-labelledby="tab-${i}"
          ><slot name="panel-${i}"></slot></div>`).join('')}
      </div>`;

    this.shadowRoot.querySelectorAll('.tab').forEach((tab, i) => {
      tab.addEventListener('click', () => this._selectTab(i));
      tab.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); this._selectTab(Math.min(i + 1, labels.length - 1)); }
        if (e.key === 'ArrowLeft')  { e.preventDefault(); this._selectTab(Math.max(i - 1, 0)); }
        if (e.key === 'Home')       { e.preventDefault(); this._selectTab(0); }
        if (e.key === 'End')        { e.preventDefault(); this._selectTab(labels.length - 1); }
      });
    });

    requestAnimationFrame(() => this._updateState());
  }
}

customElements.define('wc-tabs', WcTabs);
export default WcTabs;
