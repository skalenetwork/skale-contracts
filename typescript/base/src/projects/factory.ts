import { MainnetImaProject } from "./ima/mainnet/MainnetImaProject";
import { Network } from "../network";
import { Project } from "../project";
import {
    ProjectNotFoundError
} from "../domain/errors/project/projectNotFoundError";
import { SkaleManagerProject } from "./skale-manager/skaleManagerProject";


export const projects = {
    "mainnetIma": {
        "name": "mainnet-ima",
        "path": "mainnet-ima"
    },
    "skaleManager": {
        "name": "skale-manager",
        "path": "skale-manager"
    }
};

export const createProject =
    function createProject<ContractType> (
        network: Network<ContractType>,
        name: string
    ): Project<ContractType> {
        if (name === projects.skaleManager.name) {
            return new SkaleManagerProject<ContractType>(
                network,
                projects.skaleManager
            );
        } else if (name === projects.mainnetIma.name) {
            return new MainnetImaProject<ContractType>(
                network,
                projects.mainnetIma
            );
        }
        throw new ProjectNotFoundError(`Project with name ${name} is unknown`);
    };
