"""Tools for project metadata processing"""
from attr import dataclass

@dataclass
class ProjectMetadata:
    """Contains project metadata"""
    name: str
    path: str
