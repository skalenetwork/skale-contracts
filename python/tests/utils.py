"""Module with common functions for tests"""

from eth_typing import Address
from web3 import HTTPProvider, Web3

from skale_contracts.constants import PREDEPLOYED_ALIAS
from skale_contracts.skale_contracts import SkaleContracts
from skale_contracts.project_factory import SkaleProject


def is_contract_address(provider: HTTPProvider, address: Address) -> bool:
    """Checks if a given address corresponds to a valid contract"""

    code = Web3(provider).eth.get_code(address)
    return code not in (b'', b'\x00')


def assert_cached_files_created(
    alias: str,
    skale_contracts: SkaleContracts,
    project_name: SkaleProject,
    network_path: str,
    version: str
) -> None:
    """asserts all cache data was created during a test run"""

    if alias != PREDEPLOYED_ALIAS:
        assert skale_contracts.cache.instance_data(
            project_name, network_path, alias
        ) is not None
    assert skale_contracts.cache.abi(
        project_name,
        version
    ) is not None
    assert skale_contracts.cache.metadata() is not None
