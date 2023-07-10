import { ethers } from "ethers";
import { Contract } from "ethers";
import { Instance } from "../../instance";
import { ContractAddress, ContractName, MainContractAddress } from "../../domain/types";
import { Project } from "../../project";


const skaleManagerAbi = [
    { "inputs": [], "name": "contractManager", "outputs": [{ "internalType": "contract IContractManager", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
    { "type": "function", "name": "version", "constant": true, "stateMutability": "view", "payable": false, "inputs": [], "outputs": [ { "type": "string", "name": "" } ] }
]

const contractManagerAbi = [
    { "inputs": [{ "internalType": "string", "name": "name", "type": "string" }], "name": "getContract", "outputs": [{ "internalType": "address", "name": "contractAddress", "type": "address" }], "stateMutability": "view", "type": "function" }
]

export class SkaleManagerInstance extends Instance {
    skaleManager: Contract;

    customNames = new Map<string, string>([
        ["BountyV2", "Bounty"]
    ]);

    constructor (project: Project, address: MainContractAddress) {
        super(project, address);
        this.skaleManager = new ethers.Contract(this.address, skaleManagerAbi, this.provider);
    }

    async _getVersion() {
        return await this.skaleManager.version() as string;
    }

    async getContractAddress(name: ContractName): Promise<ContractAddress> {
        const contractManagerAddress = await this.skaleManager.contractManager() as string;
        const contractManager = new ethers.Contract(contractManagerAddress, contractManagerAbi, this.provider);
        return await contractManager.getContract(this._actualName(name));
    }

    _actualName(name: ContractName) {
        if (this.customNames.has(name)) {
            return this.customNames.get(name);
        } else {
            return name;
        }
    }
}
