"""Module for creation of Project objects"""

from __future__ import annotations
from enum import StrEnum
import inspect
from typing import TYPE_CHECKING

from .project import Project, SkaleProject
from . import projects

if TYPE_CHECKING:
    from .network import Network


projects_dict: dict[SkaleProject, type[Project[StrEnum]]] = {
    project_type.name(): project_type
    for _, project_type
    in inspect.getmembers(projects, inspect.isclass)
    if issubclass(project_type, Project)
}


def create_project(
        network: Network, name: SkaleProject) -> Project[StrEnum]:
    """Create Project object based on it's name"""
    if name in projects_dict:
        return projects_dict[name](network)
    raise ValueError(f'Project with name {name} is unknown')
