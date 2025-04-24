"""Module connects etherbase project to the SKALE contracts library"""

from __future__ import annotations
from enum import StrEnum
from functools import cached_property
from typing import TYPE_CHECKING, cast
from eth_utils.address import to_canonical_address

from skale_contracts.constants import PREDEPLOYED_ALIAS
from skale_contracts.instance import Instance
from skale_contracts.project import Project
from skale_contracts.project_factory import SkaleProject

if TYPE_CHECKING:
    from eth_typing import Address, ChecksumAddress


class EtherbaseContract(StrEnum):
    """Defines contract names for etherbase project"""
    ETHERBASE = "Etherbase"


class EtherbaseInstance(Instance[EtherbaseContract]):
    """Represents instance of etherbase"""

    def __init__(
            self,
            project: Project[EtherbaseContract],
            address: Address
    ) -> None:
        super().__init__(project, address)
        self.initial_version = "1.0.0-stable.0"

    PREDEPLOYED: dict[str, Address] = {
        name: to_canonical_address(address) for name, address in {
            'Etherbase':
                '0xd2bA3e0000000000000000000000000000000000'
        }.items()}

    def get_contract_address(
            self,
            name: EtherbaseContract,
            *args: str | Address | ChecksumAddress
    ) -> Address:
        if name in self.PREDEPLOYED:
            return self.PREDEPLOYED[name]
        raise RuntimeError(f"Can't get address of {name} contract")

    @cached_property
    def contract_names(self) -> set[EtherbaseContract]:
        return set(EtherbaseContract)


class EtherbaseProject(Project[EtherbaseContract]):
    """Represents etherbase project"""

    @staticmethod
    def name() -> SkaleProject:
        return SkaleProject.ETHERBASE

    def get_instance(
            self, alias_or_address: str) -> EtherbaseInstance:
        if alias_or_address == PREDEPLOYED_ALIAS:
            return self.create_instance(
                EtherbaseInstance.PREDEPLOYED['Etherbase']
            )
        return cast(EtherbaseInstance, super().get_instance(alias_or_address))

    @property
    def github_repo(self) -> str:
        return 'https://github.com/skalenetwork/etherbase/'

    def create_instance(self, address: Address) -> EtherbaseInstance:
        return EtherbaseInstance(self, address)

    def get_abi_filename(self, version: str) -> str:
        return f'etherbase-{version}-abi.json'
