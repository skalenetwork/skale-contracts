import { Instance } from "../../instance";
import { Project } from "../../project";
import { SkaleAllocatorInstance } from "./skaleAllocatorInstance";

export class SkaleAllocatorProject<ContractType> extends
    Project<ContractType> {
    githubRepo = "https://github.com/skalenetwork/skale-manager/";

    createInstance (address: string): Instance<ContractType> {
        return new SkaleAllocatorInstance(
            this,
            address
        );
    }

    getAbiFilename (version: string) {
        return `${this.metadata.name}-${version}-abi.json`;
    }
}
