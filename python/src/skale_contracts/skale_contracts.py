"""Contains SkaleContracts class"""

from web3 import Web3
from web3.providers.base import BaseProvider

from .metadata import Metadata
from .network import Network, ListedNetwork
from .cache import MemoryCache, DiskCache


class SkaleContracts:
    """Entry point of the SKALE Contracts library"""

    def __init__(
        self,
        cache_dir: str | None = None,
        cleanup_cache: bool = False,
    ) -> None:
        self.cache = DiskCache(cache_dir, cleanup_cache) if cache_dir else MemoryCache()
        self.metadata = Metadata(self.cache)

    def get_network_by_provider(self, provider: BaseProvider) -> Network:
        """Get network by provider"""
        web3 = Web3(provider)
        chain_id = web3.eth.chain_id
        network_metadata = self.metadata.get_network_by_chain_id(chain_id)
        if network_metadata:
            return ListedNetwork(self, provider, network_metadata.path)
        return Network(self, provider)

    def get_network_by_http_endpoint(self, http_endpoint: str) -> Network:
        """Get network by HTTP URI"""
        return self.get_network_by_provider(Web3.HTTPProvider(http_endpoint))
