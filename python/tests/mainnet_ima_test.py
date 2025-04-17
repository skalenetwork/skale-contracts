from .utils import is_contract_address
import skale_contracts
from skale_contracts.projects.ima import MainnetImaContract, MainnetImaProject


def test_main(provider):

    network = skale_contracts.SkaleContracts().get_network_by_provider(provider)

    project = MainnetImaProject(network)

    instance = project.get_instance("production")

    for name in MainnetImaContract:
        address = instance.get_contract_address(name)
        assert is_contract_address(provider, address)

