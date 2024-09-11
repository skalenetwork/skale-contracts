"""Module for instance management"""

from __future__ import annotations
from abc import ABC, abstractmethod
import json
from typing import TYPE_CHECKING, Optional, cast
from attr import dataclass
from eth_typing import ChecksumAddress
from parver import Version as PyVersion
from semver.version import Version as SemVersion


if TYPE_CHECKING:
    from eth_typing import Address
    from web3 import Web3
    from web3.contract.contract import Contract
    from .abi import SkaleAbi
    from .project import Project


DEFAULT_GET_VERSION_FUNCTION = {
    "type": "function",
    "name": "version",
    "constant": True,
    "stateMutability": "view",
    "payable": False,
    "inputs": [],
    "outputs": [{"type": "string", "name": ""}]
}


@dataclass
class InstanceData:
    """Contains instance data"""
    data: dict[str, str]

    @classmethod
    def from_json(cls, data: str) -> InstanceData:
        """Create InstanceData object from json string"""
        return cls(data=json.loads(data))


class Instance(ABC):
    """Represents deployed instance of a smart contracts project"""
    def __init__(self, project: Project, address: Address) -> None:
        self._project = project
        self._version: Optional[str] = None
        self._abi: Optional[SkaleAbi] = None
        self.address = address
        self.initial_version: Optional[str] = None

    @property
    def web3(self) -> Web3:
        """Get web3 object"""
        return self._project.network.web3

    @property
    def version(self) -> str:
        """Get version of the project instance"""
        if self._version is None:
            raw_version = self._get_version()
            if SemVersion.is_valid(raw_version):
                sem_version = SemVersion.parse(raw_version)
                if sem_version.prerelease is None:
                    sem_version = sem_version.replace(prerelease='stable.0')
                self._version = str(sem_version)
            else:
                py_version = PyVersion.parse(raw_version)
                sem_version = SemVersion(*py_version.release)
                if py_version.pre_tag == 'a':
                    sem_version = sem_version.replace(
                        prerelease=f'develop.{py_version.pre}'
                    )
                elif py_version.pre_tag == 'b':
                    sem_version = sem_version.replace(
                        prerelease=f'beta.{py_version.pre}'
                    )
                self._version = str(sem_version)
        return self._version

    @property
    def abi(self) -> SkaleAbi:
        """Get abi file of the project instance"""
        if self._abi is None:
            self._abi = json.loads(
                self._project.download_abi_file(self.version)
            )
        return self._abi

    @abstractmethod
    def get_contract_address(
        self,
        name: str,
        *args: str | Address | ChecksumAddress
    ) -> Address:
        """Get address of the contract by it's name"""

    def get_contract(
            self,
            name: str,
            *args: str | Address | ChecksumAddress
    ) -> Contract:
        """Get Contract object of the contract by it's name"""
        address = self.get_contract_address(name, *args)
        return self.web3.eth.contract(address=address, abi=self.abi[name])

    # protected

    def _get_version(self) -> str:
        contract = self.web3.eth.contract(
            address=self.address,
            abi=[DEFAULT_GET_VERSION_FUNCTION]
        )
        try:
            return cast(str, contract.functions.version().call())
        except ValueError:
            if self.initial_version is not None:
                return self.initial_version
            raise
