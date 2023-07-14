from dataclasses import dataclass
import json
from typing import Optional
import requests

from constants import REPOSITORY_URL, METADATA_FILENAME


@dataclass
class NetworkMetadata:
    name: str
    chain_id: int
    path: str

@dataclass
class MetadataFile:
    networks: list[NetworkMetadata]

    @classmethod
    def from_json(cls, data: str):
        file = json.loads(data)
        networks = []
        for network in file['networks']:
            networks.append(NetworkMetadata(
                name=network['name'],
                chain_id=network['chainId'],
                path=network['path']))
        return cls(networks)

class Metadata:
    networks: list[NetworkMetadata]

    def __init__(self) -> None:
        self.download()

    def download(self) -> None:
        metadataResponse = requests.get(REPOSITORY_URL + METADATA_FILENAME)
        metadata = MetadataFile.from_json(metadataResponse.text)
        self.networks = metadata.networks

    def get_network_by_chain_id(self, chain_id: int) -> Optional[NetworkMetadata]:
        for network in self.networks:
            if network.chain_id == chain_id:
                return network


