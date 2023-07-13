from web3 import Web3
from web3.providers import BaseProvider

from projects.project_factory import project_factory

class Network:
    def __init__(self, skaleContracts, provider: BaseProvider):
        self.w3 = Web3(provider)
        self._skaleContracts = skaleContracts

    def get_project(self, name: str):
        return project_factory.create(self, name)

class ListedNetwork(Network):
    def __init__(self, skaleContracts, provider: BaseProvider, path: str):
        super(skaleContracts, provider)
        self.path = path
