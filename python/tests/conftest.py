import pytest
from web3 import Web3

from tests.constants import ENDPOINT, EUROPA_ENDPOINT


@pytest.fixture(scope='session')
def provider():
    """Returns a SKALE Manager instance with provider from config"""
    provider = Web3.HTTPProvider(ENDPOINT)
    return provider

@pytest.fixture(scope='session')
def europa_provider():
    """Returns a SKALE Manager instance with provider from config"""
    provider = Web3.HTTPProvider(EUROPA_ENDPOINT)
    return provider
