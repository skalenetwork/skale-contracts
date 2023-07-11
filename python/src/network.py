from web3 import Web3
from web3.providers import BaseProvider

from skale_contracts import SkaleContracts

class Network:
    def __init__(self, skaleContracts: SkaleContracts, provider: BaseProvider):
        self.w3 = Web3(provider)
        self._skaleContracts = skaleContracts

    # def getProject(self, name: str) -> Project
    #     return projectFactory.create(this, name)

class ListedNetwork(Network):
    def __init__(self, skaleContracts: SkaleContracts, provider: BaseProvider, path: str):
        super(skaleContracts, provider)
        self.path = path
