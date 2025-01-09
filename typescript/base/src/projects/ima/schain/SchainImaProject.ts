import {
    ContractAddress,
    ContractAddressMap,
    MainContractAddress
} from "../../../domain/types";
import { ImaProject } from "../ImaProject";
import { Instance } from "../../../instance";
import { PREDEPLOYED_ALIAS } from "../../../domain/constants";
import { SchainImaInstance } from "./SchainImaInstance";

export class SchainImaProject<ContractType> extends
    ImaProject<ContractType> {
    mainContractName = "MessageProxyForSchain";

    getAbiFilename (version: string) {
        return `${this.metadata.name}-${version}-abi.json`;
    }

    getInstance (
        aliasOrAddress: string | MainContractAddress | ContractAddressMap
    ) {
        if (aliasOrAddress === PREDEPLOYED_ALIAS) {
            return this.createInstance(SchainImaInstance.PREDEPLOYED.
                get("MessageProxyForSchain")! as ContractAddress);
        }
        return super.getInstance(aliasOrAddress);
    }

    createInstance (address: MainContractAddress | ContractAddressMap)
        : Instance<ContractType> {
        return new SchainImaInstance(
            this,
            address
        );
    }
}
