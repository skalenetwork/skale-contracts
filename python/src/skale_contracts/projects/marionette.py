"""Module connects marionette project to the SKALE contracts library"""

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


class MarionetteContract(StrEnum):
    """Defines contract names for marionette project"""
    MARIONETTE = "Marionette"


class MarionetteInstance(Instance[MarionetteContract]):
    """Represents instance of marionette"""

    def __init__(
            self,
            project: Project[MarionetteContract],
            address: Address
    ) -> None:
        super().__init__(project, address)
        self.initial_version = "1.0.0-stable.0"

    PREDEPLOYED: dict[str, Address] = {
        name: to_canonical_address(address) for name, address in {
            'Marionette':
                '0xD2c0DeFACe000000000000000000000000000000'
        }.items()}

    def get_contract_address(
            self,
            name: MarionetteContract,
            *args: str | Address | ChecksumAddress
    ) -> Address:
        if name in self.PREDEPLOYED:
            return self.PREDEPLOYED[name]
        raise RuntimeError(f"Can't get address of {name} contract")

    @cached_property
    def contract_names(self) -> set[MarionetteContract]:
        return set(MarionetteContract)


class MarionetteProject(Project[MarionetteContract]):
    """Represents marionette project"""

    @staticmethod
    def name() -> SkaleProject:
        return SkaleProject.MARIONETTE

    def get_instance(
            self, alias_or_address: str) -> MarionetteInstance:
        if alias_or_address == PREDEPLOYED_ALIAS:
            return self.create_instance(
                MarionetteInstance.PREDEPLOYED['Marionette']
            )
        return cast(MarionetteInstance, super().get_instance(alias_or_address))

    @property
    def github_repo(self) -> str:
        return 'https://github.com/skalenetwork/marionette/'

    def create_instance(self, address: Address) -> MarionetteInstance:
        return MarionetteInstance(self, address)

    def get_abi_filename(self, version: str) -> str:
        return f'marionette-{version}-abi.json'
