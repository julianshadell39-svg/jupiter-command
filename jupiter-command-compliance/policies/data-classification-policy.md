# Data Classification Policy

**Version:** 1.0  
**Effective Date:** 2026-07-04  
**Owner:** Jupiter Command Security Team  
**Review Date:** 2027-07-04

## 1. Classification Levels

| Level | Label | Examples | Handling |
|---|---|---|---|
| 1 | **Public** | Marketing copy, open-source code | No restriction |
| 2 | **Internal** | Internal docs, runbooks, org charts | Internal distribution only |
| 3 | **Confidential** | User PII, wallet addresses, API keys | Encrypted at rest and in transit; need-to-know access |
| 4 | **Restricted** | Private keys, audit credentials, incident data | Strict access controls; logged access; encryption required |

## 2. Handling Requirements

### Confidential & Restricted Data
- Must be encrypted (AES-256 at rest, TLS 1.2+ in transit).
- Access governed by least-privilege principles.
- Storage on approved systems only; no personal devices.
- Deletion must follow the Data Retention Policy.

## 3. Labeling

All documents and data stores must be labeled with the appropriate classification level in their header or metadata.

## 4. Data Retention

| Classification | Retention Period |
|---|---|
| Public | Indefinite |
| Internal | 3 years |
| Confidential | 5 years |
| Restricted | 7 years or as required by law |
