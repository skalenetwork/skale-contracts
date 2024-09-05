"""Module connects context-contract project to the SKALE contracts library"""
from __future__ import annotations
from typing import TYPE_CHECKING
from eth_utils.address import to_canonical_address

from skale_contracts.constants import PREDEPLOYED_ALIAS
from skale_contracts.instance import Instance
from skale_contracts.project import Project

if TYPE_CHECKING:
    from eth_typing import Address, ChecksumAddress


class ContextInstance(Instance):
    """Represents instance of context-contract"""

    def __init__(self, project: Project, address: Address):
        super().__init__(project, address)
        self.initial_version = '1.0.0-develop.5'

    PREDEPLOYED: dict[str, Address] = {
        name: to_canonical_address(address) for name, address in {
            'ContextContract':
            '0xD2001000000000000000000000000000000000D2'
            }.items()}

    def get_contract_address(
            self,
            name: str,
            *args: str | Address | ChecksumAddress
    ) -> Address:
        if name in self.PREDEPLOYED:
            return self.PREDEPLOYED[name]
        raise RuntimeError(f"Can't get address of {name} contract")


class ContextProject(Project):
    """Represents context-contract project"""

    @staticmethod
    def name() -> str:
        return 'context-contract'

    @property
    def github_repo(self) -> str:
        return 'https://github.com/skalenetwork/context-contract/'

    def create_instance(self, address: Address) -> Instance:
        return ContextInstance(self, address)

    def get_instance(self, alias_or_address: str) -> Instance:
        if alias_or_address == PREDEPLOYED_ALIAS:
            return self.create_instance(
                ContextInstance.PREDEPLOYED['ContextContract']
                )
        return super().get_instance(alias_or_address)

    def get_abi_filename(self, version: str) -> str:
        return f'context-{version}-abi.json'
