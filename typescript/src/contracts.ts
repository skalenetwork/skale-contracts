import { ContractAddress, ContractName } from "./domain/types";
import { Instance } from "./instance";

export class Contract {
    private _instance: Instance;
    name: ContractName;
    address: ContractAddress;

    constructor(instance: Instance, name: ContractName, address: ContractAddress) {
        this._instance = instance;
        this.name = name;
        this.address = address
    }
}