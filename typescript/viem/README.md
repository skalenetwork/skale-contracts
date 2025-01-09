# SKALE Contracts Viem

## Description

The library simplifies development of dApps that interact with smart contracts in SKALE infrastructure using viem.

## Features

- Resolving of addresses of SKALE contracts on different networks
- Providing up to date ABI for SKALE contracts (they may change over time due to upgradeable nature of some contracts)
- Automatic creation of Contract objects using viem
- Full TypeScript support with viem types

## Installation

```bash
yarn add @skalenetwork/skale-contracts-viem
```

## Glossary

Main abstractions used by the library is provided below:

### Network

Represents blockchain where smart contracts are deployed.

It could be Ethereum mainnet, goerli, SKALE chain or similar ethereum compatible chains

### Project

SKALE smart contracts grouped into projects to serve particular purpose.

Examples of projects are [IMA](https://github.com/skalenetwork/IMA/), [skale-manager](https://github.com/skalenetwork/skale-manager) or [etherbase](https://github.com/skalenetwork/etherbase/).

### Instance

An instance is a particular project deployed to a particular network.

For example `IMA` on Ethereum mainnet or `etherbase` on some of SKALE chains.

### Alias

An alias is a textual name of an instance.

## Usage

The library provides master object `skaleContracts`.

This object is used to provide desired [network](#network), [project](#project) and [instance](#instance) using it's [alias](#alias) or direct address.

When target instance is received it can be queried for information (address, ABI or Contract object) about a particular contract by it's name.

### Example

```typescript
import { skaleContracts } from "@skalenetwork/skale-contracts-viem";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const network = await skaleContracts.getNetworkByProvider(client);
const project = network.getProject("skale-manager");
const instance = await project.getInstance("production");
const nodes = await instance.getContract("Nodes");
const numberOfActiveNodes = await nodes.read.numberOfActiveNodes();
```
