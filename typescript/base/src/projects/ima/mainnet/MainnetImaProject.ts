import { ContractAddressMap, MainContractAddress } from "../../../domain/types";
import {
    MainnetImaContract,
    MainnetImaContractName,
    MainnetImaInstance
} from "./MainnetImaInstance";
import { ImaProject } from "../ImaProject";
import { Instance } from "../../../instance";

export class MainnetImaProject<ContractType> extends
    ImaProject<ContractType, MainnetImaContractName> {
    mainContractName = MainnetImaContract.MESSAGE_PROXY_FOR_MAINNET;

    getAbiFilename (version: string) {
        return `${this.metadata.name}-${version}-abi.json`;
    }

    createInstance (address: MainContractAddress | ContractAddressMap)
        : Instance<ContractType, MainnetImaContractName> {
        return new MainnetImaInstance(
            this,
            address
        );
    }
}
