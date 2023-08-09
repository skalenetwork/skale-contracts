import {
    ContractAddress,
    ContractName
} from "../../domain/types";
import { Instance } from "../../instance";


const skaleManagerAbi = [
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

export class SkaleManagerInstance<ContractType> extends
    Instance<ContractType> {
    customNames = new Map<string, string>([
        [
            "BountyV2",
            "Bounty"
        ]
    ]);

    async queryVersion () {
        return await this.callSkaleManager(
            "version",
            []
        ) as string;
    }

    async getContractAddress (name: ContractName): Promise<ContractAddress> {
        const contractManagerAbi =
                await this.getContractAbi("ContractManager"),
            contractManagerAddress = await this.callSkaleManager(
                "contractManager",
                []
            ) as string;

        return await this.project.network.adapter.makeCall(
            {
                "abi": contractManagerAbi,
                "address": contractManagerAddress
            },
            {
                "args": [this.actualName(name)],
                "functionName": "getContract"
            }
        ) as string;
    }

    // Private

    private actualName (name: ContractName) {
        if (this.customNames.has(name)) {
            return this.customNames.get(name) as string;
        }
        return name;
    }

    private callSkaleManager (functionName: string, args: unknown[]) {
        return this.project.network.adapter.makeCall(
            {
                "abi": skaleManagerAbi,
                "address": this.address
            },
            {
                args,
                functionName
            }
        );
    }
}
