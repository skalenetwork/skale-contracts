import { ContractAddress } from "../../../domain/types";
import { ContractData } from "../../../adapter";
import { ImaInstance } from "../ImaInstance";

export enum MainnetImaContract {
    MESSAGE_PROXY_FOR_MAINNET = "MessageProxyForMainnet",
    COMMUNITY_POOL = "CommunityPool",
    LINKER = "Linker",
    DEPOSIT_BOX_ETH = "DepositBoxEth",
    DEPOSIT_BOX_ERC20 = "DepositBoxERC20",
    DEPOSIT_BOX_ERC721 = "DepositBoxERC721",
    DEPOSIT_BOX_ERC1155 = "DepositBoxERC1155",
    DEPOSIT_BOX_ERC721_WITH_META = "DepositBoxERC721WithMetadata",
}
export type MainnetImaContractName = `${MainnetImaContract}`;


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
    ImaInstance<ContractType, MainnetImaContractName> {
    private contractManager: ContractData | undefined;

    contractNames =
        Object.values(MainnetImaContract) as MainnetImaContractName[];

    async getContractAddress (
        name: MainnetImaContractName
    ): Promise<ContractAddress> {
        if (
            !this.contractNames.includes(
                name
            )
        ) {
            throw new Error(
                `Contract name ${name} does not exist in mainnet-ima`
            );
        }
        if (name === MainnetImaContract.MESSAGE_PROXY_FOR_MAINNET) {
            return Promise.resolve(this.mainContractAddress);
        } else if (name === MainnetImaContract.COMMUNITY_POOL) {
            return this.project.network.adapter.makeCall(
                {
                    "abi": await this.getContractAbi(
                        MainnetImaContract.MESSAGE_PROXY_FOR_MAINNET
                    ),
                    "address":
                        await this.getContractAddress(
                            MainnetImaContract.MESSAGE_PROXY_FOR_MAINNET
                        )
                },
                {
                    "args": [],
                    "functionName": "communityPool"
                }
            ) as Promise<ContractAddress>;
        }
        return this.project.network.adapter.makeCall(
            await this.getContractManager(),
            {
                "args": [name],
                "functionName": "getContract"
            }
        ) as Promise<ContractAddress>;
    }

    // Private

    private async getContractManager () {
        if (typeof this.contractManager === "undefined") {
            const contractManagerAddress =
                await this.project.network.adapter.makeCall(
                    {
                        "abi":
                            await this.getContractAbi(
                                MainnetImaContract.MESSAGE_PROXY_FOR_MAINNET
                            ),
                        "address": this.mainContractAddress
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
