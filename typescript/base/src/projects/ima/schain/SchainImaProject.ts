import {
    ContractAddress,
    ContractAddressMap,
    MainContractAddress
} from "../../../domain/types";
import {
    SchainImaContract,
    SchainImaContractName,
    SchainImaInstance
} from "./SchainImaInstance";

import { ImaProject } from "../ImaProject";
import { Instance } from "../../../instance";
import {
    PREDEPLOYED_ALIAS
} from "../../../domain/constants";

export class SchainImaProject<ContractType> extends
    ImaProject<ContractType> {
    mainContractName = SchainImaContract.PROXY_FOR_SCHAIN;

    getAbiFilename (version: string) {
        return `${this.metadata.name}-${version}-abi.json`;
    }

    getInstance (
        aliasOrAddress:
            | SchainImaContractName
            | MainContractAddress
            | ContractAddressMap
            | typeof PREDEPLOYED_ALIAS
    ) {
        if (aliasOrAddress === PREDEPLOYED_ALIAS) {
            return this.createInstance(SchainImaInstance.PREDEPLOYED.
                get(this.mainContractName)! as ContractAddress);
        }
        return (
            super.getInstance(aliasOrAddress) as SchainImaInstance<ContractType>
        );
    }

    createInstance (address: MainContractAddress | ContractAddressMap)
        : Instance<ContractType> {
        return new SchainImaInstance(
            this,
            address
        );
    }
}
