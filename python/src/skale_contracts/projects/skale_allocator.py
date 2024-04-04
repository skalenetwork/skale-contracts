"""Module connects skale-allocator project to the SKALE contracts library"""

from __future__ import annotations
from typing import TYPE_CHECKING
from eth_utils.address import to_canonical_address

from skale_contracts.instance import Instance
from skale_contracts.project import Project


if TYPE_CHECKING:
    from eth_typing import Address, ChecksumAddress


class SkaleAllocatorInstance(Instance):
    """Represents instance of skale-allocator"""
    def __init__(self, project: Project, address: Address) -> None:
        super().__init__(project, address)
        self.allocator = self.get_contract("Allocator")

    def get_contract_address(
            self,
            name: str,
            *args: str | Address | ChecksumAddress
    ) -> Address:
        if name == 'Allocator':
            return self.address
        if name == 'Escrow':
            if len(args) > 0:
                beneficiary = args[0]
                if self.web3.is_address(beneficiary):
                    return self._get_escrow(to_canonical_address(beneficiary))
            raise ValueError('Beneficiary is not set')
        raise ValueError(f'Contract ${name} is not found')

    def _get_escrow(self, beneficiary: Address) -> Address:
        return to_canonical_address(
            self.allocator.functions.getEscrowAddress(beneficiary).call()
        )


class SkaleAllocatorProject(Project):
    """Represents skale-allocator project"""

    @staticmethod
    def name() -> str:
        return 'skale-allocator'

    @property
    def github_repo(self) -> str:
        return 'https://github.com/skalenetwork/skale-allocator/'

    def create_instance(self, address: Address) -> Instance:
        return SkaleAllocatorInstance(self, address)

    def get_abi_filename(self, version: str) -> str:
        return f'skale-allocator-{version}-abi.json'
