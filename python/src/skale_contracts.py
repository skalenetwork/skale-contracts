from web3 import Web3
from web3.providers import BaseProvider

from metadata import Metadata
from network import Network, ListedNetwork


class SkaleContracts:
    def __init__(self):
        self.metadata = Metadata()

    def get_network_by_provider(self, provider: BaseProvider) -> Network:
        w3 = Web3(provider)
        chain_id = w3.eth.chain_id
        networkMetadata = self.metadata.get_network_by_chain_id(chain_id)
        if networkMetadata is None:
            return Network(self, provider)
        else:
            return ListedNetwork(self, provider, networkMetadata.path)
