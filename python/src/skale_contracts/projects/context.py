"""Module connects context-contract project to the SKALE contracts library"""
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


class ContextContract(StrEnum):
    """Defines contract names for context-contract project"""
    CONTEXT_CONTRACT = "ContextContract"


class ContextInstance(Instance[ContextContract]):
    """Represents instance of context-contract"""

    def __init__(self, project: ContextProject, address: Address):
        super().__init__(project, address)
        self.initial_version = '1.0.0-develop.5'

    PREDEPLOYED: dict[str, Address] = {
        name: to_canonical_address(address) for name, address in {
            'ContextContract':
            '0xD2001000000000000000000000000000000000D2'
        }.items()}

    def get_contract_address(
            self,
            name: ContextContract,
            *args: str | Address | ChecksumAddress
    ) -> Address:
        if name in self.PREDEPLOYED:
            return self.PREDEPLOYED[name]
        raise RuntimeError(f"Can't get address of {name} contract")

    @cached_property
    def contract_names(self) -> set[ContextContract]:
        return set(ContextContract)


class ContextProject(Project[ContextContract]):
    """Represents context-contract project"""

    @staticmethod
    def name() -> SkaleProject:
        return SkaleProject.CONTEXT_CONTRACT

    @property
    def github_repo(self) -> str:
        return 'https://github.com/skalenetwork/context-contract/'

    def create_instance(self, address: Address) -> ContextInstance:
        return ContextInstance(self, address)

    def get_instance(self, alias_or_address: str) -> ContextInstance:
        if alias_or_address == PREDEPLOYED_ALIAS:
            return self.create_instance(
                ContextInstance.PREDEPLOYED['ContextContract']
            )
        return cast(ContextInstance, super().get_instance(alias_or_address))

    def get_abi_filename(self, version: str) -> str:
        return f'context-{version}-abi.json'
