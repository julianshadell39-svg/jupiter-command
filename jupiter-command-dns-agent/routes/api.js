'use strict';

const express = require('express');
const dns = require('dns');
const { promisify } = require('util');
const dnssecAgent = require('../agents/dnssec-agent');

const router = express.Router();
const resolve4 = promisify(dns.resolve4);

// GET /api/status – DNSSEC status for all configured domains
router.get('/status', (_req, res) => {
  const all = dnssecAgent.getAll();
  res.json({ domains: Object.values(all) });
});

// GET /api/status/:domain – DNSSEC status for one domain
router.get('/status/:domain', (req, res) => {
  const entry = dnssecAgent.getOne(req.params.domain);
  if (!entry) {
    return res.status(404).json({ error: 'Domain not found in config or not yet polled.' });
  }
  res.json(entry);
});

// GET /api/lookup/:domain – live A-record lookup
router.get('/lookup/:domain', async (req, res) => {
  try {
    const records = await resolve4(req.params.domain);
    res.json({ domain: req.params.domain, records });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

module.exports = router;
