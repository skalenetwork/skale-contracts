"""Module for creation of Project objects"""

from __future__ import annotations
from typing import TYPE_CHECKING
from attr import dataclass

from .project import ProjectMetadata
from .projects.skale_manager import SkaleManagerProject


if TYPE_CHECKING:
    from .project import Project
    from .network import Network


@dataclass
class Projects:
    """Contains all known projects"""
    skale_manager = ProjectMetadata(name='skale-manager', path='skale-manager')


def create_project(network: Network, name: str) -> Project:
    """Create Project object based on it's name"""
    if name == Projects.skale_manager.name:
        return SkaleManagerProject(network, Projects.skale_manager)
    raise ValueError(f'Project with name {name} is unknown')
