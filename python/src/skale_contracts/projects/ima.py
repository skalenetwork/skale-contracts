"""Module connects IMA to the SKALE contracts library"""

from __future__ import annotations
from typing import cast, TYPE_CHECKING
from eth_typing import Address

from skale_contracts.instance import Instance, DEFAULT_GET_VERSION_FUNCTION
from skale_contracts.project import Project

from .skale_manager import CONTRACT_MANAGER_ABI


if TYPE_CHECKING:
    from web3.contract.contract import Contract

MESSAGE_PROXY_ABI = [
    DEFAULT_GET_VERSION_FUNCTION
]


class ImaInstance(Instance):
    """Represents instance of IMA"""
    def __init__(self, project: Project, address: Address) -> None:
        super().__init__(project, address)
        self.message_proxy = self.web3.eth.contract(address=address, abi=MESSAGE_PROXY_ABI)

    def _get_version(self) -> str:
        return cast(str, self.message_proxy.functions.version().call())


class ImaProject(Project):
    """Represents IMA project"""

    @property
    def github_repo(self) -> str:
        return 'https://github.com/skalenetwork/ima/'


class MainnetImaInstance(ImaInstance):
    """Represents IMA instance on mainnet"""

    def __init__(self, project: Project, address: Address) -> None:
        super().__init__(project, address)
        self._contract_manager: Contract | None = None

    def get_contract_address(self, name: str) -> Address:
        if name == 'MessageProxyForMainnet':
            return self.address
        if name == 'CommunityPool':
            return cast(
                Address,
                self.get_contract("MessageProxyForMainnet").functions.communityPool().call()
            )
        if name == 'Linker':
            return cast(
                Address,
                self.get_contract("MessageProxyForMainnet").functions.linker().call()
            )
        return cast(
            Address,
            self.contract_manager.functions.getContract(name).call()
        )

    @property
    def contract_manager(self) -> Contract:
        """ContractManager contract of a skale-manager instance associated with the IMA"""
        if self._contract_manager is None:
            self._contract_manager = self.web3.eth.contract(
                address=cast(
                    Address,
                    self.get_contract("MessageProxyForMainnet")
                        .functions.contractManagerOfSkaleManager().call()
                ),
                abi=CONTRACT_MANAGER_ABI
            )
        return self._contract_manager


class MainnetImaProject(ImaProject):
    """Represents mainnet part of IMA project"""

    def create_instance(self, address: Address) -> Instance:
        return MainnetImaInstance(self, address)

    def get_abi_filename(self, version: str) -> str:
        return f'mainnet-ima-{version}-abi.json'
