"""Module connects erc1820 project to the SKALE contracts library"""

from __future__ import annotations
from enum import StrEnum
from typing import TYPE_CHECKING, cast
from eth_utils.address import to_canonical_address

from skale_contracts.constants import PREDEPLOYED_ALIAS
from skale_contracts.instance import Instance
from skale_contracts.project import Project, SkaleProject

if TYPE_CHECKING:
    from eth_typing import Address, ChecksumAddress


class Erc1820Contract(StrEnum):
    """Defines contract names for erc1820 project"""
    ERC1820_REGISTRY = "ERC1820Registry"


class Erc1820Instance(Instance[Erc1820Contract]):
    """Represents instance of erc1820"""

    def _get_version(self) -> str:
        return '0.0.1-develop.1'

    PREDEPLOYED: dict[str, Address] = {
        name: to_canonical_address(address) for name, address in {
            'ERC1820Registry':
                '0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24'
        }.items()}

    def get_contract_address(
            self,
            name: Erc1820Contract,
            *args: str | Address | ChecksumAddress
    ) -> Address:
        if name in self.PREDEPLOYED:
            return self.PREDEPLOYED[name]
        raise RuntimeError(f"Can't get address of {name} contract")


class Erc1820Project(Project[Erc1820Contract]):
    """Represents erc1820 project"""

    @staticmethod
    def name() -> SkaleProject:
        return SkaleProject.ERC1820

    def get_instance(self, alias_or_address: str) -> Erc1820Instance:
        if alias_or_address == PREDEPLOYED_ALIAS:
            return self.create_instance(
                Erc1820Instance.PREDEPLOYED['ERC1820Registry']
            )
        return cast(Erc1820Instance, super().get_instance(alias_or_address))

    @property
    def github_repo(self) -> str:
        return 'https://github.com/skalenetwork/erc1820-predeployed/'

    def create_instance(self, address: Address) -> Erc1820Instance:
        return Erc1820Instance(self, address)

    def get_abi_filename(self, version: str) -> str:
        return f'erc1820-predeployed-{version}-abi.json'
