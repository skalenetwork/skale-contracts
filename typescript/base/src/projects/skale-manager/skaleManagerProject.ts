import { ContractAddressMap, MainContractAddress } from "../../domain/types";
import {
    SkaleManagerContract,
    SkaleManagerContractName,
    SkaleManagerDefaultTypesMap,
    SkaleManagerInstance
} from "./skaleManagerInstance";
import { Project } from "../../project";

export class SkaleManagerProject<ContractType> extends
    Project<ContractType, SkaleManagerContractName> {
    githubRepo = "https://github.com/skalenetwork/skale-manager/";

    mainContractName = SkaleManagerContract.SKALE_MANAGER;

    createInstance<
        TypesMap extends Record<SkaleManagerContractName, ContractType>=
            SkaleManagerDefaultTypesMap<ContractType>
    > (address: MainContractAddress | ContractAddressMap)
        : SkaleManagerInstance<ContractType, TypesMap> {
        return new SkaleManagerInstance<ContractType, TypesMap>(
            this,
            address
        );
    }

    getInstance<
        TypesMap extends Record<SkaleManagerContractName, ContractType>=
            SkaleManagerDefaultTypesMap<ContractType>
    > (
        target: string | MainContractAddress | ContractAddressMap
    ): SkaleManagerInstance<ContractType, TypesMap> {
        return super.getInstance<TypesMap>(
            target
        ) as SkaleManagerInstance<ContractType, TypesMap>;
    }

    getAbiFilename (version: string) {
        return `${this.metadata.name}-${version}-abi.json`;
    }
}
