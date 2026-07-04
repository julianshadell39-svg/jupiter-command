# Security Monitoring Runbook

**Version:** 1.0  
**Effective Date:** 2026-07-04  
**Owner:** Jupiter Command Security Team  
**Review Cadence:** Quarterly

## 1. Overview

This runbook describes the security monitoring setup for Jupiter Command, including alert definitions, triage procedures, and escalation paths.

## 2. Monitoring Stack

| Tool | Purpose |
|---|---|
| SIEM (TBD) | Centralized log aggregation, correlation, and alerting |
| Uptime Monitor | Service availability and latency tracking |
| DNS Agent | DNSSEC and DNS health monitoring (`jupiter-command-dns-agent/`) |
| WAF | Web Application Firewall – DDoS, injection, bot protection |
| Secrets Scanner | Pre-commit and CI secrets detection |

## 3. Alert Definitions

| Alert ID | Alert Name | Source | Threshold | Severity | Response Playbook |
|---|---|---|---|---|---|
| ALT-001 | Failed login spike | SIEM | > 10 failures / 5 min / account | P2 | See §4.1 |
| ALT-002 | Privileged session from new IP | PAM | Any | P2 | See §4.2 |
| ALT-003 | DNSSEC validation failure | DNS Agent | Any domain | P2 | See §4.3 |
| ALT-004 | Service uptime breach | Uptime Monitor | < 99.9% in 1 hour | P1 | See §4.4 |
| ALT-005 | Anomalous data export | SIEM | > 500 MB egress in 1 min | P1 | See §4.1 |
| ALT-006 | Secrets detected in CI | Secrets Scanner | Any match | P2 | See §4.5 |
| ALT-007 | WAF block spike | WAF | > 1000 blocks / 5 min | P3 | See §4.6 |

## 4. Response Playbooks

### 4.1 – Unauthorized Access / Data Exfiltration
1. Identify source IP and affected accounts.
2. Suspend affected accounts immediately.
3. Rotate all credentials associated with the account.
4. Escalate to Incident Commander; open P1/P2 incident ticket.
5. Preserve logs; notify Legal if data exfiltration confirmed.

### 4.2 – Privileged Session from New Location
1. Contact the user via out-of-band channel to verify legitimacy.
2. If not verified: terminate session; suspend account; escalate.
3. Review session recording in PAM tool.

### 4.3 – DNSSEC Validation Failure
1. Review DNS Agent dashboard (`/api/status`).
2. Run manual lookup: `dig +dnssec <domain>`.
3. Contact domain registrar if DNSSEC chain is broken externally.
4. If internal DNS misconfiguration: escalate to Engineering on-call.

### 4.4 – Service Uptime Breach
1. Check status page and uptime monitor for affected endpoints.
2. Page Engineering on-call immediately.
3. Initiate DR runbook if recovery time > 30 minutes.
4. Post status update to users if outage > 15 minutes.

### 4.5 – Secrets Detected in CI
1. Immediately remove the secret from the codebase.
2. Rotate the exposed credential.
3. Review git history; force-push or BFG-clean if secret was merged to default branch.
4. Open P2 incident ticket; assess blast radius.

### 4.6 – WAF Block Spike
1. Identify originating IPs and request patterns.
2. Verify WAF rules are not causing false positives.
3. If DDoS: escalate to CDN provider and Engineering on-call.
4. Document in audit log.

## 5. Escalation Path

```
On-call Engineer
      ↓ (if unresolved in 15 min)
Security Lead / Incident Commander
      ↓ (P1 only)
CEO + Legal
```

## 6. Review & Testing

- Alert rules reviewed quarterly.
- Monitoring coverage gap analysis performed annually.
- Tabletop exercise for at least two alert scenarios per year.
