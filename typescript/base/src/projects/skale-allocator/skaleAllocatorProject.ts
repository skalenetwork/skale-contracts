import { ContractAddressMap, MainContractAddress } from "../../domain/types";
import {
    SkaleAllocatorContractName,
    SkaleAllocatorInstance
} from "./skaleAllocatorInstance";
import { Instance } from "../../instance";
import { Project } from "../../project";


export class SkaleAllocatorProject<ContractType> extends
    Project<ContractType, SkaleAllocatorContractName> {
    githubRepo = "https://github.com/skalenetwork/skale-allocator/";

    mainContractName = "SkaleAllocator";

    createInstance (address: MainContractAddress | ContractAddressMap)
        : Instance<ContractType, SkaleAllocatorContractName> {
        return new SkaleAllocatorInstance(
            this,
            address
        );
    }

    getAbiFilename (version: string) {
        return `${this.metadata.name}-${version}-abi.json`;
    }
}
