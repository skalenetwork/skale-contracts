from instance import Instance
from network import Network
from project import Project, ProjectMetadata
from skale_manager_instance import SkaleManagerInstance


class SkaleManagerProject(Project):
    def __init__(self, network: Network, metadata: ProjectMetadata) -> None:
        super().__init__(network, metadata)
        self.githubRepo = 'https://github.com/skalenetwork/skale-manager/'

    def create_instance(self, address: str) -> Instance:
        return SkaleManagerInstance(self, address)

    def get_abi_filename(version: str):
        return f'skale-manager-{version}-abi.json'
