import { Instance } from "../../instance";


const messageProxyAbi = [
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

export abstract class ImaInstance<
    ContractType,
    ContractName extends string,
    TypesMap extends Record<ContractName, ContractType> = Record<
        ContractName,
        ContractType
    >
> extends Instance<ContractType, ContractName, TypesMap> {
    async queryVersion () {
        return await this.callMessageProxy(
            "version",
            []
        ) as string;
    }

    // Private

    private callMessageProxy (functionName: string, args: unknown[]) {
        return this.project.network.adapter.makeCall(
            {
                "abi": messageProxyAbi,
                "address": this.mainContractAddress
            },
            {
                args,
                functionName
            }
        );
    }
}
