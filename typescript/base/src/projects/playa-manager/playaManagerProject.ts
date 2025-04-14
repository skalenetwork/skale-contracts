import { ContractAddressMap, MainContractAddress } from "../../domain/types";
import { Instance } from "../../instance";
import { PlayaManagerInstance } from "./playaManagerInstance";
import { Project } from "../../project";

export class PlayaManagerProject<ContractType> extends
    Project<ContractType> {
    githubRepo = "https://github.com/skalenetwork/playa-manager/";

    mainContractName = "Committee";

    createInstance (address: MainContractAddress | ContractAddressMap)
        : Instance<ContractType> {
        return new PlayaManagerInstance(
            this,
            address
        );
    }

    getAbiFilename (version: string) {
        return `${this.metadata.name}-${version}-abi.json`;
    }
}
