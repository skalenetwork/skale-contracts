<!-- cspell:ignore pytest -->

# SKALE Contracts Python

## Description

The library simplifies development of dApps that interact with smart contracts in SKALE infrastructure using python.

## Features

- Resolving of addresses of SKALE contracts on different networks
- Providing up to date ABI for SKALE contracts (they may change over time due to upgradeable nature of some contracts)
- Automatic creation of Contract objects using web3
- Supports web3 library versions >= 7, < 8

## Importing the library

```bash
pip install skale-contracts
```

## Setup repo locally

1. Clone the repo
```bash
git clone --recurse-submodules https://github.com/skalenetwork/skale-contracts.git && cd skale-contracts
```

2. Install dependencies
```bash
cd python && pip install -e . && pip3 install -r scripts/requirements.txt && pip3 install -r tests/requirements.txt
```

### Running tests (python)

1. set ENDPOINT environment variable using either option:
    ```bash
    export ENDPOINT="http://my.mainnet.endpoint/my-api-key"
    ```
    or
    ```bash
    echo 'ENDPOINT="http://my.mainnet.endpoint/my-api-key"' > .env
    ```

2. run tests
```bash
pytest -v
```
3. run tests with coverage report (optional)
```bash
pytest --cov=./ --cov-report=xml -v
```

The tests require reliable network connection as they will fetch information like:
    - stable versions of skale projects
    - deployed versions of skale projects
    - ABIs of smart-contracts
    - perform read operations to some deployed smart-contracts on Mainnet and SKALE's Europa-chain

## Glossary

Main abstractions used by the library are provided below:

### Network

Represents the blockchain where smart contracts are deployed.

It could be Ethereum mainnet, goerli, SKALE chain or similar ethereum compatible chain.

### Project

SKALE set of smart contracts grouped into a project to serve a particular purpose.

Examples of projects are [IMA](https://github.com/skalenetwork/IMA/), [skale-manager](https://github.com/skalenetwork/skale-manager) or [etherbase](https://github.com/skalenetwork/etherbase/).

### Instance

An instance represents a particular project deployed to a particular network.

For example `IMA` on Ethereum mainnet or `etherbase` on some of SKALE chains.

### Alias

An alias is a textual name of an instance.

## Usage

The library provides a master object `skale_contracts`.

This object is used to provide the desired [network](#network), [project](#project) and [instance](#instance) using it's [alias](#alias) or direct address.

By instantiating a particular instance, it can be queried for information (address, ABI or Contract object) about a particular contract by it's name.

### Usage Example

```python
from web3 import HTTPProvider, Web3
from skale_contracts import skale_contracts
from skale_contracts.project_factory import SkaleProject, create_project
from skale_contracts.projects.skale_manager import SkaleManagerContract

# Any provider type that inherits from web3 BaseProvider
provider = Web3.HTTPProvider(MAINNET_ENDPOINT)
network = skale_contracts.get_network_by_provider(provider)
project = create_project(network, SkaleProject.SKALE_MANAGER)

# loading production instance of skale-manager deployed on ethereum mainnet
instance = project.get_instance('production')

# returns all contract names that can be queried using this instance
all_contract_names = instance.get_contract_names()

# get specific contract object
skale_manager_contract = instance.getContract(SkaleManagerContract.SKALE_MANAGER)

# will query the smart-contract. In this case, queries the version set in SkaleManager.sol
version = skale_manager_contract.functions.version().call()

```
