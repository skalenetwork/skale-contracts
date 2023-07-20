"""Module connects skale-manager project to the SKALE contracts library"""

from ..instance import Instance
from ..project import Project

SKALE_MANAGER_ABI = [
    {
        "inputs": [],
        "name": "contractManager",
        "outputs": [{ "internalType": "contract IContractManager", "name": "", "type": "address" }],
        "stateMutability": "view", "type": "function"
    },
    {
        "type": "function",
        "name": "version",
        "constant": True,
        "stateMutability": "view",
        "payable": False,
        "inputs": [],
        "outputs": [ { "type": "string", "name": "" } ]
    }
]

CONTRACT_MANAGER_ABI = [
    {
        "inputs": [{ "internalType": "string", "name": "name", "type": "string" }],
        "name": "getContract",
        "outputs": [{ "internalType": "address", "name": "contractAddress", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    }
]

class SkaleManagerInstance(Instance):
    """Represents instance of skale-manager"""
    def __init__(self, project: Project, address: str) -> None:
        super().__init__(project, address)
        self.skale_manager = self.web3.eth.contract(address=address, abi=SKALE_MANAGER_ABI)
        contract_manager_address = self.skale_manager.functions.contractManager().call()
        self.contract_manager = self.web3.eth.contract(
            address=contract_manager_address,
            abi=CONTRACT_MANAGER_ABI
        )
        self.custom_names = {
            'BountyV2': 'Bounty'
        }

    def _get_version(self):
        return self.skale_manager.functions.version().call()

    def get_contract_address(self, name: str):
        return self.contract_manager.functions.getContract(self._actual_name(name)).call()

    def _actual_name(self, name: str):
        if name in self.custom_names:
            return self.custom_names[name]
        return name


class SkaleManagerProject(Project):
    """Represents skale-manager project"""

    @property
    def github_repo(self):
        return 'https://github.com/skalenetwork/skale-manager/'

    def create_instance(self, address: str) -> Instance:
        return SkaleManagerInstance(self, address)

    def get_abi_filename(self, version: str):
        return f'skale-manager-{version}-abi.json'
