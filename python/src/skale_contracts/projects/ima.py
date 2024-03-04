"""Module connects IMA to the SKALE contracts library"""

from __future__ import annotations
from typing import cast, TYPE_CHECKING

from ..instance import Instance, DEFAULT_GET_VERSION_FUNCTION
from ..project import Project


if TYPE_CHECKING:
    from eth_typing import Address
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
    def get_contract_address(self, name: str) -> Address:
        raise NotImplementedError("get_contract_address")


class MainnetImaProject(ImaProject):
    """Represents mainnet part of IMA project"""

    def create_instance(self, address: Address) -> Instance:
        return MainnetImaInstance(self, address)

    def get_abi_filename(self, version: str) -> str:
        return f'ima-{version}-abi.json'
