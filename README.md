# SKALE Contracts

<div align="center">

[![License](https://img.shields.io/github/license/skalenetwork/skale-contracts.svg)](LICENSE)
[![Discord](https://img.shields.io/discord/534485763354787851.svg)](https://discord.gg/skale)
[![Build Status](https://github.com/skalenetwork/skale-contracts/actions/workflows/test.yml/badge.svg)](https://github.com/skalenetwork/skale-contracts/actions)

<p>Unified artifacts manager for all smart contracts in the SKALE ecosystem.</p>

</div>


## Introduction

SKALE Contracts is a multi-language library that simplifies development of dApps interacting with smart contracts in the SKALE infrastructure. It provides a unified interface for resolving contract addresses, fetching ABIs, and creating contract objects across different networks.

**Core Capabilities:**

- **Contract Address Resolution:** Automatically resolve addresses of SKALE contracts on different networks (Ethereum mainnet, SKALE chains, testnets)
- **Dynamic ABI Management:** Provide up-to-date ABIs for SKALE contracts that may change over time due to their upgradeable nature
- **Multi-Library Support:** TypeScript packages for ethers.js v5, ethers.js v6, and viem.
- **Python Support:** Full Python implementation using web3.py
- **Flexible Adapter Pattern:** Library-agnostic base package with adapters for popular Ethereum libraries


## Local Installation & Setup

### Prerequisites

For both developers and consumers of this package. Note that these requirements may change for older versions of skale-contracts.

- Node.js >= 20.0.0 (for TypeScript packages)
- Python >= 3.11 (for Python package)

### Clone and Install

```bash
git clone --recurse-submodules https://github.com/skalenetwork/skale-contracts.git
cd skale-contracts
yarn install
```

### Running Checks

```bash
# Full check (spelling, TypeScript, Python)
yarn fullCheck

# TypeScript only
yarn typescript-check

# Python only
yarn python-check
```

## For dApp Developers

After installing the package that suits your requirements, refer to these for simple package-specific examples:

 * [ethers-v5](./typescript/ethers-v5/README.md)
 * [ethers-v6](./typescript/ethers-v6/README.md)
 * [viem](./typescript/viem/README.md)
 * [python](./python/README.md)

### TypeScript Packages

Choose the package that best matches your requirements:

```bash
# For ethers.js v6
yarn add @skalenetwork/skale-contracts-ethers-v6

# For ethers.js v5
yarn add @skalenetwork/skale-contracts-ethers-v5

# For viem
yarn add @skalenetwork/skale-contracts-viem

# Base package (library-agnostic, requires custom adapter)
yarn add @skalenetwork/skale-contracts
```

### Python Package

```bash
pip install skale-contracts
```


## Glossary

| Term | Description |
|------|-------------|
| **Network** | Represents a blockchain where smart contracts are deployed (Ethereum mainnet, SKALE chains, testnets) |
| **Project** | A group of SKALE smart contracts serving a particular purpose (e.g., IMA, skale-manager, etherbase) |
| **Instance** | A particular project deployed in a particular network |
| **Alias** | A textual name identifying an instance (e.g., "production") |
| **Adapter** | An object that performs interaction with the Ethereum network |


## Supported Projects

Bellow is a list of the main projects supported by skale-contracts in all libraries:

- [skale-manager](https://github.com/skalenetwork/skale-manager) - Core SKALE Network management contracts
- [IMA](https://github.com/skalenetwork/IMA/) - Bridge contracts for cross-chain communication
- [skale-allocator](https://github.com/skalenetwork/skale-allocator) - Token allocation and vesting
- [paymaster](https://github.com/skalenetwork/paymaster) - Gas payment management
- [fair-manager](https://github.com/skalenetwork/fair-manager) - Fair distribution management
- [credit-station](https://github.com/skalenetwork/credit-station) - Credit management system

Currently, only the Python implementation supports the following:
- [config-controller](https://github.com/skalenetwork/config-controller) - SKALE chain configuration management
- [etherbase](https://github.com/skalenetwork/etherbase) - sFUEL distribution on SKALE chains
- [marionette](https://github.com/skalenetwork/marionette) - SKALE chain remote access control
- [filestorage](https://github.com/skalenetwork/filestorage) - Decentralized file storage on SKALE chains

**NOTE:** If you face issues with integration, or require support for a specific support for a project or library, reach out to the team in [Discord](https://discord.gg/skale).

## Repository Structure

```
skale-contracts/
├── python/                    # Python package (skale-contracts)
│   ├── src/skale_contracts/   # Source code
│   └── tests/                 # Python tests
└── typescript/
    ├── base/                  # Base package (@skalenetwork/skale-contracts)
    ├── ethers-v5/             # Ethers v5 adapter (@skalenetwork/skale-contracts-ethers-v5)
    ├── ethers-v6/             # Ethers v6 adapter (@skalenetwork/skale-contracts-ethers-v6)
    └── viem/                  # Viem adapter (@skalenetwork/skale-contracts-viem)
```


## Main Branches

- **develop** – Latest features and ongoing work. This is where contributions should be opened.
- **stable** – Latest stable release.

## Resources

- **SKALE Developer Documentation** – https://docs.skale.space/
- **SKALE Main Website** – https://www.skale.space/
- **SKALE Ecosystem Portal** – https://portal.skale.space/


## License

[![License](https://img.shields.io/github/license/skalenetwork/skale-contracts.svg)](LICENSE)

This project is licensed under the GNU Affero General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

Copyright (C) 2022-present SKALE Labs
