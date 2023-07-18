import { Contract, ethers } from "ethers";
import {
    ContractAddress,
    ContractName,
    MainContractAddress
} from "../../domain/types";
import { Instance } from "../../instance";
import { Project } from "../../project";


const contractManagerAbi = [
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                }
            ],
            "name": "getContract",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "contractAddress",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ],
    skaleManagerAbi = [
        {
            "inputs": [],
            "name": "contractManager",
            "outputs": [
                {
                    "internalType": "contract IContractManager",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "version",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ];

export class SkaleManagerInstance extends Instance {
    skaleManager: Contract;

    customNames = new Map<string, string>([
        [
            "BountyV2",
            "Bounty"
        ]
    ]);

    constructor (project: Project, address: MainContractAddress) {
        super(
            project,
            address
        );
        this.skaleManager = new ethers.Contract(
            this.address,
            skaleManagerAbi,
            this.provider
        );
    }

    async queryVersion () {
        return await this.skaleManager.version() as string;
    }

    async getContractAddress (name: ContractName): Promise<ContractAddress> {
        const contractManager = new ethers.Contract(
            await this.skaleManager.contractManager() as string,
            contractManagerAbi,
            this.provider
        );
        return contractManager.getContract(this.actualName(name));
    }

    // Private

    private actualName (name: ContractName) {
        if (this.customNames.has(name)) {
            return this.customNames.get(name);
        }
        return name;
    }
}
