"""Module with fixtures for tests"""

# cspell:words autouse testsfailed

from pathlib import Path
from typing import Generator
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


@pytest.fixture(scope='session', autouse=True)
def cleanup_cache_files(
    request: pytest.FixtureRequest
) -> Generator[None, None, None]:
    """
    Clean up all sc-*.json cache files after successful test session
    """
    yield  # All tests run here

    # Only cleanup if tests passed (for debugging failed tests)
    if request.session.testsfailed == 0:
        cache_dir = Path(".pytest_cache")
        prefix = "sc-"

        if cache_dir.exists():
            for cache_file in cache_dir.glob(f"{prefix}*.json"):
                cache_file.unlink()
    else:
        print(f"Tests failed ({request.session.testsfailed} failures) - "
              "skipping cache cleanup for debugging")
