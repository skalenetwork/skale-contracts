from instance import Instance
from project import Project

SKALE_MANAGER_ABI = [
    { "inputs": [], "name": "contractManager", "outputs": [{ "internalType": "contract IContractManager", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
    { "type": "function", "name": "version", "constant": True, "stateMutability": "view", "payable": False, "inputs": [], "outputs": [ { "type": "string", "name": "" } ] }
]

CONTRACT_MANAGER_ABI = [
    { "inputs": [{ "internalType": "string", "name": "name", "type": "string" }], "name": "getContract", "outputs": [{ "internalType": "address", "name": "contractAddress", "type": "address" }], "stateMutability": "view", "type": "function" }
]

class SkaleManagerInstance(Instance):
    def __init__(self, project: Project, address: str) -> None:
        super().__init__(project, address)
        self.skale_manager = self.w3.Contract(address=address, abi=SKALE_MANAGER_ABI)
        contract_manager_address = self.skaleManager.contractManager()
        self.contract_manager = self.w3.Contract(address=contract_manager_address, abi=CONTRACT_MANAGER_ABI)
        self.customNames = {
            'BountyV2': 'Bounty'
        }

    def _get_version(self):
        return self.skaleManager.version()

    def get_contract_address(self, name: str):
        return self.contract_manager.getContract(self._actualName(name))

    def _actualName(self, name: str):
        if name in self.customNames:
            return self.customNames[name]
        else:
            return name
