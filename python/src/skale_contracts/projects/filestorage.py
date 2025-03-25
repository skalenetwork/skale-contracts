"""Module connects filestorage project to the SKALE contracts library"""

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


class FilestorageContract(StrEnum):
    """Defines contract names for marionette project"""
    FILE_STORAGE = "FileStorage"


class FilestorageInstance(Instance[FilestorageContract]):
    """Represents instance of filestorage"""

    def __init__(
            self,
            project: Project[FilestorageContract],
            address: Address
    ) -> None:
        super().__init__(project, address)
        self.initial_version = "1.0.1-stable.0"

    PREDEPLOYED: dict[str, Address] = {
        name: to_canonical_address(address) for name, address in {
            'FileStorage':
                '0xD3002000000000000000000000000000000000d3'
        }.items()}

    def get_contract_address(
            self,
            name: FilestorageContract,
            *args: str | Address | ChecksumAddress
    ) -> Address:
        if name in self.PREDEPLOYED:
            return self.PREDEPLOYED[name]
        raise RuntimeError(f"Can't get address of {name} contract")

    @cached_property
    def contract_names(self) -> set[FilestorageContract]:
        return set(FilestorageContract)


class FilestorageProject(Project[FilestorageContract]):
    """Represents filestorage project"""

    @staticmethod
    def name() -> SkaleProject:
        return SkaleProject.FILESTORAGE

    def get_instance(
            self, alias_or_address: str) -> FilestorageInstance:
        if alias_or_address == PREDEPLOYED_ALIAS:
            return self.create_instance(
                FilestorageInstance.PREDEPLOYED['FileStorage']
            )
        return cast(
            FilestorageInstance,
            super().get_instance(alias_or_address)
        )

    @property
    def github_repo(self) -> str:
        return 'https://github.com/skalenetwork/filestorage/'

    def create_instance(self, address: Address) -> FilestorageInstance:
        return FilestorageInstance(self, address)

    def get_abi_filename(self, version: str) -> str:
        return f'filestorage-{version}-abi.json'
