from abc import ABC, abstractmethod
from attr import dataclass
import json


@dataclass
class InstanceData:
    data: dict[str, str]
    @staticmethod
    def from_json(cls, data: str):
        return cls(data=json.loads(data))


class Instance(ABC):
    def __init__(self, project, address: str) -> None:
        self._project = project
        self.address = address
        self.version = self._get_version()
        if not '-' in self.version:
            self.version = self.version + '-stable.0'
        self.abi = self._project.downloadAbiFile(self.version)

    def get_w3(self):
        return self._project.network.w3

    w3 = property(get_w3, None)

    @abstractmethod
    def get_contract_address(name: str) -> str:
        pass

    def get_contract(self, name: str):
        address = self.get_contract_address(name)
        abi = self.get_abi()
        return self.w3.eth.contract(address=address, abi=abi)

    # protected

    @abstractmethod
    def _get_version() -> str:
        pass
