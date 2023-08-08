import { Instance } from "../../instance";
import { Project } from "../../project";
import { SkaleManagerInstance } from "./skaleManagerInstance";

export class SkaleManagerProject<ContractType, InterfaceType> extends
    Project<ContractType, InterfaceType> {
    githubRepo = "https://github.com/skalenetwork/skale-manager/";

    createInstance (address: string): Instance<ContractType, InterfaceType> {
        return new SkaleManagerInstance(
            this,
            address
        );
    }

    getAbiFilename (version: string) {
        return `${this.metadata.name}-${version}-abi.json`;
    }
}
