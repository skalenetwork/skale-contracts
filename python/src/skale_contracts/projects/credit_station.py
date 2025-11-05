"""Module connects fair-manager project to the SKALE contracts library"""

from __future__ import annotations
from enum import StrEnum
from functools import cached_property
from typing import TYPE_CHECKING, cast

from skale_contracts.types import ContractName
from skale_contracts.instance import Instance
from skale_contracts.project import Project
from skale_contracts.project_factory import SkaleProject

if TYPE_CHECKING:
    from eth_typing import Address, ChecksumAddress


class MainnetCreditStationContract(StrEnum):
    """Defines contract names for main credit-station project"""
    CREDIT_STATION = "CreditStation"


class SchainCreditStationContract(StrEnum):
    """Defines contract names for main credit-station project"""
    LEDGER = "Ledger"


class CreditStationInstance(Instance[ContractName]):
    """Represents instance of credit-station"""

    def __init__(
            self,
            project: CreditStationProject[ContractName],
            address: Address
    ) -> None:
        super().__init__(project, address)

    def get_contract_address(
            self,
            name: ContractName, *args: str | Address | ChecksumAddress
    ) -> Address:
        return self.address


class CreditStationProject(Project[ContractName]):
    """Represents a credit-station project"""

    @property
    def github_repo(self) -> str:
        return 'https://github.com/skalenetwork/credit-station/'

    def get_abi_filename(self, version: str) -> str:
        return f'{self.name()}-{version}-abi.json'

    @staticmethod
    def name() -> SkaleProject:
        return SkaleProject.CREDIT_STATION


class MainnetCreditStationInstance(
    CreditStationInstance[MainnetCreditStationContract]
):
    """Represents instance of mainnet credit-station"""
    def __init__(
            self,
            project: MainnetCreditStationProject,
            address: Address
    ) -> None:
        super().__init__(project, address)
        self.credit_station = self.web3.eth.contract(
            address=address,
            abi=self.abi["CreditStation"]
        )

    @cached_property
    def contract_names(self) -> set[MainnetCreditStationContract]:
        return set(MainnetCreditStationContract)


class SchainCreditStationInstance(
    CreditStationInstance[SchainCreditStationContract]
):
    """Represents instance of schain credit-station"""
    def __init__(
            self,
            project: SchainCreditStationProject,
            address: Address
    ) -> None:
        super().__init__(project, address)
        self.ledger = self.web3.eth.contract(
            address=address,
            abi=self.abi["Ledger"]
        )

    @cached_property
    def contract_names(self) -> set[SchainCreditStationContract]:
        return set(SchainCreditStationContract)


class MainnetCreditStationProject(
    CreditStationProject[MainnetCreditStationContract]
):
    """Represents mainnet credit-station project"""

    def create_instance(
            self,
            address: Address
    ) -> MainnetCreditStationInstance:
        return MainnetCreditStationInstance(self, address)

    def get_instance(
            self,
            alias_or_address: str
    ) -> MainnetCreditStationInstance:
        return cast(
            MainnetCreditStationInstance,
            super().get_instance(alias_or_address)
        )


class SchainCreditStationProject(
    CreditStationProject[SchainCreditStationContract]
):
    """Represents mainnet credit-station project"""

    def create_instance(
            self,
            address: Address
    ) -> SchainCreditStationInstance:
        return SchainCreditStationInstance(self, address)

    def get_instance(
            self,
            alias_or_address: str
    ) -> SchainCreditStationInstance:
        return cast(
            SchainCreditStationInstance,
            super().get_instance(alias_or_address)
        )
