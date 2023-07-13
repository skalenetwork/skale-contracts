from web3 import Web3
from web3.providers import BaseProvider

from projects.project_factory import project_factory

class Network:
    def __init__(self, skale_contracts, provider: BaseProvider):
        self.w3 = Web3(provider)
        self._skaleContracts = skale_contracts

    def get_project(self, name: str):
        return project_factory.create(self, name)

class ListedNetwork(Network):
    def __init__(self, skale_contracts, provider: BaseProvider, path: str):
        super().__init__(skale_contracts, provider)
        self.path = path
