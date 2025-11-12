import { ContractAddressMap, MainContractAddress } from "../../domain/types";
import {
    FairManagerContractName,
    FairManagerDefaultTypesMap,
    FairManagerInstance
} from "./fairManagerInstance";
import { Project } from "../../project";

export class FairManagerProject<
    ContractType
> extends Project<ContractType, FairManagerContractName> {
    githubRepo = "https://github.com/skalenetwork/fair-manager/";

    mainContractName = "Committee";

    createInstance<
        TypesMap extends Record<FairManagerContractName, ContractType> =
            FairManagerDefaultTypesMap<ContractType>
    > (address: MainContractAddress | ContractAddressMap)
        : FairManagerInstance<ContractType, TypesMap> {
        return new FairManagerInstance<ContractType, TypesMap>(
            this,
            address
        );
    }

    getInstance<
        TypesMap extends Record<FairManagerContractName, ContractType> =
            FairManagerDefaultTypesMap<ContractType>
    > (
        target: string | MainContractAddress | ContractAddressMap
    ): FairManagerInstance<ContractType, TypesMap> {
        return super.getInstance<TypesMap>(
            target
        ) as FairManagerInstance<ContractType, TypesMap>;
    }

    getAbiFilename (version: string) {
        return `${this.metadata.name}-${version}-abi.json`;
    }
}
