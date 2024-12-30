import { ContractAddressMap, MainContractAddress } from "../../../domain/types";
import { ImaProject } from "../ImaProject";
import { Instance } from "../../../instance";
import { MainnetImaInstance } from "./MainnetImaInstance";

export class MainnetImaProject<ContractType> extends
    ImaProject<ContractType> {
    mainContractName = "MessageProxyForMainnet";

    getAbiFilename (version: string) {
        return `${this.metadata.name}-${version}-abi.json`;
    }

    createInstance (target: MainContractAddress | ContractAddressMap)
        : Instance<ContractType> {
        return new MainnetImaInstance(
            this,
            target
        );
    }
}
