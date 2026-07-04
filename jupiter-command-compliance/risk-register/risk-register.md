# Risk Register

**Version:** 1.0  
**Effective Date:** 2026-07-04  
**Owner:** Jupiter Command Security Team  
**Review Cadence:** Quarterly

## Scoring Matrix

**Likelihood:** 1 (Rare) → 5 (Almost Certain)  
**Impact:** 1 (Negligible) → 5 (Critical)  
**Risk Score = Likelihood × Impact**

| Score Range | Rating |
|---|---|
| 1–4 | Low |
| 5–9 | Medium |
| 10–19 | High |
| 20–25 | Critical |

---

## Active Risks

| ID | Risk Title | Category | Likelihood | Impact | Score | Rating | Owner | Treatment | Status | Review Date |
|---|---|---|---|---|---|---|---|---|---|---|
| R-001 | Smart contract exploit in Jupiter integration | Technical | 3 | 5 | 15 | High | Engineering | Regular third-party audits; on-chain monitoring | Open | 2026-10-01 |
| R-002 | Unauthorized access to admin console | Security | 2 | 5 | 10 | High | Security Team | MFA enforced; IP allowlisting; PAM solution | Open | 2026-10-01 |
| R-003 | Third-party API (CoinGecko) outage | Availability | 3 | 3 | 9 | Medium | Engineering | Fallback cache; graceful degradation in UI | Open | 2026-10-01 |
| R-004 | Sensitive data exposure via logging | Data | 2 | 4 | 8 | Medium | Engineering | Log scrubbing; PII masking in log pipeline | Open | 2026-10-01 |
| R-005 | Insider threat / credential sharing | People | 2 | 4 | 8 | Medium | HR / Security | AUP enforcement; DLP; access reviews | Open | 2026-10-01 |
| R-006 | DDoS attack on platform endpoints | Availability | 3 | 3 | 9 | Medium | Engineering | CDN with rate limiting; WAF rules | Open | 2026-10-01 |
| R-007 | Regulatory change affecting DeFi operations | Compliance | 2 | 3 | 6 | Medium | Legal | Monitor regulatory updates; legal retainer | Open | 2026-10-01 |

---

## Closed Risks

| ID | Risk Title | Closure Date | Resolution |
|---|---|---|---|
| — | — | — | — |
