"""Module with common functions for tests"""

from eth_typing import Address
from web3 import HTTPProvider, Web3


def is_contract_address(provider: HTTPProvider, address: Address) -> bool:
    """Checks if a given address corresponds to a valid contract"""

    code = Web3(provider).eth.get_code(address)
    return code not in (b'', b'\x00')
