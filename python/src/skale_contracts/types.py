"""Module for defining package types"""

from enum import StrEnum
from typing import TypeVar


ContractName = TypeVar('ContractName', bound=StrEnum)
