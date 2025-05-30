"""Module for work with networks"""

from __future__ import annotations
from enum import StrEnum
from typing import cast, TYPE_CHECKING
from web3 import Web3
from web3.providers.base import BaseProvider

from .project_factory import create_project


if TYPE_CHECKING:
    from .project import Project
    from .skale_contracts import SkaleContracts
    from .project_factory import SkaleProject


class Network:
    """Represents blockchain with deployed smart contracts projects"""
    def __init__(
            self,
            skale_contracts: SkaleContracts,
            provider: BaseProvider
    ):
        self.web3 = Web3(provider)
        self._skale_contracts = skale_contracts

    def get_project(self, name: SkaleProject) -> Project[StrEnum]:
        """Get Project object by it's name"""
        return create_project(self, name)

    @property
    def skale_contracts(self) -> SkaleContracts:
        """Get SkaleContracts object associated with the network"""
        return self._skale_contracts

    def is_listed(self) -> bool:
        """Return if the network is present in the skale-contract repository"""
        return False

    def as_listed(self) -> ListedNetwork:
        """Cast to ListedNetwork"""
        return cast(ListedNetwork, self)


class ListedNetwork(Network):
    """Network that is listed in the metadata"""
    def __init__(
            self,
            skale_contracts: SkaleContracts,
            provider: BaseProvider,
            path: str
    ):
        super().__init__(skale_contracts, provider)
        self.path = path

    def is_listed(self) -> bool:
        """Return if the network is present in the skale-contract repository"""
        return True
