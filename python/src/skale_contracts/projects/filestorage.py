"""Module connects filestorage project to the SKALE contracts library"""

from __future__ import annotations
from typing import TYPE_CHECKING
from eth_utils.address import to_canonical_address

from skale_contracts.constants import PREDEPLOYED_ALIAS
from skale_contracts.instance import Instance
from skale_contracts.project import Project

if TYPE_CHECKING:
    from eth_typing import Address, ChecksumAddress


class FilestorageInstance(Instance):
    """Represents instance of filestorage"""

    PREDEPLOYED: dict[str, Address] = {
        name: to_canonical_address(address) for name, address in {
            'FileStorage':
                '0xD3002000000000000000000000000000000000d3'
        }.items()}

    def get_contract_address(
            self,
            name: str,
            *args: str | Address | ChecksumAddress
    ) -> Address:
        if name in self.PREDEPLOYED:
            return self.PREDEPLOYED[name]
        raise RuntimeError(f"Can't get address of {name} contract")


class FilestorageProject(Project):
    """Represents filestorage project"""

    @staticmethod
    def name() -> str:
        return 'filestorage'

    def get_instance(self, alias_or_address: str) -> Instance:
        if alias_or_address == PREDEPLOYED_ALIAS:
            return self.create_instance(
                FilestorageInstance.PREDEPLOYED['FileStorage']
            )
        return super().get_instance(alias_or_address)

    @property
    def github_repo(self) -> str:
        return 'https://github.com/skalenetwork/filestorage/'

    def create_instance(self, address: Address) -> Instance:
        return FilestorageInstance(self, address)

    def get_abi_filename(self, version: str) -> str:
        return f'filestorage-{version}-abi.json'
