import { ImaProject } from "../ImaProject";
import { Instance } from "../../../instance";
import { PREDEPLOYED_ALIAS } from "../../../domain/constants";
import { SchainImaInstance } from "./SchainImaInstance";

export class SchainImaProject<ContractType> extends
    ImaProject<ContractType> {
    getAbiFilename (version: string) {
        return `${this.metadata.name}-${version}-abi.json`;
    }

    getInstance (aliasOrAddress: string) {
        if (aliasOrAddress === PREDEPLOYED_ALIAS) {
            return this.createInstance(SchainImaInstance.PREDEPLOYED.
                get("MessageProxyForSchain")!);
        }
        return super.getInstance(aliasOrAddress);
    }

    createInstance (address: string): Instance<ContractType> {
        return new SchainImaInstance(
            this,
            address
        );
    }
}
