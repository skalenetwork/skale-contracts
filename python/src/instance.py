from abc import ABC, abstractmethod
from attr import dataclass
import json


@dataclass
class InstanceData:
    data: dict[str, str]
    @classmethod
    def from_json(cls, data: str):
        return cls(data=json.loads(data))


class Instance(ABC):
    def __init__(self, project, address: str) -> None:
        self._project = project
        self._version = None
        self._abi = None
        self.address = address

    def get_w3(self):
        return self._project.network.w3

    def get_version(self):
        if self._version is None:
            self._version = self._get_version()
            if not '-' in self._version:
                self._version = self._version + '-stable.0'
        return self._version

    def get_abi(self):
        if self._abi is None:
            self._abi = json.loads(self._project.download_abi_file(self.version))
        return self._abi

    abi = property(get_abi, None)
    version = property(get_version, None)
    w3 = property(get_w3, None)

    @abstractmethod
    def get_contract_address(name: str) -> str:
        pass

    def get_contract(self, name: str):
        address = self.get_contract_address(name)
        return self.w3.eth.contract(address=address, abi=self.abi[name])

    # protected

    @abstractmethod
    def _get_version() -> str:
        pass
