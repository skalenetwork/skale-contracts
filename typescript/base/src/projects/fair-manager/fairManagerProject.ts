import { ContractAddressMap, MainContractAddress } from "../../domain/types";
import {
    FairManagerContractName,
    FairManagerInstance
} from "./fairManagerInstance";
import { Instance } from "../../instance";
import { Project } from "../../project";

export class FairManagerProject<ContractType> extends
    Project<ContractType, FairManagerContractName> {
    githubRepo = "https://github.com/skalenetwork/fair-manager/";

    mainContractName = "Committee";

    createInstance (address: MainContractAddress | ContractAddressMap)
        : Instance<ContractType, FairManagerContractName> {
        return new FairManagerInstance(
            this,
            address
        );
    }

    getAbiFilename (version: string) {
        return `${this.metadata.name}-${version}-abi.json`;
    }
}
