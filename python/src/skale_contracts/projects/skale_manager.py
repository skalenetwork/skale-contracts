"""Module connects skale-manager project to the SKALE contracts library"""

from __future__ import annotations
from enum import StrEnum
from typing import TYPE_CHECKING, cast
from eth_utils.address import to_canonical_address

from skale_contracts.instance import Instance, DEFAULT_GET_VERSION_FUNCTION
from skale_contracts.project import Project, SkaleProject


if TYPE_CHECKING:
    from eth_typing import Address, ChecksumAddress
    from web3.contract.contract import Contract

SKALE_MANAGER_ABI = [
    {
        "inputs": [],
        "name": "contractManager",
        "outputs": [{
            "internalType": "contract IContractManager",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view", "type": "function"
    },
    DEFAULT_GET_VERSION_FUNCTION
]

CONTRACT_MANAGER_ABI = [
    {
        "inputs": [{
            "internalType": "string",
            "name": "name",
            "type": "string"
        }],
        "name": "getContract",
        "outputs": [{
            "internalType": "address",
            "name": "contractAddress",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    }
]


class SkaleManagerContract(StrEnum):
    """Defines contract names for skale-manager project"""
    CONTRACT_MANAGER = "ContractManager"

    DELEGATION_CONTROLLER = "DelegationController"
    DELEGATION_PERIOD_MANAGER = "DelegationPeriodManager"
    DISTRIBUTOR = "Distributor"
    PUNISHER = "Punisher"
    SLASHING_TABLE = "SlashingTable"
    TIME_HELPERS = "TimeHelpers"
    TOKEN_STATE = "TokenState"
    VALIDATOR_SERVICE = "ValidatorService"

    CONSTANTS_HOLDER = "ConstantsHolder"
    NODES = "Nodes"
    NODE_ROTATION = "NodeRotation"
    SCHAINS_INTERNAL = "SchainsInternal"
    SCHAINS = "Schains"
    DECRYPTION = "Decryption"
    ECDH = "ECDH"
    KEY_STORAGE = "KeyStorage"
    SKALE_DKG = "SkaleDKG"
    SKALE_VERIFIER = "SkaleVerifier"
    SKALE_MANAGER = "SkaleManager"
    BOUNTY = "Bounty"
    BOUNTY_V2 = "BountyV2"
    WALLETS = "Wallets"
    SYNC_MANAGER = "SyncManager"
    PAYMASTER_CONTROLLER = "PaymasterController"
    TIME_HELPERS_WITH_DEBUG = "TimeHelpersWithDebug"
    SKALE_TOKEN = "SkaleToken"


class SkaleManagerInstance(Instance[SkaleManagerContract]):
    """Represents instance of skale-manager"""

    def __init__(
            self,
            project: SkaleManagerProject,
            address: Address
    ) -> None:

        super().__init__(project, address)
        self.skale_manager = self.web3.eth.contract(
            address=address,
            abi=SKALE_MANAGER_ABI
        )
        contract_manager_address: Address = \
            self.skale_manager.functions.contractManager().call()
        self.contract_manager: Contract = self.web3.eth.contract(
            address=contract_manager_address,
            abi=CONTRACT_MANAGER_ABI
        )
        self.custom_names = {
            'BountyV2': 'Bounty',
            'TimeHelpersWithDebug': 'TimeHelpers'
        }

    def get_contract_address(
            self,
            name: SkaleManagerContract,
            *args: str | Address | ChecksumAddress
    ) -> Address:
        if name not in SkaleManagerContract:
            raise ValueError(
                "Contract", name, "does not exist for", self._project.name()
            )
        return to_canonical_address(
            self.contract_manager.functions.getContract(
                self._actual_name(name)
            ).call()
        )

    def _actual_name(self, name: str) -> str:
        if name in self.custom_names:
            return self.custom_names[name]
        return name


class SkaleManagerProject(Project[SkaleManagerContract]):
    """Represents skale-manager project"""

    @staticmethod
    def name() -> SkaleProject:
        return SkaleProject.SKALE_MANAGER

    @property
    def github_repo(self) -> str:
        return 'https://github.com/skalenetwork/skale-manager/'

    def create_instance(self, address: Address) -> SkaleManagerInstance:
        return SkaleManagerInstance(self, address)

    def get_instance(self, alias_or_address: str) -> SkaleManagerInstance:
        return cast(
            SkaleManagerInstance,
            super().get_instance(alias_or_address)
        )

    def get_abi_filename(self, version: str) -> str:
        return f'skale-manager-{version}-abi.json'
