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
            url = self.get_instance_data_url(alias)
            response = requests.get(url)
            if (response.status_code != 200):
                raise ValueError(f"Can't download data for instance {alias}")
            else:
                data = InstanceData.from_json(response.text)
                if len(data.data.values()) != 1:
                    raise ValueError(f'Error during parsing data for {alias}')
                return self.create_instance(list(data.data.values())[0])

    def download_abi_file(self, version: str):
        response = requests.get(self.get_abi_url(version))
        return response.text

    def get_abi_url(self, version: str):
        return f'{self.githubRepo}releases/download/{version}/{self.get_abi_filename(version)}'

    @abstractmethod
    def get_abi_filename(self, version: str) -> str:
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
