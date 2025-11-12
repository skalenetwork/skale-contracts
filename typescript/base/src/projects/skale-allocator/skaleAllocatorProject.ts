import { ContractAddressMap, MainContractAddress } from "../../domain/types";
import {
    SkaleAllocatorContractName,
    SkaleAllocatorDefaultTypesMap,
    SkaleAllocatorInstance
} from "./skaleAllocatorInstance";
import { Project } from "../../project";


export class SkaleAllocatorProject<ContractType> extends
    Project<ContractType, SkaleAllocatorContractName> {
    githubRepo = "https://github.com/skalenetwork/skale-allocator/";

    mainContractName = "SkaleAllocator";

    createInstance<
        TypesMap extends Record<SkaleAllocatorContractName, ContractType>=
            SkaleAllocatorDefaultTypesMap<ContractType>
    > (address: MainContractAddress | ContractAddressMap)
        : SkaleAllocatorInstance<ContractType, TypesMap> {
        return new SkaleAllocatorInstance<ContractType, TypesMap>(
            this,
            address
        );
    }

    getInstance<
        TypesMap extends Record<SkaleAllocatorContractName, ContractType>=
            SkaleAllocatorDefaultTypesMap<ContractType>
        > (
        target: string | MainContractAddress | ContractAddressMap
    ): SkaleAllocatorInstance<ContractType, TypesMap> {
        return super.getInstance<TypesMap>(
            target
        ) as SkaleAllocatorInstance<ContractType, TypesMap>;
    }

    getAbiFilename (version: string) {
        return `${this.metadata.name}-${version}-abi.json`;
    }
}
