"""Module for work with networks"""

from web3 import Web3
from web3.providers import BaseProvider

from .projects.project_factory import create_project


class Network:
    """Represents blockchain with deployed smart contracts projects"""
    def __init__(self, skale_contracts, provider: BaseProvider):
        self.web3 = Web3(provider)
        self._skale_contracts = skale_contracts

    def get_project(self, name: str):
        """Get Project object by it's name"""
        return create_project(self, name)

    @property
    def skale_contracts(self):
        """Get SkaleContracts object associated with the network"""
        return self._skale_contracts


class ListedNetwork(Network):
    """Network that is listed in the metadata"""
    def __init__(self, skale_contracts, provider: BaseProvider, path: str):
        super().__init__(skale_contracts, provider)
        self.path = path
