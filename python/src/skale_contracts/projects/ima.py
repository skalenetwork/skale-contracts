"""Module connects IMA to the SKALE contracts library"""

from __future__ import annotations
from typing import TYPE_CHECKING
from eth_utils.address import to_canonical_address

from skale_contracts.constants import PREDEPLOYED_ALIAS
from skale_contracts.instance import Instance, DEFAULT_GET_VERSION_FUNCTION
from skale_contracts.project import Project

from .skale_manager import CONTRACT_MANAGER_ABI


if TYPE_CHECKING:
    from eth_typing import Address, ChecksumAddress
    from web3.contract.contract import Contract

MESSAGE_PROXY_ABI = [
    DEFAULT_GET_VERSION_FUNCTION
]


class ImaInstance(Instance):
    """Represents instance of IMA"""
    def __init__(self, project: Project, address: Address) -> None:
        super().__init__(project, address)
        self.message_proxy = self.web3.eth.contract(
            address=address,
            abi=MESSAGE_PROXY_ABI
        )


class ImaProject(Project):
    """Represents IMA project"""

    @property
    def github_repo(self) -> str:
        return 'https://github.com/skalenetwork/ima/'


class MainnetImaInstance(ImaInstance):
    """Represents IMA instance on mainnet"""

    def __init__(self, project: Project, address: Address) -> None:
        super().__init__(project, address)
        self._contract_manager: Contract | None = None

    def get_contract_address(
            self,
            name: str, *args: str | Address | ChecksumAddress
    ) -> Address:
        if name == 'MessageProxyForMainnet':
            return self.address
        if name == 'CommunityPool':
            return to_canonical_address(
                self.get_contract("MessageProxyForMainnet")
                    .functions.communityPool().call()
            )
        return to_canonical_address(
            self.contract_manager.functions.getContract(name).call()
        )

    @property
    def contract_manager(self) -> Contract:
        """ContractManager contract of a skale-manager instance
associated with the IMA"""
        if self._contract_manager is None:
            self._contract_manager = self.web3.eth.contract(
                address=to_canonical_address(
                    self.get_contract("MessageProxyForMainnet")
                        .functions.contractManagerOfSkaleManager().call()
                ),
                abi=CONTRACT_MANAGER_ABI
            )
        return self._contract_manager


class MainnetImaProject(ImaProject):
    """Represents mainnet part of IMA project"""

    @staticmethod
    def name() -> str:
        return 'mainnet-ima'

    def create_instance(self, address: Address) -> Instance:
        return MainnetImaInstance(self, address)

    def get_abi_filename(self, version: str) -> str:
        return f'mainnet-ima-{version}-abi.json'


class SchainImaInstance(ImaInstance):
    """Represents IMA instance on schain"""

    PREDEPLOYED: dict[str, Address] = {
        name: to_canonical_address(address) for name, address in {
            'ProxyAdmin':
                '0xd2aAa00000000000000000000000000000000000',
            'MessageProxyForSchain':
                '0xd2AAa00100000000000000000000000000000000',
            'KeyStorage':
                '0xd2aaa00200000000000000000000000000000000',
            'CommunityLocker':
                '0xD2aaa00300000000000000000000000000000000',
            'TokenManagerEth':
                '0xd2AaA00400000000000000000000000000000000',
            'TokenManagerERC20':
                '0xD2aAA00500000000000000000000000000000000',
            'TokenManagerERC721':
                '0xD2aaa00600000000000000000000000000000000',
            'TokenManagerLinker':
                '0xD2aAA00800000000000000000000000000000000',
            'TokenManagerERC1155':
                '0xD2aaA00900000000000000000000000000000000',
            'TokenManagerERC721WithMetadata':
                '0xd2AaA00a00000000000000000000000000000000',
            'EthErc20':
                '0xD2Aaa00700000000000000000000000000000000'
        }.items()}

    def get_contract_address(
            self,
            name: str,
            *args: str | Address | ChecksumAddress
    ) -> Address:
        if name in self.PREDEPLOYED:
            return self.PREDEPLOYED[name]
        raise RuntimeError(f"Can't get address of {name} contract")


class SchainImaProject(ImaProject):
    """Represents schain part of IMA project"""

    @staticmethod
    def name() -> str:
        return 'schain-ima'

    def get_instance(self, alias_or_address: str) -> Instance:
        if alias_or_address == PREDEPLOYED_ALIAS:
            return self.create_instance(
                SchainImaInstance.PREDEPLOYED['MessageProxyForSchain']
            )
        return super().get_instance(alias_or_address)

    def create_instance(self, address: Address) -> Instance:
        return SchainImaInstance(self, address)

    def get_abi_filename(self, version: str) -> str:
        return f'schain-ima-{version}-abi.json'
