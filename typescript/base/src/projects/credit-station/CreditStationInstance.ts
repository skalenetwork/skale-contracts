import { ContractAddress } from "../../domain/types";
import { Instance } from "../../instance";

export const ACCESS_MANAGER_NAME = "CreditStationAccessManager";

const GET_AUTHORITY_ABI = [
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
export abstract class CreditStationInstance<
    ContractType,
    ContractName extends string,
    TypesMap extends Record<ContractName, ContractType> = Record<
        ContractName,
        ContractType
    >
> extends Instance<ContractType, ContractName, TypesMap> {
    getContractAddress (
        name: ContractName
    ): Promise<ContractAddress> {
        if (name === ACCESS_MANAGER_NAME) {
            return this.getAccessManagerAddress();
        }
        return Promise.resolve(this.mainContractAddress);
    }


    // Private

    private getAccessManagerAddress (): Promise<ContractAddress> {
        return this.project.network.adapter.makeCall(
            {
                "abi": GET_AUTHORITY_ABI,
                "address": this.mainContractAddress
            },
            {
                "args": [],
                "functionName": "authority"
            }
        ) as Promise<ContractAddress>;
    }
}
