import { BaseContract, ethers } from "ethers";
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

export abstract class Instance {
    private project: Project;

    address: MainContractAddress;

    abi: SkaleABIFile | undefined;

    version: string | undefined;

    constructor (project: Project, address: MainContractAddress) {
        this.project = project;
        this.address = address;
    }

    get provider () {
        return this.project.network.provider;
    }

    abstract getContractAddress(name: ContractName): Promise<ContractAddress>;

    async getContract (name: ContractName) {
        const abi = await this.getAbi();
        return new ethers.Contract(
            await this.getContractAddress(name),
            abi[name],
            this.provider
        ) as BaseContract;
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
