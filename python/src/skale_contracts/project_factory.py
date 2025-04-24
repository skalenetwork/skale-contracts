"""Module for creation of Project objects"""

from __future__ import annotations
from enum import StrEnum
import importlib
import inspect
from typing import TYPE_CHECKING

from .project import Project

if TYPE_CHECKING:
    from .network import Network


class SkaleProject(StrEnum):
    """Defines project names"""
    MIRAGE_MANAGER = "mirage-manager"
    MAINNET_IMA = "mainnet-ima"
    SCHAIN_IMA = "schain-ima"
    PAYMASTER = "paymaster"
    SKALE_ALLOCATOR = "skale-allocator"
    SKALE_MANAGER = "skale-manager"
    MARIONETTE = "marionette"
    FILESTORAGE = "filestorage"
    ETHERBASE = "etherbase"
    ERC1820 = "erc1820"
    CONTEXT_CONTRACT = "context-contract"
    CONFIG_CONTROLLER = "config-controller"


projects_dict: dict[StrEnum, type[Project[StrEnum]]] = {}

# importing at runtime will fix circular dependency
projects_module = importlib.import_module(".projects", "skale_contracts")

for _, project_type in inspect.getmembers(projects_module, inspect.isclass):
    if (
        issubclass(project_type, Project) and
        isinstance(project_type.name(), SkaleProject) and
        project_type.name() not in projects_dict
    ):
        projects_dict[project_type.name()] = project_type


def create_project(
        network: Network, name: SkaleProject) -> Project[StrEnum]:
    """Create Project object based on it's name"""
    if name in projects_dict:
        return projects_dict[name](network)
    raise ValueError(f'Project with name {name} is unknown')
