"""Module for instance management"""

from abc import ABC, abstractmethod
import json
from attr import dataclass


@dataclass
class InstanceData:
    """Contains instance data"""
    data: dict[str, str]
    @classmethod
    def from_json(cls, data: str):
        """Create InstanceData object from json string"""
        return cls(data=json.loads(data))


class Instance(ABC):
    """Represents deployed instance of a smart contracts project"""
    def __init__(self, project, address: str) -> None:
        self._project = project
        self._version = None
        self._abi = None
        self.address = address

    def get_w3(self):
        """Get web3 object"""
        return self._project.network.w3

    def get_version(self):
        """Get version of the project instance"""
        if self._version is None:
            self._version = self._get_version()
            if not '-' in self._version:
                self._version = self._version + '-stable.0'
        return self._version

    def get_abi(self):
        """Get abi file of the project instance"""
        if self._abi is None:
            self._abi = json.loads(self._project.download_abi_file(self.version))
        return self._abi

    abi = property(get_abi, None)
    version = property(get_version, None)
    w3 = property(get_w3, None)

    @abstractmethod
    def get_contract_address(self, name: str) -> str:
        """Get address of the contract by it's name"""

    def get_contract(self, name: str):
        """Get Contract object of the contract by it's name"""
        address = self.get_contract_address(name)
        return self.w3.eth.contract(address=address, abi=self.abi[name])

    # protected

    @abstractmethod
    def _get_version(self) -> str:
        pass
