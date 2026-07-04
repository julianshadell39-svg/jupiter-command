'use strict';

const express = require('express');
const path = require('path');
const apiRouter = require('./routes/api');
const dnssecAgent = require('./agents/dnssec-agent');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Jupiter Command DNS Agent running on http://localhost:${PORT}`);
  dnssecAgent.start();
});
