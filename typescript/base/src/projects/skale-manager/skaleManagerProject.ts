import { ContractAddressMap, MainContractAddress } from "../../domain/types";
import {
    SkaleManagerContract,
    SkaleManagerContractName,
    SkaleManagerInstance
} from "./skaleManagerInstance";
import { Instance } from "../../instance";
import { Project } from "../../project";

export class SkaleManagerProject<ContractType> extends
    Project<ContractType, SkaleManagerContractName> {
    githubRepo = "https://github.com/skalenetwork/skale-manager/";

    mainContractName = SkaleManagerContract.SKALE_MANAGER;

    createInstance (address: MainContractAddress | ContractAddressMap)
        : Instance<ContractType, SkaleManagerContractName> {
        return new SkaleManagerInstance(
            this,
            address
        );
    }

    getAbiFilename (version: string) {
        return `${this.metadata.name}-${version}-abi.json`;
    }
}
