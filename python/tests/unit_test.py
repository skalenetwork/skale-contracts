"""Module with unit tests for skale-contract projects"""

from unittest.mock import patch

import pytest
from eth_utils.address import to_canonical_address
from web3 import HTTPProvider

import requests.exceptions

from skale_contracts.network import ListedNetwork
from skale_contracts.constants import PREDEPLOYED_ALIAS
from skale_contracts.projects.skale_allocator import SkaleAllocatorContract
from skale_contracts.skale_contracts import SkaleContracts
from skale_contracts.project_factory import SkaleProject, create_project

from .constants import \
    EUROPA_PROJECTS, MAINNET_PROJECTS, \
    SCHAIN_NOT_PREDEPLOYED
from .utils import assert_cached_files_created, is_contract_address

# instantiate with memory cache activated
skale_contracts = SkaleContracts(
    cache_dir=".pytest_cache", cleanup_cache=False
)


@pytest.mark.parametrize("mainnet_project", MAINNET_PROJECTS)
def test_mainnet_instances(
    mainnet_provider: HTTPProvider,
    mainnet_project: SkaleProject
) -> None:
    """Tests instances deployed on mainnet"""

    network = skale_contracts.get_network_by_provider(mainnet_provider)
    project = create_project(network, mainnet_project)
    alias = "production" \
        if mainnet_project != SkaleProject.ERC1820 else PREDEPLOYED_ALIAS

    instance = project.get_instance(alias)
    for name in instance.contract_names:
        if name == SkaleAllocatorContract.ESCROW:
            args = [
                instance.get_contract_address(SkaleAllocatorContract.ALLOCATOR)
            ]
            contract = instance.get_contract(name, *args)
            continue
        contract = instance.get_contract(name)
        assert is_contract_address(
            mainnet_provider,
            to_canonical_address(contract.address)
        )

    # Assert files were cached
    assert_cached_files_created(
        alias, skale_contracts, project.name(),
        network.as_listed().path, alias
    )


@pytest.mark.parametrize("schain_project", EUROPA_PROJECTS)
def test_europa_instances(
    europa_provider: HTTPProvider,
    schain_project: SkaleProject
) -> None:
    """Tests instances deployed on europa schain"""

    network = skale_contracts.get_network_by_provider(europa_provider)
    project = create_project(network, schain_project)
    alias = PREDEPLOYED_ALIAS \
        if schain_project not in SCHAIN_NOT_PREDEPLOYED else "production"
    instance = project.get_instance(alias)
    for name in instance.contract_names:
        contract = instance.get_contract(name)
        assert is_contract_address(
            europa_provider,
            to_canonical_address(contract.address)
        )

    # Assert files were cached
    assert_cached_files_created(
        alias, skale_contracts, project.name(),
        network.as_listed().path, alias
    )


def test_skale_contracts_offline() -> None:
    """Tests that it can instantiate skale-contracts offline"""
    # Mock requests.get to simulate no internet connection
    with patch('skale_contracts.metadata.requests.get') as mock_get:
        mock_get.side_effect = \
            requests.exceptions.ConnectionError("No internet")

        # This should work because metadata is already cached
        offline_skale_contracts = SkaleContracts(
            cache_dir=".pytest_cache", cleanup_cache=False
        )

        # Verify it used cached data
        assert offline_skale_contracts.metadata is not None
        assert len(offline_skale_contracts.metadata.networks) > 0

        # Verify the mock was NOT called (used cache)
        assert mock_get.call_count == 0


@pytest.mark.parametrize("mainnet_project", MAINNET_PROJECTS)
def test_mainnet_instances_offline(
    mainnet_provider: HTTPProvider,
    mainnet_project: SkaleProject
) -> None:
    """Tests creation of mainnet instances offline"""
    alias = "production" \
        if mainnet_project != SkaleProject.ERC1820 else PREDEPLOYED_ALIAS
    with patch('skale_contracts.project.requests.get') as mock_get:
        # Don't even try the network call
        mock_get.side_effect = \
            requests.exceptions.ConnectionError("No internet")
        network = ListedNetwork(skale_contracts, mainnet_provider, "mainnet")
        project = create_project(network, mainnet_project)
        instance = project.get_instance(alias)
        # abi loaded offline
        assert instance.abi is not None
        if alias != PREDEPLOYED_ALIAS:
            alias_data = skale_contracts.cache.instance_data(
                project.name(), network.as_listed().path, alias
            )
            assert alias_data is not None
        # Verify the mock was NOT called (used cache)
        assert mock_get.call_count == 0
