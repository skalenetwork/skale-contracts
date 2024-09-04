"""Module connects erc1820-predeployed project to the SKALE contracts library"""

from __future__ import annotations
from typing import TYPE_CHECKING
from eth_utils.address import to_canonical_address

from skale_contracts.constants import PREDEPLOYED_ALIAS
from skale_contracts.instance import Instance
from skale_contracts.project import Project

if TYPE_CHECKING:
    from eth_typing import Address, ChecksumAddress


class Erc1820PredeployedInstance(Instance):
    """Represents instance of erc1820-predeployed"""

    def _get_version(self) -> str:
      return '0.0.1-develop.1'

    PREDEPLOYED: dict[str, Address] = {
        name: to_canonical_address(address) for name, address in {
            'Erc1820Predeployed':
                '0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24'
        }.items()}

    def get_contract_address(
            self,
            name: str,
            *args: str | Address | ChecksumAddress
    ) -> Address:
        if name in self.PREDEPLOYED:
            return self.PREDEPLOYED[name]
        raise RuntimeError(f"Can't get address of {name} contract")


class Erc1820PredeployedProject(Project):
    """Represents erc1820-predeployed project"""

    @staticmethod
    def name() -> str:
        return 'erc1820-predeployed'

    def get_instance(self, alias_or_address: str) -> Instance:
        if alias_or_address == PREDEPLOYED_ALIAS:
            return self.create_instance(
                Erc1820PredeployedInstance.PREDEPLOYED['Erc1820Predeployed']
            )
        return super().get_instance(alias_or_address)

    @property
    def github_repo(self) -> str:
        return 'https://github.com/skalenetwork/erc1820-predeployed/'

    def create_instance(self, address: Address) -> Instance:
        return Erc1820PredeployedInstance(self, address)

    def get_abi_filename(self, version: str) -> str:
        return f'erc1820-predeployed-{version}-abi.json'
