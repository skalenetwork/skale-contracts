"""Module connects fair-manager project to the SKALE contracts library"""

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


class FairManagerContract(StrEnum):
    """Defines contract names for fair-manager project"""
    COMMITTEE = "Committee"
    DKG = "DKG"
    NODES = "Nodes"
    FAIR_ACCESS_MANAGER = "FairAccessManager"
    STATUS = "Status"
    STAKING = "Staking"


class FairManagerInstance(Instance[FairManagerContract]):
    """Represents instance of fair-manager"""
    def __init__(
            self,
            project: FairManagerProject,
            address: Address
    ) -> None:
        super().__init__(project, address)
        self.committee_address = address

        self.committee = self.web3.eth.contract(
            address=address,
            abi=self.abi["Committee"]
        )

    def get_contract_address(
            self,
            name: FairManagerContract,
            *args: str | Address | ChecksumAddress
    ) -> Address:
        if name not in FairManagerContract:
            raise ValueError(
                "Contract", name, "does not exist for", self._project.name()
            )
        match name:
            case FairManagerContract.NODES:
                return to_canonical_address(
                    self.committee.functions.nodes().call()
                )
            case FairManagerContract.STATUS:
                return to_canonical_address(
                    self.committee.functions.status().call()
                )
            case FairManagerContract.DKG:
                return to_canonical_address(
                    self.committee.functions.dkg().call()
                )
            case FairManagerContract.FAIR_ACCESS_MANAGER:
                return to_canonical_address(
                    self.committee.functions.authority().call()
                )
            case FairManagerContract.STAKING:
                return to_canonical_address(
                    self.committee.functions.staking().call()
                )
            case FairManagerContract.COMMITTEE:
                return self.committee_address

    @cached_property
    def contract_names(self) -> set[FairManagerContract]:
        return set(FairManagerContract)


class FairManagerProject(Project[FairManagerContract]):
    """Represents fair-manager project"""

    @staticmethod
    def name() -> SkaleProject:
        return SkaleProject.FAIR_MANAGER

    @property
    def github_repo(self) -> str:
        return 'https://github.com/skalenetwork/fair-manager/'

    def create_instance(self, address: Address) -> FairManagerInstance:
        return FairManagerInstance(self, address)

    def get_instance(self, alias_or_address: str) -> FairManagerInstance:
        return cast(
            FairManagerInstance,
            super().get_instance(alias_or_address)
        )

    def get_abi_filename(self, version: str) -> str:
        return f'{self.name()}-{version}-abi.json'
