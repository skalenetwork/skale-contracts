from instance import Instance
from project import Project, ProjectMetadata
from .skale_manager_instance import SkaleManagerInstance


class SkaleManagerProject(Project):
    def __init__(self, network, metadata: ProjectMetadata) -> None:
        super().__init__(network, metadata)

    @property
    def github_repo(self):
        return 'https://github.com/skalenetwork/skale-manager/'

    def create_instance(self, address: str) -> Instance:
        return SkaleManagerInstance(self, address)

    def get_abi_filename(self, version: str):
        return f'skale-manager-{version}-abi.json'
