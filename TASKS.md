# Jupiter Command — Project Task Roadmap

> **Mission:** Empower individuals through DeFi education and cooperative financial tools.  
> **Home:** [howtogiveback.org](https://howtogiveback.org) · **Support:** [support@howtogiveback.org](mailto:support@howtogiveback.org)

---

## Legend
- ⬜ To Do &nbsp;·&nbsp; 🔄 In Progress &nbsp;·&nbsp; ✅ Done

---

## 1 · Foundation & TypeScript (Tasks 1–10)

| # | Task | Status |
|---|------|--------|
| 1 | Convert `script.js` to `src/script.ts` with full strict typing | ✅ |
| 2 | Add `tsconfig.json` targeting ES2020 / DOM | ✅ |
| 3 | Add `build` and `typecheck` npm scripts | ✅ |
| 4 | Add Web Speech API ambient declaration file (`src/speech.d.ts`) | ✅ |
| 5 | Add `package.json`, `server.js`, and `.gitignore` | ✅ |
| 6 | Split compiled output into `dist/` and ignore in git | ✅ |
| 7 | Add ESLint with `@typescript-eslint` for static analysis | ⬜ |
| 8 | Add Prettier for consistent code formatting | ⬜ |
| 9 | Add `lint` and `format` npm scripts | ⬜ |
| 10 | Set up GitHub Actions CI workflow (typecheck + lint on push) | ⬜ |

---

## 2 · ALFRED AI Communicator (Tasks 11–25)

| # | Task | Status |
|---|------|--------|
| 11 | Add HOWTOGIVEBACK.ORG response pattern to ALFRED | ✅ |
| 12 | Expand ALFRED knowledge base to 30+ DeFi topics | ⬜ |
| 13 | Add conversation history persistence via `localStorage` | ⬜ |
| 14 | Add ALFRED "typing…" indicator with animated dots | ⬜ |
| 15 | Support multi-turn conversation context (last 5 exchanges) | ⬜ |
| 16 | Integrate OpenAI / Anthropic API as fallback for unknown queries | ⬜ |
| 17 | Add text-to-speech (TTS) output using Web Speech API `SpeechSynthesis` | ⬜ |
| 18 | Add language selector (EN / ES / PT) for ALFRED responses | ⬜ |
| 19 | Add "clear conversation" button to ALFRED HUD | ⬜ |
| 20 | Add keyboard shortcut (`Ctrl+/`) to focus ALFRED input | ⬜ |
| 21 | Display timestamp on each ALFRED message | ⬜ |
| 22 | Add copy-to-clipboard button on ALFRED responses | ⬜ |
| 23 | Add DeFi glossary: 50 terms ALFRED can define | ⬜ |
| 24 | Add "Ask about [token]" quick-action chips below price cards | ⬜ |
| 25 | Create ALFRED unit tests covering all response patterns | ⬜ |

---

## 3 · Live Market Data (Tasks 26–35)

| # | Task | Status |
|---|------|--------|
| 26 | Add sparkline mini-chart to each price card (last 7 days) | ⬜ |
| 27 | Add market cap and 24h volume to price cards (expandable) | ⬜ |
| 28 | Add pump.fun trending tokens section | ⬜ |
| 29 | Add Solana ecosystem token watchlist (user-selectable) | ⬜ |
| 30 | Add price alert: notify when token crosses user-set threshold | ⬜ |
| 31 | Cache last known prices in `localStorage` for offline display | ⬜ |
| 32 | Show "last updated" relative timestamp on price section | ⬜ |
| 33 | Add manual refresh button to price section | ⬜ |
| 34 | Display loading skeleton while prices are fetching | ⬜ |
| 35 | Add error toast when CoinGecko API is unreachable | ⬜ |

---

## 4 · Jupiter & Solana DeFi Integration (Tasks 36–55)

| # | Task | Status |
|---|------|--------|
| 36 | Embed Jupiter Terminal swap widget in a modal | ⬜ |
| 37 | Add "Swap on Jupiter" deep-link buttons next to price cards | ⬜ |
| 38 | Integrate Jupiter Price API v2 as an alternative price source | ⬜ |
| 39 | Show best swap route preview (input → output with fees) | ⬜ |
| 40 | Add slippage tolerance selector (0.1%, 0.5%, 1%) | ⬜ |
| 41 | Integrate Solana wallet adapter (Phantom, Solflare, Backpack) | ⬜ |
| 42 | Show connected wallet address (abbreviated) in header | ⬜ |
| 43 | Fetch and display connected wallet SOL balance | ⬜ |
| 44 | Fetch SPL token balances for connected wallet | ⬜ |
| 45 | Add one-click disconnect wallet button | ⬜ |
| 46 | Sign and send swap transactions through ALFRED voice commands | ⬜ |
| 47 | Add transaction confirmation modal with fee breakdown | ⬜ |
| 48 | Display recent transaction history for connected wallet | ⬜ |
| 49 | Add pump.fun new token feed with contract address lookup | ⬜ |
| 50 | Add Birdeye or DEXScreener chart embed for any token | ⬜ |
| 51 | Show Jupiter DAO / JUP governance proposals in a panel | ⬜ |
| 52 | Integrate Jupiter DCA (Dollar-Cost Averaging) order creation | ⬜ |
| 53 | Add limit-order interface using Jupiter Limit Order API | ⬜ |
| 54 | Add perpetuals overview via Jupiter Perps API | ⬜ |
| 55 | Support multi-chain: add Ethereum and Base wallet connections | ⬜ |

---

## 5 · Portfolio Analytics (Tasks 56–65)

| # | Task | Status |
|---|------|--------|
| 56 | Build portfolio dashboard: show all token holdings with USD values | ⬜ |
| 57 | Calculate and display total portfolio value over time | ⬜ |
| 58 | Show unrealised P&L per token (with cost-basis entry) | ⬜ |
| 59 | Add portfolio allocation pie chart | ⬜ |
| 60 | Export portfolio snapshot as CSV | ⬜ |
| 61 | Add 30-day cumulative return chart | ⬜ |
| 62 | Flag tokens with >30% 24h price move | ⬜ |
| 63 | Add manual asset entry for off-chain holdings | ⬜ |
| 64 | Support multiple wallets in portfolio view | ⬜ |
| 65 | Generate shareable portfolio report URL | ⬜ |

---

## 6 · HOWTOGIVEBACK.ORG Integration (Tasks 66–75)

| # | Task | Status |
|---|------|--------|
| 66 | Add "Give Back" section linking to howtogiveback.org mission | ⬜ |
| 67 | Display current Phase 1 cooperation goals from README | ⬜ |
| 68 | Add weekly KPI tracker (meetings, referrals, joint income) | ⬜ |
| 69 | Add end-of-month partnership review prompt via ALFRED | ⬜ |
| 70 | Display accountability partner progress widget | ⬜ |
| 71 | Add "Refer a Commander" referral link generator | ⬜ |
| 72 | Track and display group buying opportunities | ⬜ |
| 73 | Add joint freelancing project board (Kanban-lite) | ⬜ |
| 74 | Show shared growth plan: income goals, responsibilities, timelines | ⬜ |
| 75 | Embed howtogiveback.org blog feed (latest 3 articles) | ⬜ |

---

## 7 · UX, Accessibility & PWA (Tasks 76–85)

| # | Task | Status |
|---|------|--------|
| 76 | Add dark/light theme toggle and persist preference | ⬜ |
| 77 | Make the site a Progressive Web App (PWA) with a service worker | ⬜ |
| 78 | Add `manifest.json` for installable app support | ⬜ |
| 79 | Ensure WCAG 2.1 AA compliance (full keyboard nav + ARIA) | ⬜ |
| 80 | Add responsive mobile layout breakpoints | ⬜ |
| 81 | Add page transition animations (CSS) | ⬜ |
| 82 | Add onboarding tooltip tour for first-time visitors | ⬜ |
| 83 | Add notification permission prompt for price alerts | ⬜ |
| 84 | Add `<meta>` Open Graph + Twitter Card tags for social sharing | ⬜ |
| 85 | Add cookie/privacy consent banner (GDPR-lite) | ⬜ |

---

## 8 · Infrastructure & DevOps (Tasks 86–93)

| # | Task | Status |
|---|------|--------|
| 86 | Deploy to Vercel / Netlify with automatic preview deployments | ⬜ |
| 87 | Set up custom domain `app.howtogiveback.org` | ⬜ |
| 88 | Add HTTPS enforcement via server redirect | ⬜ |
| 89 | Add security headers (CSP, HSTS, X-Frame-Options) in `server.js` | ⬜ |
| 90 | Add `robots.txt` and `sitemap.xml` | ⬜ |
| 91 | Set up Sentry or Datadog for frontend error tracking | ⬜ |
| 92 | Add uptime monitoring (Better Uptime / UptimeRobot) | ⬜ |
| 93 | Add Dependabot for automatic dependency updates | ⬜ |

---

## 9 · Testing (Tasks 94–100)

| # | Task | Status |
|---|------|--------|
| 94 | Add Vitest for unit testing TypeScript modules | ⬜ |
| 95 | Write unit tests for `alfredReply()` covering all patterns | ⬜ |
| 96 | Write unit tests for `formatPrice()` edge cases | ⬜ |
| 97 | Write unit tests for `updatePriceCards()` with mock data | ⬜ |
| 98 | Add Playwright end-to-end test: load page, verify price cards render | ⬜ |
| 99 | Add Playwright e2e test: type ALFRED command and verify response | ⬜ |
| 100 | Add test coverage reporting to CI pipeline | ⬜ |

---

## Progress Summary

| Category | Done | Total |
|----------|------|-------|
| Foundation & TypeScript | 6 | 10 |
| ALFRED AI Communicator | 1 | 15 |
| Live Market Data | 0 | 10 |
| Jupiter & DeFi Integration | 0 | 20 |
| Portfolio Analytics | 0 | 10 |
| HOWTOGIVEBACK.ORG Integration | 0 | 10 |
| UX, Accessibility & PWA | 0 | 10 |
| Infrastructure & DevOps | 0 | 8 |
| Testing | 0 | 7 |
| **Total** | **7** | **100** |

---

*Updated automatically. Tracked in the [Jupiter Command](https://github.com/julianshadell39-svg/jupiter-command) repository.*  
*Mission powered by [howtogiveback.org](https://howtogiveback.org)*
