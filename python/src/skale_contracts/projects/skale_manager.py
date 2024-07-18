"""Module connects skale-manager project to the SKALE contracts library"""

from __future__ import annotations
from typing import TYPE_CHECKING
from eth_utils.address import to_canonical_address

from skale_contracts.instance import Instance, DEFAULT_GET_VERSION_FUNCTION
from skale_contracts.project import Project


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


class SkaleManagerInstance(Instance):
    """Represents instance of skale-manager"""
    def __init__(self, project: Project, address: Address) -> None:
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
            'TimeHelpersWithDebug':  'TimeHelpers'
        }

    def get_contract_address(
            self,
            name: str,
            *args: str | Address | ChecksumAddress
    ) -> Address:
        return to_canonical_address(
            self.contract_manager.functions.getContract(
                self._actual_name(name)
            ).call()
        )

    def _actual_name(self, name: str) -> str:
        if name in self.custom_names:
            return self.custom_names[name]
        return name


class SkaleManagerProject(Project):
    """Represents skale-manager project"""

    @staticmethod
    def name() -> str:
        return 'skale-manager'

    @property
    def github_repo(self) -> str:
        return 'https://github.com/skalenetwork/skale-manager/'

    def create_instance(self, address: Address) -> Instance:
        return SkaleManagerInstance(self, address)

    def get_abi_filename(self, version: str) -> str:
        return f'skale-manager-{version}-abi.json'
