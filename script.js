/* global COINGECKO_IDS, SpeechRecognition, webkitSpeechRecognition */

'use strict';

// ── Constants ─────────────────────────────────────────────────────────────────

const COINGECKO_IDS = ['solana', 'jupiter-exchange-solana', 'bitcoin', 'ethereum', 'binancecoin'];
const PRICE_REFRESH_MS = 60_000;
const COINGECKO_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=' +
  COINGECKO_IDS.join(',') +
  '&vs_currencies=usd&include_24hr_change=true';

// ALFRED knowledge base — pattern → response
const ALFRED_RESPONSES = [
  { pattern: /\b(hello|hi|hey|good\s+\w+)\b/i, reply: "Greetings, Commander. All systems are online and ready for your DeFi operations." },
  { pattern: /\bsolana\b|\bsol\b/i, reply: "Solana (SOL) is a high-throughput Layer-1 blockchain. It underpins Jupiter's swap aggregator and the entire ecosystem here at Command." },
  { pattern: /\bjupiter\b|\bjup\b/i, reply: "Jupiter is the leading DEX aggregator on Solana. JUP is the protocol's governance and utility token — a core asset in our portfolio." },
  { pattern: /\bbitcoin\b|\bbtc\b/i, reply: "Bitcoin (BTC) remains the benchmark asset of the crypto market. I monitor it continuously for macro sentiment signals." },
  { pattern: /\bethereum\b|\beth\b/i, reply: "Ethereum (ETH) is the leading smart contract platform. Its price action often sets the tone for the broader DeFi sector." },
  { pattern: /\bbnb\b|\bbinance\b/i, reply: "BNB is the native token of the BNB Chain ecosystem and Binance exchange. I track it alongside the other majors." },
  { pattern: /\bprice\b|\bmarket\b|\bcost\b/i, reply: "Current prices are displayed in the Live Market section above, refreshed every 60 seconds via CoinGecko." },
  { pattern: /\bswap\b|\btrade\b|\bbuy\b|\bsell\b/i, reply: "To execute a swap on Jupiter, visit jup.ag, connect your Solana wallet, select your tokens, review the route, and confirm the transaction. Always check slippage settings before swapping." },
  { pattern: /\bwallet\b/i, reply: "Connect a Solana-compatible wallet — Phantom, Solflare, or Backpack work great with Jupiter Terminal. Never share your seed phrase." },
  { pattern: /\bhelp\b|\bcommand\b|\bwhat\s+can\b/i, reply: "I can answer questions about Solana, Jupiter, DeFi, market prices, swaps, wallets, and portfolio strategy. Just ask — voice or text." },
  { pattern: /\bportfolio\b|\banalytics\b|\btrack\b/i, reply: "Portfolio analytics is on the roadmap for Jupiter Command. You'll be able to track P&L, holdings, and historical performance from this dashboard." },
  { pattern: /\bdonat\b|\bsupport\b/i, reply: "Thank you, Commander. Donations are accepted at the Solana wallet in the Donate section. Every contribution fuels mission-critical development." },
  { pattern: /\bpump\.fun\b|\bpump\b|\blaunch\b/i, reply: "pump.fun integration is planned for a future update — you'll be able to monitor and interact with newly launched Solana tokens directly from Command." },
];

const DEFAULT_REPLY = "I'm processing your request, Commander. My knowledge of Solana DeFi protocols is at your disposal. Could you rephrase or ask about a specific token, swap, or strategy?";

// ── DOM References ─────────────────────────────────────────────────────────────

const alfredLog = document.getElementById('alfredLog');
const alfredInput = document.getElementById('alfredInput');
const sendBtn = document.getElementById('sendBtn');
const micBtn = document.getElementById('micBtn');
const voiceStatus = document.getElementById('voiceStatus');
const copyWalletBtn = document.getElementById('copyWalletBtn');
const footerYear = document.getElementById('footerYear');

// ── Footer Year ────────────────────────────────────────────────────────────────

if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

// ── Crypto Prices ──────────────────────────────────────────────────────────────

async function fetchPrices() {
  try {
    const res = await fetch(COINGECKO_URL);
    if (!res.ok) throw new Error('CoinGecko response: ' + res.status);
    const data = await res.json();
    updatePriceCards(data);
  } catch (err) {
    console.warn('[Jupiter Command] Price fetch failed:', err.message);
  }
}

function formatPrice(usd) {
  if (usd >= 1000) return '$' + usd.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (usd >= 1) return '$' + usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return '$' + usd.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 });
}

function updatePriceCards(data) {
  document.querySelectorAll('[data-coin]').forEach(el => {
    const id = el.dataset.coin;
    const entry = data[id];
    if (!entry) return;
    el.textContent = formatPrice(entry.usd);
  });

  document.querySelectorAll('[data-change]').forEach(el => {
    const id = el.dataset.change;
    const entry = data[id];
    if (!entry) return;
    const change = entry.usd_24h_change;
    if (change == null) return;
    const positive = change >= 0;
    el.textContent = (positive ? '+' : '') + change.toFixed(2) + '%';
    el.className = 'ticker-change ' + (positive ? 'positive' : 'negative');
  });
}

fetchPrices();
setInterval(fetchPrices, PRICE_REFRESH_MS);

// ── ALFRED AI Communicator ─────────────────────────────────────────────────────

function alfredReply(text) {
  for (const { pattern, reply } of ALFRED_RESPONSES) {
    if (pattern.test(text)) return reply;
  }
  return DEFAULT_REPLY;
}

function appendMessage(sender, text) {
  const wrapper = document.createElement('div');
  wrapper.className = 'alfred-msg ' + (sender === 'ALFRED' ? 'alfred' : 'user');

  const senderEl = document.createElement('span');
  senderEl.className = 'msg-sender';
  senderEl.textContent = sender;

  const textEl = document.createElement('span');
  textEl.className = 'msg-text';
  textEl.textContent = text;

  wrapper.appendChild(senderEl);
  wrapper.appendChild(textEl);
  alfredLog.appendChild(wrapper);
  alfredLog.scrollTop = alfredLog.scrollHeight;
}

function processCommand(input) {
  const text = input.trim();
  if (!text) return;
  appendMessage('Commander', text);
  const reply = alfredReply(text);
  // Small delay to feel more natural
  setTimeout(() => appendMessage('ALFRED', reply), 320);
}

if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    processCommand(alfredInput.value);
    alfredInput.value = '';
  });
}

if (alfredInput) {
  alfredInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      processCommand(alfredInput.value);
      alfredInput.value = '';
    }
  });
}

// ── Web Speech API ─────────────────────────────────────────────────────────────

const SpeechRecognitionAPI =
  (typeof SpeechRecognition !== 'undefined' && SpeechRecognition) ||
  (typeof webkitSpeechRecognition !== 'undefined' && webkitSpeechRecognition) ||
  null;

if (!SpeechRecognitionAPI) {
  if (micBtn) {
    micBtn.title = 'Voice input is not supported in this browser';
    micBtn.disabled = true;
    micBtn.style.opacity = '0.4';
  }
} else {
  const recognition = new SpeechRecognitionAPI();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  let listening = false;

  recognition.onstart = () => {
    listening = true;
    micBtn.classList.add('active');
    if (voiceStatus) voiceStatus.textContent = 'Listening…';
  };

  recognition.onend = () => {
    listening = false;
    micBtn.classList.remove('active');
    if (voiceStatus) voiceStatus.textContent = '';
  };

  recognition.onerror = (e) => {
    if (voiceStatus) voiceStatus.textContent = 'Voice error: ' + e.error;
    listening = false;
    micBtn.classList.remove('active');
  };

  recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    if (alfredInput) alfredInput.value = transcript;
    processCommand(transcript);
    if (alfredInput) alfredInput.value = '';
  };

  if (micBtn) {
    micBtn.addEventListener('click', () => {
      if (listening) {
        recognition.stop();
      } else {
        recognition.start();
      }
    });
  }
}

// ── Copy Wallet Address ────────────────────────────────────────────────────────

if (copyWalletBtn) {
  copyWalletBtn.addEventListener('click', () => {
    const address = document.getElementById('walletAddress');
    if (!address) return;
    navigator.clipboard.writeText(address.textContent.trim())
      .then(() => {
        const original = copyWalletBtn.textContent;
        copyWalletBtn.textContent = 'Copied!';
        setTimeout(() => { copyWalletBtn.textContent = original; }, 2000);
      })
      .catch(() => {
        copyWalletBtn.textContent = 'Error';
        setTimeout(() => { copyWalletBtn.textContent = 'Copy'; }, 2000);
      });
  });
}
