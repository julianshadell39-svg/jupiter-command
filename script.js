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
