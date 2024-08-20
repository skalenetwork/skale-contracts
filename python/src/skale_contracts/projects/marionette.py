"""Module connects marionette project to the SKALE contracts library"""

from __future__ import annotations
from typing import TYPE_CHECKING
from eth_utils.address import to_canonical_address

from skale_contracts.constants import PREDEPLOYED_ALIAS
from skale_contracts.instance import Instance
from skale_contracts.project import Project

if TYPE_CHECKING:
    from eth_typing import Address, ChecksumAddress


class MarionetteInstance(Instance):
    """Represents instance of marionette"""

    PREDEPLOYED: dict[str, Address] = {
        name: to_canonical_address(address) for name, address in {
            'Marionette':
                '0xD2c0DeFACe000000000000000000000000000000'
        }.items()}

    def get_contract_address(
            self,
            name: str,
            *args: str | Address | ChecksumAddress
    ) -> Address:
        if name in self.PREDEPLOYED:
            return self.PREDEPLOYED[name]
        raise RuntimeError(f"Can't get address of {name} contract")


class MarionetteProject(Project):
    """Represents marionette project"""

    @staticmethod
    def name() -> str:
        return 'marionette'

    def get_instance(self, alias_or_address: str) -> Instance:
        if alias_or_address == PREDEPLOYED_ALIAS:
            return self.create_instance(
                MarionetteInstance.PREDEPLOYED['Marionette']
            )
        return super().get_instance(alias_or_address)

    @property
    def github_repo(self) -> str:
        return 'https://github.com/skalenetwork/marionette/'

    def create_instance(self, address: Address) -> Instance:
        return MarionetteInstance(self, address)

    def get_abi_filename(self, version: str) -> str:
        return f'marionette-{version}-abi.json'
