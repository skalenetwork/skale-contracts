import { ContractAddressMap, MainContractAddress } from "../../domain/types";
import { Instance } from "../../instance";
import { Project } from "../../project";
import { SkaleAllocatorInstance } from "./skaleAllocatorInstance";

export class SkaleAllocatorProject<ContractType> extends
    Project<ContractType> {
    githubRepo = "https://github.com/skalenetwork/skale-allocator/";

    mainContractName = "SkaleAllocator";

    createInstance (address: MainContractAddress | ContractAddressMap)
        : Instance<ContractType> {
        return new SkaleAllocatorInstance(
            this,
            address
        );
    }

    getAbiFilename (version: string) {
        return `${this.metadata.name}-${version}-abi.json`;
    }
}
