"""Contains Project class"""

# cspell:words maxsplit

from __future__ import annotations
from abc import ABC, abstractmethod
from itertools import count
from typing import TYPE_CHECKING, Generator

from eth_utils.address import to_canonical_address
import requests
from semver.version import Version as SemVersion

from .constants import REPOSITORY_URL, NETWORK_TIMEOUT
from .instance import Instance, InstanceData

if TYPE_CHECKING:
    from eth_typing import Address
    from .network import Network


def alternative_versions_generator(version: str) -> Generator[str, None, None]:
    """Provides versions that have compatible ABI"""
    sem_version = SemVersion.parse(version)
    if sem_version.prerelease:
        prerelease_title = sem_version.prerelease.split('.', maxsplit=1)[0]
        if prerelease_title == 'stable':
            for prerelease_version in count():
                yield str(
                    sem_version.replace(prerelease=f'rc.{prerelease_version}')
                )


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
        exceptions: list[str] = []
        abi_file = self._download_abi_file_by_version(
            version,
            exceptions
        )
        if abi_file:
            return abi_file

        # Stable version can be absent for some time after upgrade.
        # Try release candidate branch
        abi_file = self._download_alternative_abi_file(
            version,
            exceptions
        )
        if abi_file:
            return abi_file
        raise RuntimeError('\n'.join(exceptions))

    def get_abi_url(self, version: str) -> str:
        """Calculate URL of ABI file"""
        filename = self.get_abi_filename(version)
        return f'{self.github_repo}releases/download/{version}/{filename}'

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

    def get_abi_urls(self, version: str) -> list[str]:
        """Calculate URLs of ABI file"""
        return [
            self._get_github_release_abi_url(version),
            self._get_github_repository_abi_url(version)
        ]

    # Private

    def _download_abi_file_by_version(
        self,
        version: str,
        exceptions: list[str]
    ) -> str | None:
        for abi_url in self.get_abi_urls(version):
            response = requests.get(abi_url, timeout=NETWORK_TIMEOUT)
            if response.status_code != 200:
                exceptions.append(f"Can't download abi file from {abi_url}")
            else:
                return response.text
        return None

    def _download_alternative_abi_file(
        self,
        version: str,
        exceptions: list[str]
    ) -> str | None:
        abi_file: str | None = None
        for alternative_version in alternative_versions_generator(version):
            alternative_abi_file = self._download_abi_file_by_version(
                alternative_version,
                exceptions
            )
            if alternative_abi_file:
                abi_file = alternative_abi_file
            else:
                # If abiFile is none
                # the previous one is the latest
                break

        return abi_file

    def _get_github_release_abi_url(self, version: str) -> str:
        return f'{self.github_repo}releases/download/{version}/' + \
            f'{self.get_abi_filename(version)}'

    def _get_github_repository_abi_url(self, version: str) -> str:
        url = self.github_repo.replace(
            'github.com',
            'raw.githubusercontent.com'
        )
        return f'{url}abi/{self.get_abi_filename(version)}'
