"""Module connects fair-manager project to the SKALE contracts library"""

from __future__ import annotations
from enum import StrEnum
from functools import cached_property
from typing import TYPE_CHECKING, cast
from eth_utils.address import to_canonical_address

from skale_contracts.types import ContractName
from skale_contracts.instance import Instance
from skale_contracts.project import Project
from skale_contracts.project_factory import SkaleProject


if TYPE_CHECKING:
    from eth_typing import Address, ChecksumAddress


GET_AUTHORITY_FUNCTION = {
    "type": "function",
    "name": "authority",
    "stateMutability": "view",
    "payable": False,
    "inputs": [],
    "outputs": [{"type": "address", "name": ""}]
}


class MainnetCreditStationContract(StrEnum):
    """Defines contract names for mainnet credit-station project"""
    CREDIT_STATION = "CreditStation"
    CREDIT_STATION_ACCESS_MANAGER = "CreditStationAccessManager"


class SchainCreditStationContract(StrEnum):
    """Defines contract names for schain credit-station project"""
    LEDGER = "Ledger"
    CREDIT_STATION_ACCESS_MANAGER = "CreditStationAccessManager"


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
        if name in (
            MainnetCreditStationContract.CREDIT_STATION_ACCESS_MANAGER,
            SchainCreditStationContract.CREDIT_STATION_ACCESS_MANAGER
        ):
            return self._get_authority()

        if name in self.contract_names:
            return self.address

        raise ValueError(
            "Contract", name, "does not exist for", self._project.name()
        )

    # Private

    def _get_authority(self) -> Address:
        contract = self.web3.eth.contract(
            address=self.address,
            abi=[GET_AUTHORITY_FUNCTION]
        )
        return to_canonical_address(contract.functions.authority().call())


class CreditStationProject(Project[ContractName]):
    """Represents a credit-station project"""

    @property
    def github_repo(self) -> str:
        return 'https://github.com/skalenetwork/credit-station/'

    def get_abi_filename(self, version: str) -> str:
        return f'credit-station-{version}-abi.json'


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

    @staticmethod
    def name() -> SkaleProject:
        return SkaleProject.MAINNET_CREDIT_STATION


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

    @staticmethod
    def name() -> SkaleProject:
        return SkaleProject.SCHAIN_CREDIT_STATION
