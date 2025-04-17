from .utils import is_contract_address
import skale_contracts
from skale_contracts.projects.marionette import MarionetteContract, MarionetteProject


def test_main(europa_provider):

    network = skale_contracts.SkaleContracts().get_network_by_provider(europa_provider)

    project = MarionetteProject(network)

    instance = project.get_instance("predeployed")

    address = instance.get_contract_address(MarionetteContract.MARIONETTE)
    assert is_contract_address(europa_provider, address)

