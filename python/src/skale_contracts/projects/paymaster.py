"""Module connects paymaster project to the SKALE contracts library"""
from __future__ import annotations
from typing import TYPE_CHECKING
from eth_utils.address import to_canonical_address

from skale_contracts.instance import Instance
from skale_contracts.project import Project

if TYPE_CHECKING:
    from eth_typing import Address, ChecksumAddress


class PaymasterInstance(Instance):
    """Represents instance of paymaster"""

    def get_contract_address(
            self,
            name: str,
            *args: str | Address | ChecksumAddress
    ) -> Address:
        if name in {"Paymaster", "FastForwardPaymaster"}:
            return self.address
        if name == "PaymasterAccessManager":
            return to_canonical_address(
                self.get_contract("Paymaster")
                    .functions.authority().call()
            )
        raise RuntimeError(f"Can't get address of {name} contract")


class PaymasterProject(Project):
    """Represents paymaster project"""

    @staticmethod
    def name() -> str:
        return 'paymaster'

    @property
    def github_repo(self) -> str:
        return 'https://github.com/skalenetwork/paymaster/'

    def create_instance(self, address: Address) -> Instance:
        return PaymasterInstance(self, address)

    def get_abi_filename(self, version: str) -> str:
        return f'paymaster-{version}-abi.json'
