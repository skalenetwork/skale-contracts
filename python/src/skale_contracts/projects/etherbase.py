"""Module connects etherbase project to the SKALE contracts library"""

from __future__ import annotations
from typing import TYPE_CHECKING
from eth_utils.address import to_canonical_address

from skale_contracts.constants import PREDEPLOYED_ALIAS
from skale_contracts.instance import Instance
from skale_contracts.project import Project

if TYPE_CHECKING:
    from eth_typing import Address, ChecksumAddress


class EtherbaseInstance(Instance):
    """Represents instance of etherbase"""

    PREDEPLOYED: dict[str, Address] = {
        name: to_canonical_address(address) for name, address in {
            'Etherbase':
                '0xd2bA3e0000000000000000000000000000000000'
        }.items()}

    def get_contract_address(
            self,
            name: str,
            *args: str | Address | ChecksumAddress
    ) -> Address:
        if name in self.PREDEPLOYED:
            return self.PREDEPLOYED[name]
        raise RuntimeError(f"Can't get address of {name} contract")


class EtherbaseProject(Project):
    """Represents etherbase project"""

    @staticmethod
    def name() -> str:
        return 'etherbase'

    def get_instance(self, alias_or_address: str) -> Instance:
        if alias_or_address == PREDEPLOYED_ALIAS:
            return self.create_instance(
                EtherbaseInstance.PREDEPLOYED['Etherbase']
            )
        return super().get_instance(alias_or_address)

    @property
    def github_repo(self) -> str:
        return 'https://github.com/skalenetwork/etherbase/'

    def create_instance(self, address: Address) -> Instance:
        return EtherbaseInstance(self, address)

    def get_abi_filename(self, version: str) -> str:
        return f'etherbase-{version}-abi.json'
