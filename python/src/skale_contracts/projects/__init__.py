"""Supported projects"""
from .ima import \
    MainnetImaProject as MainnetIma, \
    SchainImaProject as SchainIma
from .skale_manager import SkaleManagerProject as SkaleManager

__all__ = ['MainnetIma', 'SchainIma', 'SkaleManager']
