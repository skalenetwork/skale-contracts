import { Network } from "../network";
import { Project } from "../project";
import {
    ProjectNotFoundError
} from "../domain/errors/project/projectNotFoundError";
import { SkaleManagerProject } from "./skale-manager/skaleManagerProject";

export const projects = {
    "skaleManager": {
        "name": "skale-manager",
        "path": "skale-manager"
    }
};

export const createProject =
    function createProject<ContractType, InterfaceType> (
        network: Network<ContractType, InterfaceType>,
        name: string
    ): Project<ContractType, InterfaceType> {
        if (name === projects.skaleManager.name) {
            return new SkaleManagerProject<ContractType, InterfaceType>(
                network,
                projects.skaleManager
            );
        }
        throw new ProjectNotFoundError(`Project with name ${name} is unknown`);
    };
