import {
    ContractAddress,
    ContractName,
    MainContractAddress
} from "../../domain/types";
import { Instance } from "../../instance";


const committeeAbi = [
    {
        "inputs": [],
        "name": "nodes",
        "outputs": [
            {
                "internalType": "contract INodes",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "status",
        "outputs": [
            {
                "internalType": "contract IStatus",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "dkg",
        "outputs": [
            {
                "internalType": "contract IDkg",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "authority",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

export class PlayaManagerInstance<ContractType> extends
    Instance<ContractType> {
    async queryVersion () {
        return await this.callCommittee(
            "version",
            []
        ) as string;
    }

    async getContractAddress (name: ContractName): Promise<ContractAddress> {
        switch (name) {
            case "Nodes":
                return await this.callCommittee(
                    "nodes",
                    []
                ) as MainContractAddress;
            case "Status":
                return await this.callCommittee(
                    "nodes",
                    []
                ) as MainContractAddress;
            case "Dkg":
                return await this.callCommittee(
                    "nodes",
                    []
                ) as MainContractAddress;
            case "Committee":
                return this.mainContractAddress;
            case "AccessManager":
                return await this.callCommittee(
                    "authority",
                    []
                ) as MainContractAddress;
            default:
                throw new Error(
                    `Contract name ${name} does not exist in playa-manager`
                );
        }
    }


    private callCommittee (functionName: string, args: unknown[]) {
        return this.project.network.adapter.makeCall(
            {
                "abi": committeeAbi,
                "address": this.mainContractAddress
            },
            {
                args,
                functionName
            }
        );
    }
}
