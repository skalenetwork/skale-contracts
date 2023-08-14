import { Instance } from "../../instance";
import { Project } from "../../project";
import { SkaleManagerInstance } from "./skaleManagerInstance";

export class SkaleManagerProject<ContractType> extends
    Project<ContractType> {
    githubRepo = "https://github.com/skalenetwork/skale-manager/";

    createInstance (address: string): Instance<ContractType> {
        return new SkaleManagerInstance(
            this,
            address
        );
    }

    getAbiFilename (version: string) {
        return `${this.metadata.name}-${version}-abi.json`;
    }
}
