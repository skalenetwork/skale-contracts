import {
    ContractAddress,
    ContractAddressMap,
    MainContractAddress
} from "../../../domain/types";
import {
    SchainImaContract,
    SchainImaContractName,
    SchainImaDefaultTypesMap,
    SchainImaInstance
} from "./SchainImaInstance";

import { ImaProject } from "../ImaProject";
import {
    PREDEPLOYED_ALIAS
} from "../../../domain/constants";

export class SchainImaProject<ContractType> extends
    ImaProject<ContractType, SchainImaContractName> {
    mainContractName = SchainImaContract.MESSAGE_PROXY_FOR_SCHAIN;

    getAbiFilename (version: string) {
        return `${this.metadata.name}-${version}-abi.json`;
    }

    getInstance <
        TypesMap extends Record<SchainImaContractName, ContractType>=
            SchainImaDefaultTypesMap<ContractType>
    > (
        aliasOrAddress:
            | SchainImaContractName
            | MainContractAddress
            | ContractAddressMap
            | typeof PREDEPLOYED_ALIAS
    ) {
        if (aliasOrAddress === PREDEPLOYED_ALIAS) {
            return this.createInstance<TypesMap>(SchainImaInstance.PREDEPLOYED.
                get(this.mainContractName)! as ContractAddress);
        }
        return (
            super.getInstance(aliasOrAddress) as SchainImaInstance<
                ContractType,
                TypesMap
            >
        );
    }

    createInstance <
        TypesMap extends Record<
            SchainImaContractName,
            ContractType
        > = SchainImaDefaultTypesMap<ContractType>
    > (address: MainContractAddress | ContractAddressMap)
        : SchainImaInstance<ContractType, TypesMap> {
        return new SchainImaInstance<ContractType, TypesMap>(
            this,
            address
        );
    }
}
