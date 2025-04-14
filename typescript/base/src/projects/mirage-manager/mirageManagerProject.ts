import { ContractAddressMap, MainContractAddress } from "../../domain/types";
import { Instance } from "../../instance";
import { MirageManagerInstance } from "./mirageManagerInstance";
import { Project } from "../../project";

export class MirageManagerProject<ContractType> extends
    Project<ContractType> {
    githubRepo = "https://github.com/skalenetwork/mirage-manager/";

    mainContractName = "Committee";

    createInstance (address: MainContractAddress | ContractAddressMap)
        : Instance<ContractType> {
        return new MirageManagerInstance(
            this,
            address
        );
    }

    getAbiFilename (version: string) {
        return `${this.metadata.name}-${version}-abi.json`;
    }
}
