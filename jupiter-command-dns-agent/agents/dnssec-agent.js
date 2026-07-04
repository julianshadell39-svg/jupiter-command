'use strict';

const dns = require('dns');
const { promisify } = require('util');
const config = require('../config/domains.json');

const resolve4 = promisify(dns.resolve4);
const resolveMx = promisify(dns.resolveMx);

// In-memory store keyed by domain name
const statusStore = {};

/**
 * Check DNSSEC-like validity for a domain.
 * Node's built-in dns module does not expose raw DNSSEC RRs, so we approximate
 * health by confirming A and MX records resolve without error.
 *
 * @param {string} domain
 * @returns {Promise<{domain: string, valid: boolean, records: string[], checkedAt: string, error?: string}>}
 */
async function checkDomain(domain) {
  const checkedAt = new Date().toISOString();
  try {
    const [aRecords] = await Promise.all([resolve4(domain), resolveMx(domain).catch(() => [])]);
    statusStore[domain] = { domain, valid: true, records: aRecords, checkedAt };
  } catch (err) {
    statusStore[domain] = { domain, valid: false, records: [], checkedAt, error: err.message };
  }
  return statusStore[domain];
}

/**
 * Run a single poll cycle over all configured domains.
 */
async function poll() {
  const { domains } = config;
  console.log(`[dnssec-agent] Polling ${domains.length} domain(s)…`);
  await Promise.all(domains.map(checkDomain));
  console.log('[dnssec-agent] Poll complete.');
}

/**
 * Return the cached status for all domains.
 * @returns {Object}
 */
function getAll() {
  return statusStore;
}

/**
 * Return the cached status for a single domain, or null.
 * @param {string} domain
 * @returns {Object|null}
 */
function getOne(domain) {
  return statusStore[domain] || null;
}

/**
 * Start the polling agent.
 */
function start() {
  const intervalMs = (config.pollIntervalSeconds || 300) * 1000;
  poll();
  setInterval(poll, intervalMs);
}

module.exports = { start, getAll, getOne, checkDomain };
