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

    getInstance (target: string | MainContractAddress | ContractAddressMap) {
        if (target === PREDEPLOYED_ALIAS) {
            return this.createInstance(SchainImaInstance.PREDEPLOYED.
                get("MessageProxyForSchain")! as ContractAddress);
        }
        return super.getInstance(target);
    }

    createInstance (target: MainContractAddress | ContractAddressMap)
        : Instance<ContractType> {
        return new SchainImaInstance(
            this,
            target
        );
    }
}
