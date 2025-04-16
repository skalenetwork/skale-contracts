import {
    ContractAddress,
    ContractName,
    MainContractAddress
} from "../../domain/types";
import { Instance } from "../../instance";

export class MirageManagerInstance<ContractType> extends
    Instance<ContractType> {
    async queryVersion () {
        return await this.project.network.adapter.makeCall(
            {
                "abi": [
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
                ],
                "address": this.mainContractAddress
            },
            {
                "args": [],
                "functionName": "version"
            }
        ) as string;
    }

    async getContractAddress (name: ContractName): Promise<ContractAddress> {
        if (name === "MirageAccessManager") {
            return await this.callCommittee(
                "authority",
                []
            ) as MainContractAddress;
        }
        if (name === "Committee") {
            return this.mainContractAddress;
        }
        const abi = await this.getContractAbi(this.project.mainContractName);
        const hasFunc = abi.find((item) => item.type === "function" &&
            item.stateMutability === "view" &&
            item.name === name.toLowerCase());
        if (hasFunc) {
            return await this.callCommittee(
                name.toLowerCase(),
                []
            ) as MainContractAddress;
        }
        throw new Error(
            `Contract name ${name} does not exist in mirage-manager`
        );
    }

    private async callCommittee (functionName: string, args: unknown[]) {
        return this.project.network.adapter.makeCall(
            {
                "abi": await this.getContractAbi(this.project.mainContractName),
                "address": this.mainContractAddress
            },
            {
                args,
                functionName
            }
        );
    }
}
