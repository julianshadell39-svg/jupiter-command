# Jupiter Command DNS Agent

A Node.js service that monitors and validates DNSSEC for domains associated with the Jupiter Command DeFi platform.

## Features

- Real-time DNSSEC validation for configured domains
- REST API for DNS lookup and status queries
- Web dashboard to view domain health at a glance
- Polling agent that refreshes domain status on a configurable interval

## Requirements

- Node.js ≥ 18
- npm ≥ 9

## Installation

```bash
cd jupiter-command-dns-agent
npm install
```

## Configuration

Edit `config/domains.json` to add or remove domains the agent should monitor.

## Usage

```bash
node server.js
```

The dashboard is served at `http://localhost:3001` and the API is available at `http://localhost:3001/api`.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/status` | DNSSEC status for all configured domains |
| GET | `/api/status/:domain` | DNSSEC status for a single domain |
| GET | `/api/lookup/:domain` | Raw DNS A-record lookup |

## License

MIT
