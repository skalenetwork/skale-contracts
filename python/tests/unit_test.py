"""Module with unit tests for skale-contract projects"""

from unittest.mock import patch, PropertyMock
import pytest
from eth_utils.address import to_canonical_address
from web3 import BaseProvider, HTTPProvider

from skale_contracts.constants import PREDEPLOYED_ALIAS
from skale_contracts.instance import Instance
from skale_contracts.network import Network
from skale_contracts.projects.skale_allocator import SkaleAllocatorContract
from skale_contracts import skale_contracts
from skale_contracts.project_factory import SkaleProject, create_project

from .constants import \
    EUROPA_PROJECTS, MAINNET_PROJECTS, \
    SCHAIN_NOT_PREDEPLOYED
from .utils import is_contract_address


@pytest.mark.parametrize("mainnet_project", MAINNET_PROJECTS)
def test_mainnet_instances(
    mainnet_provider: HTTPProvider,
    mainnet_project: SkaleProject
) -> None:
    """Tests instances deployed on mainnet"""

    network = skale_contracts.get_network_by_provider(mainnet_provider)
    project = create_project(network, mainnet_project)
    alias = "production" \
        if mainnet_project != SkaleProject.ERC1820 else "predeployed"

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
