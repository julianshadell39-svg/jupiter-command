# Evidence Collection Guide

**Version:** 1.0  
**Effective Date:** 2026-07-04  
**Owner:** Jupiter Command Security Team

## Purpose

This guide describes how to collect, organize, and store evidence artifacts required for the SOC 2 Type II audit and ongoing compliance reviews.

## Evidence Naming Convention

```
YYYY-MM_<criteria-id>_<description>.<ext>
```

Example: `2026-10_CC6.1_rbac-configuration-export.csv`

## Evidence by Control Area

### CC6.1 – Logical Access Controls
- Export of all user accounts and roles from identity provider
- Screenshot of RBAC configuration in each production system
- Access provisioning tickets (sample of 5)

### CC6.2 – Authentication
- MFA enforcement configuration screenshot
- Evidence that no accounts have MFA disabled (export)

### CC6.3 – Access Removal
- Offboarding tickets (sample of 5) with timestamps showing < 24-hour revocation

### CC7.1 – System Monitoring
- SIEM dashboard screenshot
- Sample of alert triggers and responses (last 90 days)

### CC7.2 – Incident Management
- List of incidents from the audit period with severity, response time, and resolution
- Post-mortem documents for all P1/P2 incidents

### CC8.1 – Change Management
- Sample of 10 merged pull requests showing required reviews
- CI/CD pipeline configuration showing required checks

### A1.1 – Availability
- Uptime report for audit period (target ≥ 99.9%)
- Alerting configuration for downtime events

### A1.3 – Recovery
- Most recent DR test report
- Backup success logs (sample 30 days)

## Storage

- Store evidence files in this directory under the relevant audit period subfolder:
  ```
  evidence/
  └── 2026-audit/
      ├── CC6.1/
      ├── CC6.2/
      └── ...
  ```
- All evidence must be retained for **7 years**.
- Do **not** store private keys, passwords, or raw credentials as evidence artifacts.
