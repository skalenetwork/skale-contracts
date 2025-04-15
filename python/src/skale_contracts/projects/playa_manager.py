"""Module connects playa-manager project to the SKALE contracts library"""

from __future__ import annotations
from typing import TYPE_CHECKING
from eth_utils.address import to_canonical_address

from skale_contracts.instance import Instance
from skale_contracts.project import Project

if TYPE_CHECKING:
    from eth_typing import Address, ChecksumAddress


class PlayaManagerInstance(Instance):
    """Represents instance of playa-manager"""
    def __init__(self, project: Project, address: Address) -> None:
        super().__init__(project, address)
        self.committee_address = address

        self.committee = self.web3.eth.contract(
            address=address,
            abi=self.abi["Committee"]
        )

    def get_contract_address(
            self,
            name: str,
            *args: str | Address | ChecksumAddress
    ) -> Address:
        match name:
            case "Nodes":
                return to_canonical_address(
                    self.committee.functions.nodes().call()
                )
            case "Status":
                return to_canonical_address(
                    self.committee.functions.status().call()
                )
            case "DKG":
                return to_canonical_address(
                    self.committee.functions.dkg().call()
                )
            case "PlayaAccessManager":
                return to_canonical_address(
                    self.committee.functions.authority().call()
                )
            case "Staking":
                return to_canonical_address(
                    self.committee.functions.staking().call()
                )
            case "Committee":
                return self.committee_address
        raise ValueError(
            "Contract", name, "does not exist for", self._project.name()
        )


class PlayaManagerProject(Project):
    """Represents playa-manager project"""

    @staticmethod
    def name() -> str:
        return 'playa-manager'

    @property
    def github_repo(self) -> str:
        return 'https://github.com/skalenetwork/playa-manager/'

    def create_instance(self, address: Address) -> Instance:
        return PlayaManagerInstance(self, address)

    def get_abi_filename(self, version: str) -> str:
        return f'playa-manager-{version}-abi.json'
