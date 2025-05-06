"""Module with fixtures for tests"""

import pytest
from web3 import HTTPProvider, Web3

from tests.constants import MAINNET_ENDPOINT, EUROPA_ENDPOINT


@pytest.fixture(scope='session')
def mainnet_provider() -> HTTPProvider:
    """Returns a SKALE Manager instance with provider from config"""
    provider = Web3.HTTPProvider(MAINNET_ENDPOINT)
    return provider


@pytest.fixture(scope='session')
def europa_provider() -> HTTPProvider:
    """Returns a SKALE Manager instance with provider from config"""
    provider = Web3.HTTPProvider(EUROPA_ENDPOINT)
    return provider
