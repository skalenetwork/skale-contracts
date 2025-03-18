import { ContractAddressMap, MainContractAddress } from "../../../domain/types";
import { MainnetImaContract, MainnetImaInstance } from "./MainnetImaInstance";
import { ImaProject } from "../ImaProject";
import { Instance } from "../../../instance";

export class MainnetImaProject<ContractType> extends
    ImaProject<ContractType> {
    mainContractName = MainnetImaContract.PROXY_FOR_MAINNET;

    getAbiFilename (version: string) {
        return `${this.metadata.name}-${version}-abi.json`;
    }

    createInstance (address: MainContractAddress | ContractAddressMap)
        : Instance<ContractType> {
        return new MainnetImaInstance(
            this,
            address
        );
    }
}
