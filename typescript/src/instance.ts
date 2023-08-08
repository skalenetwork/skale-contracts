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

export abstract class Instance<ContractType, InterfaceType> {
    protected project: Project<ContractType, InterfaceType>;

    address: MainContractAddress;

    abi: SkaleABIFile<InterfaceType> | undefined;

    version: string | undefined;

    constructor (
        project: Project<ContractType, InterfaceType>,
        address: MainContractAddress
    ) {
        this.project = project;
        this.address = address;
    }

    get adapter () {
        return this.project.network.adapter;
    }

    abstract getContractAddress(name: ContractName): Promise<ContractAddress>;

    async getContract (name: ContractName) {
        const abi = await this.getAbi();
        return this.adapter.createContract(
            await this.getContractAddress(name),
            abi[name]
        );
    }

    // Protected

    abstract queryVersion(): Promise<string>;

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
