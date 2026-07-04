# Access Control Policy

**Version:** 1.0  
**Effective Date:** 2026-07-04  
**Owner:** Jupiter Command Security Team  
**Review Date:** 2027-07-04

## 1. Purpose

Define requirements for granting, reviewing, and revoking access to Jupiter Command systems and data.

## 2. Principles

- **Least Privilege:** Users receive only the access required for their role.
- **Need-to-Know:** Access to Confidential/Restricted data requires documented business justification.
- **Separation of Duties:** No single user has end-to-end control of critical processes.
- **Zero Standing Privilege:** Privileged access is granted just-in-time and expires automatically.

## 3. Access Request Process

1. User submits access request via ticketing system, specifying system, role, and business justification.
2. Manager approves the request.
3. Security Team validates against least-privilege principle.
4. Engineering provisions access and closes the ticket.

## 4. Role Definitions

| Role | Systems | Access Level |
|---|---|---|
| Developer | Source control, staging environment | Read/Write |
| Senior Engineer | Source control, staging, production read | Read/Write + Prod Read |
| DevOps / SRE | All environments + infrastructure | Full (privileged, JIT) |
| Security Team | SIEM, logs, compliance tools | Full |
| Support | Support tooling, user data (masked) | Read |
| External Contractor | Project-specific systems only | Scoped, time-limited |

## 5. Privileged Access

- Admin and root access granted only via a PAM (Privileged Access Management) solution.
- Sessions are recorded and stored for 90 days.
- Access reviewed monthly; unused privileged access revoked automatically after 30 days of inactivity.

## 6. Offboarding

- All access must be revoked within **24 hours** of employment termination.
- HR triggers the offboarding checklist; Engineering confirms revocation.
- Quarterly user access reviews validate no orphaned accounts exist.

## 7. User Access Review

- Conducted **quarterly** by Security Team and system owners.
- Results documented in `access-reviews/` (this directory).
- Orphaned or excessive access revoked within 5 business days of review.
