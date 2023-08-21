# SKALE Contracts

## Description

The library simplifies development of dApps that interact with smart contracts in SKALE infrastructure.

## Features

- resolving of addresses of SKALE contracts on different networks
- providing up to date ABI for SKALE contracts (they may change over time due to upgradeable nature of some contracts)
- the library does not depend on any library for interaction with Ethereum (like ethers or web3)
- there are child packages that support:
  - ethers v5
  - ethers v6

## Installation

```bash
yarn add @skalenetwork/skale-contracts
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

### Adapter

The object that performs interaction with Ethereum network.

## Usage

The library provides master object `skaleContracts`.

This object is used to provide desired [network](#network), [project](#project) and [instance](#instance) using it's [alias](#alias) or direct address.

To get [network](#network) an implementation of abstract class [Adapter](#adapter) has to be provided.

When target instance is received it can be queried for information  (address, ABI or Contract object) about a particular contract by it's name.
