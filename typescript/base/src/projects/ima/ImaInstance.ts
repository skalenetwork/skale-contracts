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

export abstract class ImaInstance<ContractType> extends
    Instance<ContractType> {
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
