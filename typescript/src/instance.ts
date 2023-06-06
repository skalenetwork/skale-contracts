import { MainContractAddress } from "./domain/types";
import { Project } from "./project";

export type InstanceData = {
    [contractName: string]: MainContractAddress
}

export class Instance {
    private _project: Project;
    address: MainContractAddress;

    constructor (project: Project, address: MainContractAddress) {
        this._project = project;
        this.address = address;
    }
}