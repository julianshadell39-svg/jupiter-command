'use strict';

const path = require('path');
const express = require('express');

const app = express();
const port = Number(process.env.PORT || 3000);
const commandNumber = process.env.COMMAND_NUMBER || '+1 441 000 0798';
const commandContactEmails = [
  'julianshade333@gmail.com',
  'julianshadell39@gmail.com',
];

const RESPONSES = [
  { pattern: /\b(hello|hi|hey|good\s+\w+)\b/i, reply: 'Greetings, Commander. Command server is online and awaiting your instruction.' },
  { pattern: /\bstatus\b|\bhealth\b/i, reply: 'All systems operational. API command channel is active.' },
  { pattern: /\bnumber\b|\bphone\b|\bcontact\b/i, reply: `Primary command number is ${commandNumber}.` },
  { pattern: /\bemail\b|\bmail\b/i, reply: `Primary contacts: ${commandContactEmails.join(' and ')}.` },
  { pattern: /\bsolana\b|\bsol\b/i, reply: "Solana is active in your command center. You can use this channel for quick protocol support prompts." },
  { pattern: /\bjupiter\b|\bjup\b/i, reply: 'Jupiter protocol support is online. Ask for swap, market, or token guidance.' },
  { pattern: /\bprice\b|\bmarket\b|\bcost\b/i, reply: 'Live prices are available in the dashboard and refresh automatically.' },
  { pattern: /\bhelp\b|\bcommand\b|\bwhat\s+can\b/i, reply: 'Use this server for status checks, market prompts, and operational command routing.' },
];

const DEFAULT_REPLY = 'Command received. Please provide a specific instruction so I can route it correctly.';

function getCommandReply(input) {
  const text = String(input || '').trim();
  if (!text) return DEFAULT_REPLY;
  for (const { pattern, reply } of RESPONSES) {
    if (pattern.test(text)) return reply;
  }
  return DEFAULT_REPLY;
}

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'jupiter-command-server',
    commandNumber,
    commandContactEmails,
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/command', (req, res) => {
  const text = typeof req.body?.text === 'string' ? req.body.text : '';
  if (!text.trim()) {
    return res.status(400).json({
      ok: false,
      error: 'Command text is required.',
    });
  }

  res.json({
    ok: true,
    reply: getCommandReply(text),
  });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`[Jupiter Command] server running on port ${port}`);
});
