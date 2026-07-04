# SOC 2 Trust Service Criteria – Control Mapping

**Version:** 1.0  
**Effective Date:** 2026-07-04  
**Audit Period:** 2026-01-01 to 2026-12-31  
**Owner:** Jupiter Command Security Team

## Common Criteria (CC)

| Criteria ID | Criteria Title | Control Owner | Control Description | Status |
|---|---|---|---|---|
| CC1.1 | COSO Principle 1 – Integrity & Ethical Values | CEO | Code of Conduct policy published and acknowledged by all staff | In Place |
| CC1.2 | Board oversight | Legal/Compliance | Quarterly board security briefings | In Place |
| CC2.1 | Communication of objectives | CISO | Security objectives documented and communicated to all staff | In Place |
| CC3.1 | Risk identification | Security Team | Quarterly risk register review | In Place |
| CC3.2 | Risk assessment | Security Team | Annual threat model and risk scoring | In Place |
| CC6.1 | Logical access controls | Engineering | Role-based access control (RBAC) enforced across all systems | In Place |
| CC6.2 | Authentication | Engineering | MFA mandatory for all production access | In Place |
| CC6.3 | Access removal | HR / Engineering | Offboarding checklist removes access within 24 hours | In Place |
| CC7.1 | System monitoring | Security Team | Centralized SIEM with alerting on anomalies | In Place |
| CC7.2 | Incident management | Security Team | Incident response plan tested annually | In Place |
| CC8.1 | Change management | Engineering | All changes reviewed via pull request; deployment pipeline enforced | In Place |
| CC9.1 | Risk mitigation | Security Team | Vendor risk assessments for all third-party integrations | In Place |

## Availability Criteria (A)

| Criteria ID | Criteria Title | Control Description | Status |
|---|---|---|---|
| A1.1 | Availability commitments | SLA documented; uptime target ≥ 99.9% | In Place |
| A1.2 | Environmental protections | Cloud-hosted on redundant availability zones | In Place |
| A1.3 | Recovery procedures | Backup and DR runbook tested quarterly | In Place |

## Confidentiality Criteria (C)

| Criteria ID | Criteria Title | Control Description | Status |
|---|---|---|---|
| C1.1 | Confidential information identification | Data Classification Policy enforced | In Place |
| C1.2 | Confidential information disposal | Secure deletion procedures documented | In Place |
