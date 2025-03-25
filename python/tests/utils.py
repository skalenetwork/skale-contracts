from eth_typing import Address
from web3 import Web3


def is_contract_address(provider: Web3.HTTPProvider, address: Address):
    code = Web3(provider).eth.get_code(address)
    return code != b'' and code != b'\x00'
