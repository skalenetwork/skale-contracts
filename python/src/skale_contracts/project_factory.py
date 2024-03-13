"""Module for creation of Project objects"""

from __future__ import annotations
from typing import TYPE_CHECKING
from attr import dataclass

from . import projects
from .project_metadata import ProjectMetadata

if TYPE_CHECKING:
    from .project import Project
    from .network import Network


@dataclass
class Projects:
    """Contains all known projects"""
    skale_manager = ProjectMetadata(name='skale-manager', path='skale-manager')
    mainnet_ima = ProjectMetadata(name='mainnet-ima', path='mainnet-ima')


def create_project(network: Network, name: str) -> Project:
    """Create Project object based on it's name"""
    if name == Projects.skale_manager.name:
        return projects.SkaleManager(network, Projects.skale_manager)
    if name == Projects.mainnet_ima.name:
        return projects.MainnetIma(network, Projects.mainnet_ima)
    raise ValueError(f'Project with name {name} is unknown')
