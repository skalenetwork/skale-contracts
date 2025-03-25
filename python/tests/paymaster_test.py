from .utils import is_contract_address
import skale_contracts
from skale_contracts.projects.paymaster import PaymasterContract, PaymasterProject


def test_main(europa_provider):

    network = skale_contracts.SkaleContracts().get_network_by_provider(europa_provider)

    project = PaymasterProject(network)

    instance = project.get_instance("production")

    for name in PaymasterContract:
        address = instance.get_contract_address(name)
        is_contract_address(europa_provider, address)

