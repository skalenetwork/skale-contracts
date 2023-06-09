import { BaseContract, ethers } from "ethers";
import { ContractAddress, ContractName, MainContractAddress, SkaleABIFile } from "./domain/types";
import { Project } from "./project";

export type InstanceData = {
    [contractName: string]: MainContractAddress
}

export abstract class Instance {
    private _project: Project;
    address: MainContractAddress;
    abi: SkaleABIFile | undefined;
    version: string | undefined;

    constructor (project: Project, address: MainContractAddress) {
        this._project = project;
        this.address = address;
    }

    get provider () {
        return this._project.network.provider;
    }

    abstract getContractAddress(name: ContractName): Promise<ContractAddress>;

    async getContract(name: ContractName) {
        const address = await this.getContractAddress(name);
        const abi = await this.getAbi();
        return new ethers.Contract(address, abi[name], this.provider) as BaseContract;
    }

    // protected

    abstract _getVersion(): Promise<string>;

    // private

    private async getVersion() {
        if (this.version === undefined) {
            this.version = await this._getVersion();
            if (!this.version.includes('-')) {
                this.version = this.version + '-stable.0';
            }
        }
        return this.version;
    }

    private async getAbi() {
        if (this.abi === undefined) {
            this.abi = await this._project.downloadAbiFile(await this.getVersion());
        }
        return this.abi;
    }
}
