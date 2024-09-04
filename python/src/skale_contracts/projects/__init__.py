"""Supported projects"""
from .config_controller import ConfigControllerProject as ConfigController
from .context import ContextProject as Context
from .erc1820 import Erc1820PredeployedProject as Erc1820Predeployed
from .etherbase import EtherbaseProject as Etherbase
from .filestorage import FilestorageProject as FileStorage
from .marionette import MarionetteProject as Marionette
from .paymaster import PaymasterProject as Paymaster
from .ima import \
    MainnetImaProject as MainnetIma, \
    SchainImaProject as SchainIma
from .skale_manager import SkaleManagerProject as SkaleManager
from .skale_allocator import SkaleAllocatorProject as SkaleAllocator

__all__ = ['ConfigController', 'Context', 'Etherbase',
           'Erc1820Predeployed', 'FileStorage',
           'MainnetIma', 'Marionette', 'Paymaster', 'SchainIma',
           'SkaleAllocator', 'SkaleManager', ]
