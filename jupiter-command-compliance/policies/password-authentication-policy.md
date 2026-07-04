# Password and Authentication Policy

**Version:** 1.0  
**Effective Date:** 2026-07-04  
**Owner:** Jupiter Command Security Team  
**Review Date:** 2027-07-04

## 1. Password Requirements

- Minimum length: **16 characters**
- Must include: uppercase, lowercase, digit, and special character
- Must not reuse the last **12** passwords
- Maximum password age: **90 days** for privileged accounts; **180 days** for standard accounts

## 2. Multi-Factor Authentication (MFA)

- MFA is **mandatory** for all production system access.
- MFA is **mandatory** for all remote access (VPN, SSH).
- Approved factors: TOTP authenticator app, hardware security key (FIDO2).
- SMS-based OTP is **not** an approved factor.

## 3. Privileged Accounts

- Privileged (admin) accounts must use hardware security keys.
- Privileged sessions must be recorded and stored for 90 days.
- Break-glass accounts must be stored in a secure vault with dual-approval access.

## 4. Password Storage

- Passwords must **never** be stored in plaintext.
- Approved hashing algorithms: bcrypt (cost ≥ 12), Argon2id.
- Application secrets must be stored in a secrets manager (e.g., HashiCorp Vault, AWS Secrets Manager).

## 5. Violations

Sharing passwords or bypassing MFA constitutes an AUP violation and will be treated as a security incident.
