# Raiden-client

[![Build Status](https://travis-ci.org/wslyvh/raiden-api-client.svg?branch=develop)](https://travis-ci.org/wslyvh/raiden-api-client)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=raiden-api-client&metric=alert_status)](https://sonarcloud.io/dashboard?id=raiden-api-client)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=raiden-api-client&metric=coverage)](https://sonarcloud.io/dashboard?id=raiden-api-client)
[![NPM](https://img.shields.io/npm/v/raiden-api-client.svg)](https://www.npmjs.com/package/raiden-api-client)
[![NPM](https://img.shields.io/npm/l/raiden-api-client.svg)](https://www.npmjs.com/package/raiden-api-client)
[![NPM](https://img.shields.io/npm/dt/raiden-api-client.svg)](https://www.npmjs.com/package/raiden-api-client)

# Introduction

A lightweight Raiden Network API TypeScript client to interact with a Raiden Network node.

- [Official Website](https://raiden.network)
- [Official Developer Portal](https://developer.raiden.network/)
- [Official Raiden Network API documentation](https://raiden-network.readthedocs.io/en/latest/rest_api.html)

# Install

`npm i raiden-api-client --save`

# Usage

```typescript
import RaidenClient from "raiden-api-client";

async function printChannels() {
  const client = new RaidenClient("http://localhost:5001/api");
  const channels = await client.getChannels();
  console.log(channels);
}
```

# Documentation

- [Raiden Client API documentation](https://wslyvh.github.io/raiden-api-client/)

# Contributing

See [CONTRIBUTING](./.github/CONTRIBUTING.MD).

# License

This project is released under the MIT License. See [LICENSE](LICENSE).
