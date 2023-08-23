import { ImaProject } from "../ImaProject";
import { Instance } from "../../../instance";
import { MainnetImaInstance } from "./MainnetImaInstance";

export class MainnetImaProject<ContractType> extends
    ImaProject<ContractType> {
    getAbiFilename (version: string) {
        return `${this.metadata.name}-${version}-abi.json`;
    }

    createInstance (address: string): Instance<ContractType> {
        return new MainnetImaInstance(
            this,
            address
        );
    }
}
