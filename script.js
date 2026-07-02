(() => {
  'use strict';

  // ── DOM refs ──────────────────────────────────────────
  const walletBtn      = document.getElementById('wallet-btn');
  const walletDot      = document.getElementById('wallet-dot');
  const walletBtnLabel = document.getElementById('wallet-btn-label');
  const walletCard     = document.getElementById('wallet-card');
  const noWalletBanner = document.getElementById('no-wallet-banner');
  const toast          = document.getElementById('toast');

  // ── State ─────────────────────────────────────────────
  let connectedAddress = null;

  // ── Helpers ───────────────────────────────────────────
  function shortAddress(addr) {
    return addr.slice(0, 4) + '...' + addr.slice(-4);
  }

  function showToast(msg, durationMs = 2200) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), durationMs);
  }

  function getSolanaProvider() {
    if ('phantom' in window) {
      const provider = window.phantom?.solana;
      if (provider?.isPhantom) return provider;
    }
    if ('solana' in window && window.solana?.isPhantom) return window.solana;
    if ('solflare' in window) return window.solflare;
    return null;
  }

  // ── Render wallet card ────────────────────────────────
  function renderConnected(address) {
    connectedAddress = address;

    walletBtn.classList.add('connected');
    walletDot.classList.add('connected');
    walletBtnLabel.textContent = shortAddress(address);

    walletCard.innerHTML = `
      <h2>Wallet</h2>
      <div class="wallet-info">
        <div class="wallet-status-badge">
          <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#22c55e"/></svg>
          Connected · Solana Mainnet
        </div>
        <div class="wallet-address-row">
          <span id="address-text">${address}</span>
          <button class="copy-btn" id="copy-addr-btn" title="Copy address">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          </button>
        </div>
        <button class="disconnect-btn" id="disconnect-btn">Disconnect</button>
      </div>
    `;

    document.getElementById('copy-addr-btn').addEventListener('click', () => {
      navigator.clipboard.writeText(address).then(() => showToast('Address copied!'));
    });
    document.getElementById('disconnect-btn').addEventListener('click', disconnect);

    Agent.log('wallet', `Wallet connected: ${shortAddress(address)}`);
    Agent.refreshWallet(true);
  }

  function renderDisconnected() {
    connectedAddress = null;

    walletBtn.classList.remove('connected');
    walletDot.classList.remove('connected');
    walletBtnLabel.textContent = 'Connect Wallet';

    walletCard.innerHTML = `
      <h2>Wallet</h2>
      <div class="wallet-disconnected-msg">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 12V7H4v13h8"/><path d="M20 17l-4 4-2-2"/>
        </svg>
        <span>No wallet connected</span>
        <button class="cta-btn" id="card-connect-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20"/></svg>
          Connect Wallet
        </button>
      </div>
    `;

    document.getElementById('card-connect-btn').addEventListener('click', connect);
    Agent.refreshWallet(false);
  }

  // ── Connect / Disconnect ──────────────────────────────
  async function connect() {
    const provider = getSolanaProvider();

    if (!provider) {
      noWalletBanner.style.display = 'block';
      showToast('No Solana wallet found. Install Phantom!', 3500);
      Agent.log('wallet', 'No Solana wallet extension detected');
      return;
    }

    noWalletBanner.style.display = 'none';

    try {
      const resp = await provider.connect();
      const address = resp.publicKey.toString();
      renderConnected(address);
      showToast('Wallet connected!');
    } catch (err) {
      if (err.code === 4001) {
        showToast('Connection rejected by user.');
        Agent.log('wallet', 'User rejected wallet connection');
      } else {
        showToast('Connection failed. Try again.');
        console.error('[Jupiter Command] wallet connect error:', err);
        Agent.log('wallet', 'Wallet connection error: ' + err.message);
      }
    }
  }

  async function disconnect() {
    const provider = getSolanaProvider();
    try {
      if (provider && provider.disconnect) await provider.disconnect();
    } catch (_) {
      // ignore
    }
    renderDisconnected();
    showToast('Wallet disconnected.');
    Agent.log('wallet', 'Wallet disconnected');
  }

  walletBtn.addEventListener('click', () => {
    if (connectedAddress) disconnect();
    else connect();
  });

  // ── Auto-reconnect ────────────────────────────────────
  (async () => {
    const provider = getSolanaProvider();
    if (!provider) return;

    try {
      if (provider.isConnected && provider.publicKey) {
        renderConnected(provider.publicKey.toString());
        return;
      }
      const resp = await provider.connect({ onlyIfTrusted: true });
      renderConnected(resp.publicKey.toString());
    } catch (_) {
      // not pre-authorized
    }

    provider.on?.('accountChanged', (publicKey) => {
      if (publicKey) renderConnected(publicKey.toString());
      else renderDisconnected();
    });

    provider.on?.('disconnect', () => renderDisconnected());
  })();

  // ── Initial render ────────────────────────────────────
  renderDisconnected();

  // ════════════════════════════════════════════════════════
  // MULTI-PLATFORM AGENT
  // ════════════════════════════════════════════════════════
  const Agent = (() => {

    // ── Feed ─────────────────────────────────────────────
    const feed     = document.getElementById('agent-feed');
    const clearBtn = document.getElementById('feed-clear-btn');
    const pulse    = document.getElementById('agent-pulse');

    clearBtn.addEventListener('click', () => { feed.innerHTML = ''; });

    function pad(n) { return String(n).padStart(2, '0'); }

    function nowStr() {
      const d = new Date();
      return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

    function log(tag, msg) {
      const li = document.createElement('li');
      li.innerHTML =
        `<span class="feed-time">${nowStr()}</span>` +
        `<span class="feed-msg"><span class="feed-tag ${tag}">${tag}</span>${msg}</span>`;
      feed.prepend(li);
      // Keep last 80 entries
      while (feed.children.length > 80) feed.removeChild(feed.lastChild);
    }

    // ── Tile helpers ──────────────────────────────────────
    function setTile(id, status, badge, badgeClass) {
      const statusEl = document.getElementById('status-' + id);
      const badgeEl  = document.getElementById('badge-' + id);
      if (statusEl) statusEl.textContent = status;
      if (badgeEl) {
        badgeEl.textContent  = badge;
        badgeEl.className    = 'platform-badge ' + badgeClass;
      }
    }

    // ── Platform detection ────────────────────────────────
    function detectPlatforms() {
      const ua  = navigator.userAgent;
      const iOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
      const android = /Android/.test(ua);
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;
      const isMobile = iOS || android;
      const isDesktop = !isMobile;

      // Web
      setTile('web', 'Browser active', 'Active', 'ok');
      log('system', 'Browser session started · ' + navigator.userAgent.slice(0, 60) + '…');

      // PWA
      if (standalone) {
        setTile('pwa', 'Running as installed PWA', 'Installed', 'ok');
        log('pwa', 'App running in standalone / installed PWA mode');
      } else {
        setTile('pwa', 'Not installed — add to Home Screen', 'Not installed', 'warn');
        log('pwa', 'App running in browser tab — PWA not yet installed');
      }

      // iOS
      if (iOS) {
        setTile('ios', 'iOS device detected', 'Active', 'ok');
        log('system', 'iOS device detected');
      } else {
        setTile('ios', 'Not an iOS device', 'N/A', 'off');
      }

      // Android
      if (android) {
        setTile('android', 'Android device detected', 'Active', 'ok');
        log('system', 'Android device detected');
      } else {
        setTile('android', 'Not an Android device', 'N/A', 'off');
      }

      // Desktop
      if (isDesktop) {
        setTile('desktop', 'Desktop browser', 'Active', 'ok');
      } else {
        setTile('desktop', 'Not a desktop session', 'N/A', 'off');
      }

      // Listen for display-mode changes (e.g. user installs PWA mid-session)
      window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
        if (e.matches) {
          setTile('pwa', 'Now running as installed PWA', 'Installed', 'ok');
          log('pwa', 'App was installed to home screen — now in standalone mode');
        }
      });
    }

    // ── Network monitoring ────────────────────────────────
    function initNetwork() {
      function update() {
        if (!navigator.onLine) {
          setTile('network', 'Offline', 'Offline', 'err');
          log('net', 'Network went offline');
          return;
        }

        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (conn) {
          const info = [conn.effectiveType, conn.downlink ? conn.downlink + ' Mbps' : ''].filter(Boolean).join(' · ');
          setTile('network', info || 'Online', 'Online', 'ok');
        } else {
          setTile('network', 'Online', 'Online', 'ok');
        }
      }

      window.addEventListener('online',  () => { update(); log('net', 'Network came back online'); });
      window.addEventListener('offline', () => { update(); });
      if (navigator.connection) {
        navigator.connection.addEventListener('change', () => {
          update();
          const conn = navigator.connection;
          log('net', `Network changed → ${conn.effectiveType || 'unknown'}, ${conn.downlink || '?'} Mbps`);
        });
      }

      update();
      log('net', 'Network monitoring started');
    }

    // ── Wallet tile proxy (called by wallet module) ───────
    function refreshWallet(connected) {
      if (connected) {
        setTile('web', 'Browser active · wallet connected', 'Wallet ✓', 'ok');
      } else {
        setTile('web', 'Browser active · wallet disconnected', 'Active', 'ok');
      }
    }

    // ── Visibility / focus monitoring ─────────────────────
    function initVisibility() {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          log('agent', 'App moved to background');
        } else {
          log('agent', 'App returned to foreground');
        }
      });

      window.addEventListener('focus', () => log('agent', 'Window focused'));
      window.addEventListener('blur',  () => log('agent', 'Window blurred'));
    }

    // ── PWA beforeinstallprompt ───────────────────────────
    function initInstallPrompt() {
      window.addEventListener('beforeinstallprompt', () => {
        setTile('pwa', 'Ready to install — add to Home Screen', 'Installable', 'warn');
        log('pwa', 'Browser install prompt available — PWA is installable');
      });

      window.addEventListener('appinstalled', () => {
        setTile('pwa', 'Successfully installed on device', 'Installed', 'ok');
        log('pwa', 'PWA installed on device home screen');
      });
    }

    // ── Heartbeat ─────────────────────────────────────────
    function startHeartbeat() {
      let tick = 0;
      setInterval(() => {
        tick++;
        // Flash the pulse dot
        pulse.style.background = '#fff';
        setTimeout(() => { pulse.style.background = ''; }, 120);

        // Every 30 s log an agent heartbeat
        if (tick % 30 === 0) {
          log('agent', `Heartbeat #${tick / 30} — all surfaces monitored`);
        }
      }, 1000);
    }

    // ── Init ──────────────────────────────────────────────
    function init() {
      log('agent', 'Multi-Platform Agent started');
      detectPlatforms();
      initNetwork();
      initVisibility();
      initInstallPrompt();
      startHeartbeat();
    }

    init();

    return { log, refreshWallet };
  })();

})();

  // ── State ─────────────────────────────────────────────
  let connectedAddress = null;

  // ── Helpers ───────────────────────────────────────────
  function shortAddress(addr) {
    return addr.slice(0, 4) + '...' + addr.slice(-4);
  }

  function showToast(msg, durationMs = 2200) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), durationMs);
  }

  function getSolanaProvider() {
    // Phantom exposes window.solana; other wallets may use window.solana or window.solflare etc.
    if ('phantom' in window) {
      const provider = window.phantom?.solana;
      if (provider?.isPhantom) return provider;
    }
    if ('solana' in window && window.solana?.isPhantom) return window.solana;
    if ('solflare' in window) return window.solflare;
    return null;
  }

  // ── Render ────────────────────────────────────────────
  function renderConnected(address) {
    connectedAddress = address;

    // Header button
    walletBtn.classList.add('connected');
    walletDot.classList.add('connected');
    walletBtnLabel.textContent = shortAddress(address);

    // Card body
    walletCard.innerHTML = `
      <h2>Wallet</h2>
      <div class="wallet-info">
        <div class="wallet-status-badge">
          <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#22c55e"/></svg>
          Connected · Solana Mainnet
        </div>
        <div class="wallet-address-row">
          <span id="address-text">${address}</span>
          <button class="copy-btn" id="copy-addr-btn" title="Copy address">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          </button>
        </div>
        <button class="disconnect-btn" id="disconnect-btn">Disconnect</button>
      </div>
    `;

    document.getElementById('copy-addr-btn').addEventListener('click', () => {
      navigator.clipboard.writeText(address).then(() => showToast('Address copied!'));
    });

    document.getElementById('disconnect-btn').addEventListener('click', disconnect);
  }

  function renderDisconnected() {
    connectedAddress = null;

    // Header button
    walletBtn.classList.remove('connected');
    walletDot.classList.remove('connected');
    walletBtnLabel.textContent = 'Connect Wallet';

    // Card body
    walletCard.innerHTML = `
      <h2>Wallet</h2>
      <div class="wallet-disconnected-msg">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 12V7H4v13h8"/><path d="M20 17l-4 4-2-2"/>
        </svg>
        <span>No wallet connected</span>
        <button class="cta-btn" id="card-connect-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20"/></svg>
          Connect Wallet
        </button>
      </div>
    `;

    document.getElementById('card-connect-btn').addEventListener('click', connect);
  }

  // ── Connect / Disconnect ──────────────────────────────
  async function connect() {
    const provider = getSolanaProvider();

    if (!provider) {
      noWalletBanner.style.display = 'block';
      showToast('No Solana wallet found. Install Phantom!', 3500);
      return;
    }

    noWalletBanner.style.display = 'none';

    try {
      const resp = await provider.connect();
      const address = resp.publicKey.toString();
      renderConnected(address);
      showToast('Wallet connected!');
    } catch (err) {
      if (err.code === 4001) {
        showToast('Connection rejected by user.');
      } else {
        showToast('Connection failed. Try again.');
        console.error('[Jupiter Command] wallet connect error:', err);
      }
    }
  }

  async function disconnect() {
    const provider = getSolanaProvider();
    try {
      if (provider && provider.disconnect) await provider.disconnect();
    } catch (_) {
      // ignore disconnect errors
    }
    renderDisconnected();
    showToast('Wallet disconnected.');
  }

  // ── Event: header button ──────────────────────────────
  walletBtn.addEventListener('click', () => {
    if (connectedAddress) {
      disconnect();
    } else {
      connect();
    }
  });

  // ── Auto-reconnect if wallet already approved ─────────
  (async () => {
    const provider = getSolanaProvider();
    if (!provider) return;

    // eagerly check if already connected (no popup)
    try {
      if (provider.isConnected && provider.publicKey) {
        renderConnected(provider.publicKey.toString());
        return;
      }
      const resp = await provider.connect({ onlyIfTrusted: true });
      renderConnected(resp.publicKey.toString());
    } catch (_) {
      // not pre-authorized — stay disconnected
    }

    // Listen for wallet-initiated account changes
    provider.on?.('accountChanged', (publicKey) => {
      if (publicKey) {
        renderConnected(publicKey.toString());
      } else {
        renderDisconnected();
      }
    });

    provider.on?.('disconnect', () => {
      renderDisconnected();
    });
  })();

  // ── Init render ───────────────────────────────────────
  renderDisconnected();
})();
