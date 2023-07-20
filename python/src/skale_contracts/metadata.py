"""Module for work with SKALE contracts metadata"""

from __future__ import annotations
from dataclasses import dataclass
import json
from typing import Optional
import requests

from .constants import REPOSITORY_URL, METADATA_FILENAME, NETWORK_TIMEOUT


@dataclass
class NetworkMetadata:
    """Contains metadata of a network"""
    name: str
    chain_id: int
    path: str

@dataclass
class MetadataFile:
    """Represents file with metadata"""
    networks: list[NetworkMetadata]

    @classmethod
    def from_json(cls, data: str) -> MetadataFile:
        """Create MetadataFile object from json string"""
        file = json.loads(data)
        networks = []
        for network in file['networks']:
            networks.append(NetworkMetadata(
                name=network['name'],
                chain_id=network['chainId'],
                path=network['path']))
        return cls(networks)

class Metadata:
    """Class to manage SKALE contracts metadata"""
    networks: list[NetworkMetadata]

    def __init__(self) -> None:
        self.download()

    def download(self) -> None:
        """Download metadata"""
        metadata_response = requests.get(
            REPOSITORY_URL + METADATA_FILENAME,
            timeout=NETWORK_TIMEOUT
        )
        metadata = MetadataFile.from_json(metadata_response.text)
        self.networks = metadata.networks

    def get_network_by_chain_id(self, chain_id: int) -> Optional[NetworkMetadata]:
        """Get network metadata by it's chain id.
        Returns None if there is no such network in the metadata.
        """
        for network in self.networks:
            if network.chain_id == chain_id:
                return network
        return None
