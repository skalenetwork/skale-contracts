import { ContractAddressMap, MainContractAddress } from "../../domain/types";
import {
    MirageManagerContractName,
    MirageManagerInstance
} from "./mirageManagerInstance";
import { Instance } from "../../instance";
import { Project } from "../../project";

export class MirageManagerProject<ContractType> extends
    Project<ContractType, MirageManagerContractName> {
    githubRepo = "https://github.com/skalenetwork/mirage-manager/";

    mainContractName = "Committee";

    createInstance (address: MainContractAddress | ContractAddressMap)
        : Instance<ContractType, MirageManagerContractName> {
        return new MirageManagerInstance(
            this,
            address
        );
    }

    getAbiFilename (version: string) {
        return `${this.metadata.name}-${version}-abi.json`;
    }
}
