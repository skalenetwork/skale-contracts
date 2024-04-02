"""Supported projects"""
from .ima import \
    MainnetImaProject as MainnetIma, \
    SchainImaProject as SchainIma
from .skale_manager import SkaleManagerProject as SkaleManager
from .skale_allocator import SkaleAllocatorProject as SkaleAllocator

__all__ = ['MainnetIma', 'SchainIma', 'SkaleAllocator', 'SkaleManager']
