/* ============================================================
   JUPITER COMMAND — AI Communicator Script
   ALFRED: AI Field Liaison for Real-time DeFi & Engagement
   ============================================================ */

'use strict';

// ── State ─────────────────────────────────────────────────────
const state = {
  speaking:   false,
  listening:  false,
  prices:     {},
  recognition: null,
  synth:      window.speechSynthesis || null,
};

// ── DOM refs ──────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);
const chatLog    = $('chat-log');
const cmdInput   = $('cmd-input');
const micBtn     = $('mic-btn');
const sendBtn    = $('send-btn');
const avatarCore = $('avatar-core');
const voiceWave  = $('voice-wave');
const missionLog = $('mission-log');

// ── Boot sequence ─────────────────────────────────────────────
(function boot() {
  const overlay  = $('boot-overlay');
  const progress = $('boot-progress');
  const bootLine = $('boot-line');
  const steps = [
    [10,  'LOADING AI CORE...'],
    [30,  'INITIALIZING VOICE SYSTEMS...'],
    [55,  'CONNECTING MARKET FEED...'],
    [80,  'SYNCING SOLANA NETWORK...'],
    [100, 'SYSTEMS NOMINAL. ALFRED ONLINE.'],
  ];
  let i = 0;
  function nextStep() {
    if (i >= steps.length) {
      setTimeout(() => {
        overlay.classList.add('fade-out');
        setTimeout(() => {
          overlay.style.display = 'none';
          $('hud').classList.remove('hidden');
          onReady();
        }, 900);
      }, 500);
      return;
    }
    const [pct, label] = steps[i++];
    progress.style.width = pct + '%';
    bootLine.textContent = label;
    setTimeout(nextStep, 520);
  }
  nextStep();
})();

// ── On ready ─────────────────────────────────────────────────
function onReady() {
  startClock();
  setupVoice();
  fetchPrices();
  setInterval(fetchPrices, 60000); // refresh every minute
  setupInput();
  logMission('ALFRED online.');
  logMission('Market feed active.');
}

// ── Clock ─────────────────────────────────────────────────────
function startClock() {
  function tick() {
    const now = new Date();
    $('hud-clock').textContent = now.toUTCString().replace('GMT', 'UTC').slice(5, 25);
  }
  tick();
  setInterval(tick, 1000);
}

// ── Prices (CoinGecko free API) ───────────────────────────────
async function fetchPrices() {
  try {
    const ids = 'solana,jupiter-exchange-solana,bitcoin,ethereum,binancecoin';
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
    const res  = await fetch(url);
    if (!res.ok) throw new Error('API error ' + res.status);
    const data = await res.json();

    const map = {
      sol: data['solana'],
      jup: data['jupiter-exchange-solana'],
      btc: data['bitcoin'],
      eth: data['ethereum'],
      bnb: data['binancecoin'],
    };

    for (const [key, val] of Object.entries(map)) {
      if (!val) continue;
      state.prices[key] = val;
      const priceEl  = $(`price-${key}`);
      const changeEl = $(`change-${key}`);
      if (priceEl) priceEl.textContent = '$' + formatPrice(val.usd);
      if (changeEl) {
        const chg = val.usd_24h_change;
        changeEl.textContent = (chg >= 0 ? '▲ ' : '▼ ') + Math.abs(chg).toFixed(2) + '%';
        changeEl.className   = 'tick-change ' + (chg >= 0 ? 'up' : 'down');
      }
    }

    setStatus('feed-status', 'LIVE', 'green');
    logMission('Prices refreshed.');
  } catch {
    setStatus('feed-status', 'ERROR', 'red');
  }
}

function formatPrice(n) {
  if (n >= 1000) return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (n >= 1)    return n.toFixed(2);
  return n.toFixed(4);
}

function setStatus(id, text, cls) {
  const el = $(id);
  if (!el) return;
  el.textContent  = text;
  el.className    = 'stat-val ' + cls;
}

// ── Voice setup ───────────────────────────────────────────────
function setupVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    const rec = new SpeechRecognition();
    rec.lang        = 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript.trim();
      stopListening();
      processCommand(transcript);
    };
    rec.onerror = () => stopListening();
    rec.onend   = () => stopListening();
    state.recognition = rec;
    setStatus('voice-status', 'READY', 'green');
  } else {
    setStatus('voice-status', 'N/A', 'yellow');
  }
}

function startListening() {
  if (!state.recognition || state.listening) return;
  state.listening = true;
  micBtn.classList.add('recording');
  voiceWave.classList.add('active');
  try { state.recognition.start(); } catch { stopListening(); }
}

function stopListening() {
  state.listening = false;
  micBtn.classList.remove('recording');
  voiceWave.classList.remove('active');
  try { state.recognition.stop(); } catch { /* ignore */ }
}

// ── Input setup ───────────────────────────────────────────────
function setupInput() {
  micBtn.addEventListener('click', () => {
    if (state.listening) stopListening();
    else startListening();
  });

  sendBtn.addEventListener('click', () => sendInput());

  cmdInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendInput();
  });
}

function sendInput() {
  const val = cmdInput.value.trim();
  if (!val) return;
  cmdInput.value = '';
  processCommand(val);
}

function quickCmd(cmd) { processCommand(cmd); }

// ── Message rendering ─────────────────────────────────────────
function addMsg(who, text) {
  const wrap = document.createElement('div');
  wrap.className = `msg msg-${who}`;

  const sender = document.createElement('span');
  sender.className = 'msg-sender';
  sender.textContent = who === 'alfred' ? 'ALFRED' : 'OPERATOR';

  const body = document.createElement('span');
  body.className = 'msg-text';
  body.textContent = text;

  wrap.appendChild(sender);
  wrap.appendChild(body);
  chatLog.appendChild(wrap);
  chatLog.scrollTop = chatLog.scrollHeight;
  return wrap;
}

function addTyping() {
  const wrap = document.createElement('div');
  wrap.className = 'msg msg-alfred';
  wrap.id = 'typing-indicator';

  const sender = document.createElement('span');
  sender.className = 'msg-sender';
  sender.textContent = 'ALFRED';

  const dots = document.createElement('span');
  dots.className = 'typing-dots';
  dots.innerHTML = '<span></span><span></span><span></span>';

  wrap.appendChild(sender);
  wrap.appendChild(dots);
  chatLog.appendChild(wrap);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function removeTyping() {
  const el = $('typing-indicator');
  if (el) el.remove();
}

// ── Speak (Text-to-Speech) ────────────────────────────────────
function speak(text) {
  if (!state.synth) return;
  state.synth.cancel();

  const utter    = new SpeechSynthesisUtterance(text);
  utter.rate     = 0.88;
  utter.pitch    = 0.78;   // low, authoritative
  utter.volume   = 0.92;

  // Pick best available voice
  const voices = state.synth.getVoices();
  const preferred = ['Google UK English Male', 'Microsoft David', 'Daniel', 'Alex'];
  for (const name of preferred) {
    const v = voices.find(v => v.name.includes(name));
    if (v) { utter.voice = v; break; }
  }

  utter.onstart = () => {
    state.speaking = true;
    avatarCore.classList.add('talking');
    voiceWave.classList.add('active');
  };
  utter.onend = utter.onerror = () => {
    state.speaking = false;
    avatarCore.classList.remove('talking');
    voiceWave.classList.remove('active');
  };

  state.synth.speak(utter);
}

// ── Command Processor ─────────────────────────────────────────
function processCommand(input) {
  addMsg('user', input);
  addTyping();
  logMission('Command: ' + input.substring(0, 28));

  setTimeout(() => {
    removeTyping();
    const response = buildResponse(input.toLowerCase().trim());
    addMsg('alfred', response);
    speak(response);
  }, 600);
}

function buildResponse(input) {
  const p = state.prices;

  // ── PRICE QUERIES ────────────────────────────────────────────
  if (/price.*(sol|solana)|sol.*price/.test(input)) {
    return p.sol
      ? `SOL — Solana — is currently trading at $${formatPrice(p.sol.usd)}. 24-hour change: ${signedPct(p.sol.usd_24h_change)}. ${trendComment(p.sol.usd_24h_change)}`
      : 'Market feed is updating. Stand by, operator.';
  }
  if (/price.*(jup|jupiter)|jup.*price/.test(input)) {
    return p.jup
      ? `JUP — Jupiter Exchange token — is at $${formatPrice(p.jup.usd)}. 24-hour change: ${signedPct(p.jup.usd_24h_change)}. ${trendComment(p.jup.usd_24h_change)}`
      : 'JUP data is unavailable right now.';
  }
  if (/price.*(btc|bitcoin)|btc.*price/.test(input)) {
    return p.btc
      ? `Bitcoin is trading at $${formatPrice(p.btc.usd)}. 24-hour change: ${signedPct(p.btc.usd_24h_change)}. ${trendComment(p.btc.usd_24h_change)}`
      : 'Bitcoin data is unavailable right now.';
  }
  if (/price.*(eth|ethereum)|eth.*price/.test(input)) {
    return p.eth
      ? `Ethereum sits at $${formatPrice(p.eth.usd)}. 24-hour change: ${signedPct(p.eth.usd_24h_change)}. ${trendComment(p.eth.usd_24h_change)}`
      : 'Ethereum data is unavailable right now.';
  }
  if (/price.*(bnb|binance)|bnb.*price/.test(input)) {
    return p.bnb
      ? `BNB is at $${formatPrice(p.bnb.usd)}. 24-hour change: ${signedPct(p.bnb.usd_24h_change)}. ${trendComment(p.bnb.usd_24h_change)}`
      : 'BNB data is unavailable right now.';
  }

  // ── MARKET SUMMARY ───────────────────────────────────────────
  if (/market|summary|overview|all price/.test(input)) {
    const lines = [];
    const coins = ['sol','btc','eth','jup','bnb'];
    const names = { sol:'SOL', btc:'BTC', eth:'ETH', jup:'JUP', bnb:'BNB' };
    for (const c of coins) {
      if (p[c]) lines.push(`${names[c]}: $${formatPrice(p[c].usd)} (${signedPct(p[c].usd_24h_change)})`);
    }
    if (!lines.length) return 'Market feed is still connecting. One moment.';
    return 'Current market intelligence:\n' + lines.join('\n') + '\nAll data refreshed every 60 seconds.';
  }

  // ── JUPITER DEX ──────────────────────────────────────────────
  if (/what is jupiter|about jupiter/.test(input)) {
    return `Jupiter is the leading DEX aggregator on Solana. It routes trades across all major Solana liquidity pools — Raydium, Orca, Meteora, and more — to find you the best execution price with minimal slippage. The JUP token governs the protocol. Jupiter Command uses Jupiter's API to power DeFi operations.`;
  }
  if (/swap|trade|exchange/.test(input)) {
    return `To execute a swap on Jupiter, visit jup.ag, connect your Solana wallet, select your input and output tokens, review the route, and confirm. Jupiter automatically finds the best price across all Solana liquidity sources. Always check slippage settings before confirming. Never trade more than you can afford to lose.`;
  }
  if (/solana|what is sol/.test(input)) {
    return `Solana is a high-performance Layer 1 blockchain capable of processing over 65,000 transactions per second with sub-second finality and extremely low fees — typically under one cent. It powers a rich DeFi ecosystem including Jupiter, Raydium, Marinade, and many more protocols.`;
  }
  if (/defi|decentralized finance/.test(input)) {
    return `Decentralized Finance — DeFi — refers to financial services built on public blockchains. No banks, no intermediaries. You control your assets. On Solana, DeFi is fast and cheap. Key operations include swapping, lending, liquidity provision, yield farming, and staking.`;
  }
  if (/wallet|phantom|solflare/.test(input)) {
    return `To operate on Solana DeFi, you need a non-custodial wallet. Phantom and Solflare are the most widely used. Install the browser extension, secure your seed phrase — never share it with anyone — and you are ready to connect to Jupiter and other protocols.`;
  }
  if (/pump\.?fun/.test(input)) {
    return `Pump.fun is a Solana launchpad for meme tokens. It uses a bonding curve model: early buyers get lower prices. When a token reaches its market cap target, liquidity migrates to Raydium. High risk, high volatility — always do your research and never invest more than you can lose.`;
  }
  if (/staking|stake/.test(input)) {
    return `Staking SOL secures the Solana network and earns you yield. You can natively stake through your wallet or use liquid staking protocols like Marinade or Jito to receive a staked token — mSOL or jitoSOL — that remains usable in DeFi while still earning staking rewards.`;
  }
  if (/nft/.test(input)) {
    return `Solana NFTs are digital assets minted on-chain. Major marketplaces include Magic Eden and Tensor. Solana's low fees make minting and trading NFTs more accessible than on Ethereum. NFTs can represent art, access passes, gaming assets, and more.`;
  }

  // ── SYSTEM / ALFRED IDENTITY ──────────────────────────────────
  if (/who are you|what are you|your name|alfred/.test(input)) {
    return `I am ALFRED — AI Field Liaison for Real-time DeFi and Engagement. I am the intelligence core of Jupiter Command. I monitor live markets, brief you on DeFi operations, and respond to your every command. Think of me as your personal mission control.`;
  }
  if (/hello|hey|hi|good morning|good evening/.test(input)) {
    return `Operator. Good to have you online. Jupiter Command is at full operational capacity. Markets are being monitored. What is your mission today?`;
  }
  if (/thank|thanks/.test(input)) {
    return `Acknowledged, operator. I am here whenever you need intelligence. Stay sharp out there.`;
  }
  if (/joke|funny/.test(input)) {
    return `A DeFi trader walks into a bar. The bartender asks: "What will it be?" The trader replies: "It depends on the liquidity." ...I will return to market surveillance now.`;
  }
  if (/time|date|clock/.test(input)) {
    return `Current UTC time: ${new Date().toUTCString().slice(5, 25)}. All market data timestamps are in UTC.`;
  }

  // ── HELP ─────────────────────────────────────────────────────
  if (/help|commands|what can you/.test(input)) {
    return `JUPITER COMMAND — AVAILABLE COMMANDS:\n\n` +
      `MARKET INTEL:\n` +
      `  "price sol" / "price btc" / "price eth" / "price jup" / "price bnb"\n` +
      `  "market summary"\n\n` +
      `DEFI BRIEFINGS:\n` +
      `  "what is jupiter"\n` +
      `  "what is solana"\n` +
      `  "how do I swap"\n` +
      `  "what is defi"\n` +
      `  "tell me about staking"\n` +
      `  "tell me about pump.fun"\n` +
      `  "tell me about NFTs"\n\n` +
      `SYSTEM:\n` +
      `  "who are you"\n` +
      `  "time"\n` +
      `  "help"\n\n` +
      `You can type or use the mic button to speak commands.`;
  }

  // ── FALLBACK ──────────────────────────────────────────────────
  const fallbacks = [
    `Command not recognized. Type "help" for a full list of available commands. I am always listening, operator.`,
    `That command is outside my current database. Say "help" to see what I can do for you.`,
    `I did not copy that. Please repeat your command or type "help" for available operations.`,
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

function signedPct(n) {
  if (n === undefined || n === null) return 'N/A';
  return (n >= 0 ? '+' : '') + n.toFixed(2) + '%';
}

function trendComment(n) {
  if (n === undefined) return '';
  if (n > 5)  return 'Strong upward momentum.';
  if (n > 0)  return 'Slight gains over 24 hours.';
  if (n > -5) return 'Minor pullback from yesterday.';
  return 'Significant downward pressure today.';
}

// ── Mission Log ───────────────────────────────────────────────
function logMission(text) {
  const el = document.createElement('div');
  el.className = 'mission-entry new';
  el.textContent = new Date().toLocaleTimeString('en-US', { hour12: false }) + ' ' + text;
  missionLog.insertBefore(el, missionLog.firstChild);
  setTimeout(() => el.classList.remove('new'), 2000);
  // Keep only last 12 entries
  while (missionLog.children.length > 12) missionLog.removeChild(missionLog.lastChild);
}
