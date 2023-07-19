"""Module for creation of Project objects"""

from attr import dataclass

from ..project import ProjectMetadata
from .skale_manager import SkaleManagerProject


@dataclass
class Projects:
    """Contains all known projects"""
    skale_manager = ProjectMetadata(name='skale-manager', path='skale-manager')


def create_project(network, name: str):
    """Create Project object based on it's name"""
    if name == Projects.skale_manager.name:
        return SkaleManagerProject(network, Projects.skale_manager)
    raise ValueError(f'Project with name {name} is unknown')
