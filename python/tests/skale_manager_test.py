from .utils import is_contract_address
import skale_contracts
from skale_contracts.projects.skale_manager import SkaleManagerContract, SkaleManagerInstance, SkaleManagerProject


def test_main(provider):

    network = skale_contracts.SkaleContracts().get_network_by_provider(provider)

    project = SkaleManagerProject(network)

    instance: SkaleManagerInstance = project.get_instance("production")

    for name in SkaleManagerContract:
        address = instance.get_contract_address(name)
        assert is_contract_address(provider, address)

