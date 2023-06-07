import { ethers } from "ethers";
import { Contract } from "../contracts";
import { Instance } from "../instance";


const skaleManagerAbi = [
    { "inputs": [], "name": "contractManager", "outputs": [{ "internalType": "contract IContractManager", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }
]

const contractManagerAbi = [
    { "inputs": [{ "internalType": "string", "name": "name", "type": "string" }], "name": "getContract", "outputs": [{ "internalType": "address", "name": "contractAddress", "type": "address" }], "stateMutability": "view", "type": "function" }
]

export class SkaleManagerInstance extends Instance {
    async getContract(name: string): Promise<Contract> {
        const skaleManager = new ethers.Contract(this.address, skaleManagerAbi, this.provider);
        const contractManagerAddress = await skaleManager.contractManager() as string;
        const contractManager = new ethers.Contract(contractManagerAddress, contractManagerAbi, this.provider);
        return new Contract(this, name, await contractManager.getContract(name));
    }
}