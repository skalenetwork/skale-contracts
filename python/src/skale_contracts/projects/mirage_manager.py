"""Module connects mirage-manager project to the SKALE contracts library"""

from __future__ import annotations
from enum import StrEnum
from typing import TYPE_CHECKING, cast
from eth_utils.address import to_canonical_address

from skale_contracts.instance import Instance
from skale_contracts.project import Project, SkaleProject

if TYPE_CHECKING:
    from eth_typing import Address, ChecksumAddress


class MirageManagerContract(StrEnum):
    """Defines contract names for mirage-manager project"""
    COMMITTEE = "Committee"
    DKG = "DKG"
    NODES = "Nodes"
    MIRAGE_ACCESS_MANAGER = "MirageAccessManager"
    STATUS = "Status"
    STAKING = "Staking"


class MirageManagerInstance(Instance[MirageManagerContract]):
    """Represents instance of mirage-manager"""
    def __init__(
            self,
            project: MirageManagerProject,
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
            name: MirageManagerContract,
            *args: str | Address | ChecksumAddress
    ) -> Address:
        if name not in MirageManagerContract:
            raise ValueError(
                "Contract", name, "does not exist for", self._project.name()
            )
        match name:
            case MirageManagerContract.NODES:
                return to_canonical_address(
                    self.committee.functions.nodes().call()
                )
            case MirageManagerContract.STATUS:
                return to_canonical_address(
                    self.committee.functions.status().call()
                )
            case MirageManagerContract.DKG:
                return to_canonical_address(
                    self.committee.functions.dkg().call()
                )
            case MirageManagerContract.MIRAGE_ACCESS_MANAGER:
                return to_canonical_address(
                    self.committee.functions.authority().call()
                )
            case MirageManagerContract.STAKING:
                return to_canonical_address(
                    self.committee.functions.staking().call()
                )
            case MirageManagerContract.COMMITTEE:
                return self.committee_address


class MirageManagerProject(Project[MirageManagerContract]):
    """Represents mirage-manager project"""

    @staticmethod
    def name() -> SkaleProject:
        return SkaleProject.MIRAGE_MANAGER

    @property
    def github_repo(self) -> str:
        return 'https://github.com/skalenetwork/mirage-manager/'

    def create_instance(self, address: Address) -> MirageManagerInstance:
        return MirageManagerInstance(self, address)

    def get_instance(self, alias_or_address: str) -> MirageManagerInstance:
        return cast(
            MirageManagerInstance,
            super().get_instance(alias_or_address)
        )

    def get_abi_filename(self, version: str) -> str:
        return f'{self.name()}-{version}-abi.json'
