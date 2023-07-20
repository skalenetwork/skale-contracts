"""Module for instance management"""

from __future__ import annotations
from abc import ABC, abstractmethod
import json
from typing import TYPE_CHECKING, Optional
from attr import dataclass


if TYPE_CHECKING:
    from eth_typing import Address
    from web3 import Web3
    from web3.contract.contract import Contract
    from .abi import SkaleAbi
    from .project import Project



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

    @property
    def web3(self) -> Web3:
        """Get web3 object"""
        return self._project.network.web3

    @property
    def version(self) -> str:
        """Get version of the project instance"""
        if self._version is None:
            self._version = self._get_version()
            if not '-' in self._version:
                self._version = self._version + '-stable.0'
        return self._version

    @property
    def abi(self) -> SkaleAbi:
        """Get abi file of the project instance"""
        if self._abi is None:
            self._abi = json.loads(self._project.download_abi_file(self.version))
        return self._abi

    @abstractmethod
    def get_contract_address(self, name: str) -> Address:
        """Get address of the contract by it's name"""

    def get_contract(self, name: str) -> Contract:
        """Get Contract object of the contract by it's name"""
        address = self.get_contract_address(name)
        return self.web3.eth.contract(address=address, abi=self.abi[name])

    # protected

    @abstractmethod
    def _get_version(self) -> str:
        pass
