"""Module connects config-controller project to the SKALE contracts library"""

from __future__ import annotations
from enum import StrEnum
from typing import TYPE_CHECKING, cast
from eth_utils.address import to_canonical_address

from skale_contracts.constants import PREDEPLOYED_ALIAS
from skale_contracts.instance import Instance
from skale_contracts.project import Project, SkaleProject

if TYPE_CHECKING:
    from eth_typing import Address, ChecksumAddress


class ConfigControllerContract(StrEnum):
    """Defines contract names for config-controller project"""
    CONFIG_CONTROLLER = "ConfigController"


class ConfigControllerInstance(Instance[ConfigControllerContract]):
    """Represents instance of config-controller"""

    PREDEPLOYED: dict[str, Address] = {
        name: to_canonical_address(address) for name, address in {
            'ConfigController':
                '0xD2002000000000000000000000000000000000d2'
        }.items()}

    def get_contract_address(
            self,
            name: ConfigControllerContract,
            *args: str | Address | ChecksumAddress
    ) -> Address:
        if name in self.PREDEPLOYED:
            return self.PREDEPLOYED[name]
        raise RuntimeError(f"Can't get address of {name} contract")


class ConfigControllerProject(Project[ConfigControllerContract]):
    """Represents config-controller project"""

    @staticmethod
    def name() -> SkaleProject:
        return SkaleProject.CONFIG_CONTROLLER

    def get_instance(
            self,
            alias_or_address: str
    ) -> ConfigControllerInstance:

        if alias_or_address == PREDEPLOYED_ALIAS:
            return self.create_instance(
                ConfigControllerInstance.PREDEPLOYED['ConfigController']
            )
        return cast(
            ConfigControllerInstance,
            super().get_instance(alias_or_address)
        )

    @property
    def github_repo(self) -> str:
        return 'https://github.com/skalenetwork/config-controller/'

    def create_instance(self, address: Address) -> ConfigControllerInstance:
        return ConfigControllerInstance(self, address)

    def get_abi_filename(self, version: str) -> str:
        return f'config-controller-{version}-abi.json'
