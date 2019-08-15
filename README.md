# Raiden-client

Raiden Network API TypeScript client

[![Build Status](https://travis-ci.org/wslyvh/raiden-api-client.svg?branch=develop)](https://travis-ci.org/wslyvh/raiden-api-client)
[![codecov](https://codecov.io/gh/wslyvh/raiden-api-client/branch/develop/graph/badge.svg)](https://codecov.io/gh/wslyvh/raiden-api-client)
[![Sonar Quality Gate](https://img.shields.io/sonar/quality_gate/raiden-api-client?server=https%3A%2F%2Fsonarcloud.io)](https://sonarcloud.io/dashboard?id=raiden-api-client)

# Introduction

Raiden has a Restful API with URL endpoints corresponding to user-facing interaction allowed by a Raiden node. The endpoints accept and return JSON encoded objects. The api url path always contains the api version in order to differentiate queries to different API versions. All queries start with: `/api/<version>/`

[Full documentation](https://raiden-network.readthedocs.io/en/latest/rest_api.html)

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
