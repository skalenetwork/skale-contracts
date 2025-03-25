from .utils import is_contract_address
from skale_contracts.projects.skale_allocator import SkaleAllocatorContract, SkaleAllocatorProject
from tests.constants import ETH_PUBLIC_KEY
import skale_contracts


def test_main(provider):

    network = skale_contracts.SkaleContracts().get_network_by_provider(provider)

    project = SkaleAllocatorProject(network)

    instance = project.get_instance("production")

    allocator = instance.get_contract_address(SkaleAllocatorContract.ALLOCATOR)
    assert is_contract_address(provider, allocator)

    escrow = instance.get_contract_address(SkaleAllocatorContract.ESCROW, ETH_PUBLIC_KEY)

    #no escrow contract for random public key
    assert not is_contract_address(provider, escrow)

