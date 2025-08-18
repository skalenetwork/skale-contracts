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
    FAIR_ACCESS_MANAGER = "FairAccessManager"
    NODES = "Nodes"
    REWARD_WALLET = "RewardWallet"
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
            *args: str | Address | ChecksumAddress | int
    ) -> Address:
        if name not in FairManagerContract:
            raise ValueError(
                "Contract", name, "does not exist for", self._project.name()
            )
        match name:
            case FairManagerContract.FAIR_ACCESS_MANAGER:
                return to_canonical_address(
                    self.committee.functions.authority().call()
                )
            case FairManagerContract.COMMITTEE:
                return self.committee_address
            case FairManagerContract.REWARD_WALLET:
                return self._get_reward_wallet_address(
                    int(args[0]) if args else 0
                )
            case _:
                return to_canonical_address(
                    self.committee.functions[name.lower()].call()
                )

    @cached_property
    def contract_names(self) -> set[FairManagerContract]:
        return set(FairManagerContract)

    def _get_reward_wallet_address(
            self,
            node_id: int
    ) -> Address:
        """Returns the address of the reward wallet for a given node ID"""
        if not isinstance(node_id, int) or node_id <= 0:
            raise ValueError(
                "RewardWallet requires a valid NodeId argument: Integer > 0"
            )
        return to_canonical_address(self.get_contract(
            FairManagerContract.STAKING
        ).functions.getRewardWallet(node_id).call())


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
