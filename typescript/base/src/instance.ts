import {
    ContractAddress,
    ContractName,
    MainContractAddress,
    SkaleABIFile
} from "./domain/types";
import { Project } from "./project";

export type InstanceData = {
    [contractName: string]: MainContractAddress
}

const defaultVersionAbi = [
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

export abstract class Instance<ContractType> {
    protected project: Project<ContractType>;

    address: MainContractAddress;

    abi: SkaleABIFile | undefined;

    version: string | undefined;

    constructor (
        project: Project<ContractType>,
        address: MainContractAddress
    ) {
        this.project = project;
        this.address = address;
    }

    get adapter () {
        return this.project.network.adapter;
    }

    abstract getContractAddress(
        name: ContractName,
        args?: unknown[]
    ): Promise<ContractAddress>;

    async getContract (name: ContractName) {
        return this.adapter.createContract(
            await this.getContractAddress(name),
            await this.getContractAbi(name)
        );
    }

    // Protected

    protected queryVersion () {
        return this.project.network.adapter.makeCall(
            {
                "abi": defaultVersionAbi,
                "address": this.address
            },
            {
                "args": [],
                "functionName": "version"
            }
        ) as Promise<string>;
    }

    protected async getContractAbi (contractName: string) {
        const abi = await this.getAbi();
        return abi[contractName];
    }

    // Private

    private async getVersion () {
        if (typeof this.version === "undefined") {
            this.version = await this.queryVersion();
            if (!this.version.includes("-")) {
                this.version = `${this.version}-stable.0`;
            }
        }
        return this.version;
    }

    private async getAbi () {
        if (typeof this.abi === "undefined") {
            this.abi =
                await this.project.downloadAbiFile(await this.getVersion());
        }
        return this.abi;
    }
}
