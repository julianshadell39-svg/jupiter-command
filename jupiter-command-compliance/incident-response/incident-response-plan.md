# Incident Response Plan

**Version:** 1.0  
**Effective Date:** 2026-07-04  
**Owner:** Jupiter Command Security Team  
**Review Cadence:** Annually; tested via tabletop exercise

## 1. Purpose

This plan defines the process for identifying, containing, eradicating, and recovering from security incidents affecting the Jupiter Command platform.

## 2. Roles & Responsibilities

| Role | Responsibility |
|---|---|
| Incident Commander (IC) | Coordinates overall response; makes escalation decisions |
| Security Lead | Technical investigation and containment |
| Engineering On-Call | System changes, reverts, patches |
| Communications Lead | Internal and external communications |
| Legal / Compliance | Regulatory notification; evidence preservation |

## 3. Incident Severity Levels

| Level | Name | Description | Response SLA |
|---|---|---|---|
| P1 | Critical | Active breach; data exfiltration; service down | Immediate (< 15 min) |
| P2 | High | Suspected compromise; partial service degradation | < 1 hour |
| P3 | Medium | Policy violation; failed attack attempt | < 4 hours |
| P4 | Low | Anomalous activity; informational | < 24 hours |

## 4. Response Phases

### 4.1 Detection & Reporting
- Incidents may be reported via: SIEM alerts, employee reports, external notifications.
- Report to security@howtogiveback.org or open a P1/P2 page via on-call rotation.

### 4.2 Triage & Classification
- IC assigns severity level within 15 minutes of report.
- Incident ticket created in tracking system.

### 4.3 Containment
- Short-term containment: isolate affected systems, rotate compromised credentials.
- Evidence preservation: snapshot affected systems before remediation.

### 4.4 Eradication
- Identify and remove root cause (malware, misconfiguration, unauthorized access).
- Patch or remediate affected systems.

### 4.5 Recovery
- Restore systems from clean backups if necessary.
- Monitor for re-compromise for 72 hours post-recovery.

### 4.6 Post-Incident Review
- Post-mortem required for all P1/P2 incidents within 5 business days.
- Post-mortem template: `post-mortem-template.md`
- Findings fed back into risk register and control improvements.

## 5. Regulatory Notification

- GDPR: notify supervisory authority within 72 hours of confirmed breach.
- Notify affected users within 72 hours if personal data is compromised.

## 6. Contact List

| Name | Role | Contact |
|---|---|---|
| Security Team | Primary | support@howtogiveback.org |
| Legal | Regulatory | TBD |
| External IR Firm | Retainer | TBD |
