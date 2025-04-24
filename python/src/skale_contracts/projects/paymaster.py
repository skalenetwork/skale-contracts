"""Module connects paymaster project to the SKALE contracts library"""
from __future__ import annotations
from enum import StrEnum
from functools import cached_property
from typing import TYPE_CHECKING, cast
from eth_utils.address import to_canonical_address

from skale_contracts.instance import Instance
from skale_contracts.project import Project
from skale_contracts.project_factory import SkaleProject

if TYPE_CHECKING:
    from eth_typing import Address, ChecksumAddress


class PaymasterContract(StrEnum):
    """Defines contract names for paymaster project"""
    PAYMASTER = "Paymaster"
    PAYMASTER_ACCESS_MANAGER = "PaymasterAccessManager"
    FAST_FORWARD_PAYMASTER = "FastForwardPaymaster"


class PaymasterInstance(Instance[PaymasterContract]):
    """Represents instance of paymaster"""

    def get_contract_address(
            self,
            name: PaymasterContract,
            *args: str | Address | ChecksumAddress

    ) -> Address:
        if name in {"Paymaster", "FastForwardPaymaster"}:
            return self.address
        if name == "PaymasterAccessManager":
            return to_canonical_address(
                self.get_contract(PaymasterContract.PAYMASTER)
                    .functions.authority().call()
            )
        raise RuntimeError(f"Can't get address of {name} contract")

    @cached_property
    def contract_names(self) -> set[PaymasterContract]:
        return set(PaymasterContract)


class PaymasterProject(Project[PaymasterContract]):
    """Represents paymaster project"""

    @staticmethod
    def name() -> SkaleProject:
        return SkaleProject.PAYMASTER

    @property
    def github_repo(self) -> str:
        return 'https://github.com/skalenetwork/paymaster/'

    def create_instance(self, address: Address) -> PaymasterInstance:
        return PaymasterInstance(self, address)

    def get_instance(self, alias_or_address: str) -> PaymasterInstance:
        return cast(PaymasterInstance, super().get_instance(alias_or_address))

    def get_abi_filename(self, version: str) -> str:
        return f'paymaster-{version}-abi.json'
