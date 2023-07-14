from project import ProjectMetadata
from .skale_manager.skale_manager_project import SkaleManagerProject


class Projects:
    skale_manager = ProjectMetadata(name='skale-manager', path='skale-manager')


class ProjectFactory:
    def create(self, network, name: str):
        if name == Projects.skale_manager.name:
            return SkaleManagerProject(network, Projects.skale_manager)
        else:
            raise ValueError(f'Project with name {name} is unknown')

project_factory = ProjectFactory()
