"""Module for creation of Project objects"""

from __future__ import annotations
from typing import TYPE_CHECKING, Any
import inspect

from .types import ContractName

from .project import Project, SkaleProject
from . import projects

if TYPE_CHECKING:
    from .network import Network


projects_dict: dict[str, type[Project[Any]]] = {
    project_type.name(): project_type
    for _, project_type
    in inspect.getmembers(projects, inspect.isclass)
    if issubclass(project_type, Project)
}


def create_project(
        network: Network, name: SkaleProject) -> Project[ContractName]:
    """Create Project object based on it's name"""
    if name in projects_dict:
        return projects_dict[name](network)
    raise ValueError(f'Project with name {name} is unknown')
