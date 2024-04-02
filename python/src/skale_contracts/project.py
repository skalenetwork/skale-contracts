"""Contains Project class"""
from __future__ import annotations
from abc import ABC, abstractmethod
from typing import TYPE_CHECKING
from eth_utils.address import to_canonical_address
import requests

from .constants import REPOSITORY_URL, NETWORK_TIMEOUT
from .instance import Instance, InstanceData

if TYPE_CHECKING:
    from eth_typing import Address
    from .network import Network


class Project(ABC):
    """Represents set of smart contracts known as project"""

    def __init__(self, network: Network) -> None:
        super().__init__()
        self.network = network

    @staticmethod
    @abstractmethod
    def name() -> str:
        """Name of the project"""

    @property
    @abstractmethod
    def github_repo(self) -> str:
        """URL of github repo with the project"""


    @property
    def folder(self) -> str:
        """Folder name with instances json files"""
        return self.name()


    def get_instance(self, alias_or_address: str) -> Instance:
        """Create instance object based on alias or address"""
        if self.network.web3.is_address(alias_or_address):
            address = to_canonical_address(alias_or_address)
            return self.create_instance(address)
        alias = alias_or_address
        url = self.get_instance_data_url(alias)
        response = requests.get(url, timeout=NETWORK_TIMEOUT)
        if response.status_code == 200:
            data = InstanceData.from_json(response.text)
            if len(data.data.values()) != 1:
                raise ValueError(f'Error during parsing data for {alias}')
            address = to_canonical_address(list(data.data.values())[0])
            return self.create_instance(address)
        raise ValueError(f"Can't download data for instance {alias}")

    def download_abi_file(self, version: str) -> str:
        """Download file with ABI"""
        url = self.get_abi_url(version)
        response = requests.get(url, timeout=NETWORK_TIMEOUT)
        if response.status_code != 200:
            raise RuntimeError(f"Can't download abi file from {url}")
        return response.text

    def get_abi_url(self, version: str) -> str:
        """Calculate URL of ABI file"""
        return f'{self.github_repo}releases/download/{version}/{self.get_abi_filename(version)}'

    @abstractmethod
    def get_abi_filename(self, version: str) -> str:
        """Return name of a file with ABI"""

    def get_instance_data_url(self, alias: str) -> str:
        """Get URL of a file containing address for provided alias"""
        if self.network.is_listed():
            return f'{REPOSITORY_URL}{self.network.as_listed().path}/' + \
                f'{self.folder}/{alias}.json'
        raise ValueError('Network is unknown')

    @abstractmethod
    def create_instance(self, address: Address) -> Instance:
        """Create instance object based on known address"""
