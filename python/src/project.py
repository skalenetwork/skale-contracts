from abc import ABC, abstractmethod
from attr import dataclass
import requests

from constants import REPOSITORY_URL
from instance import Instance, InstanceData


@dataclass
class ProjectMetadata:
    name: str
    path: str


class Project(ABC):
    def __init__(self, network, metadata: ProjectMetadata) -> None:
        super().__init__()
        self.network = network
        self._metadata = metadata

    def get_instance(self, aliasOrAddress: str):
        if self.network.w3.is_address(aliasOrAddress):
            address = aliasOrAddress
            return self.createInstance(address)
        else:
            alias = aliasOrAddress
            url = self.getInstanceDataUrl(alias)
            response = requests.get(url)
            if (response.status != 200):
                raise ValueError(f"Can't download data for instance {alias}")
            else:
                data = InstanceData.from_json(response.text)
                if not alias in data.data:
                    raise ValueError(f'Error during parsing data for {alias}')
                return self.createInstance(data.data[alias])

    def downloadAbiFile(self, version: str):
        response = requests.get(self.get_abi_url(version))
        return response.text

    def get_abi_url(self, version: str):
        return f'{self.githubRepo}releases/download/{version}/{self.get_abi_filename(version)}'

    @abstractmethod
    def getAbiFilename(self, version: str) -> str:
        pass

    def get_instance_data_url(self, alias: str):
        from network import ListedNetwork
        if isinstance(self.network, ListedNetwork):
            return f'{REPOSITORY_URL}{self.network.path}/{self._metadata.path}/{alias}.json'
        else:
            raise ValueError('Network is unknown')

    @abstractmethod
    def create_instance(self, address: str) -> Instance:
        pass
