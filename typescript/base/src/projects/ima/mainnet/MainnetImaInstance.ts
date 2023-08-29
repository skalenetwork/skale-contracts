import { ContractData } from "../../../adapter";
import { ImaInstance } from "../ImaInstance";


const contractManagerAbi = [
    {
        "constant": true,
        "inputs": [
            {
                "name": "name",
                "type": "string"
            }
        ],
        "name": "getContract",
        "outputs": [
            {
                "name": "contractAddress",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];


export class MainnetImaInstance<ContractType> extends
    ImaInstance<ContractType> {
    private contractManager: ContractData | undefined;

    async getContractAddress (name: string): Promise<string> {
        if (name === "MessageProxyForMainnet") {
            return Promise.resolve(this.address);
        } else if (name === "CommunityPool") {
            return this.project.network.adapter.makeCall(
                {
                    "abi": await this.getContractAbi("MessageProxyForMainnet"),
                    "address":
                        await this.getContractAddress("MessageProxyForMainnet")
                },
                {
                    "args": [],
                    "functionName": "communityPool"
                }
            ) as Promise<string>;
        }
        throw new Error("Method not implemented.");
    }

    // Private

    private async getContractManager () {
        if (typeof this.contractManager === "undefined") {
            const contractManagerAddress =
                await this.project.network.adapter.makeCall(
                    {
                        "abi":
                            await this.getContractAbi("MessageProxyForMainnet"),
                        "address": this.address
                    },
                    {
                        "args": [],
                        "functionName": "contractManagerOfSkaleManager"
                    }
                ) as string;
            this.contractManager = {
                "abi": contractManagerAbi,
                "address": contractManagerAddress
            };
        }
        return this.contractManager;
    }
}
