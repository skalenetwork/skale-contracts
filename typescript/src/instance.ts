import { Contract } from "./contracts";
import { ContractName, MainContractAddress } from "./domain/types";
import { Project } from "./project";

export type InstanceData = {
    [contractName: string]: MainContractAddress
}

export abstract class Instance {
    private _project: Project;
    address: MainContractAddress;

    constructor (project: Project, address: MainContractAddress) {
        this._project = project;
        this.address = address;
    }

    get provider () {
        return this._project.network.provider;
    }

    abstract getContract(name: ContractName): Promise<Contract>;
}