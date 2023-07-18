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

export class ProjectFactory {
    static create (network: Network, name: string): Project {
        if (name === projects.skaleManager.name) {
            return new SkaleManagerProject(
                network,
                projects.skaleManager
            );
        }
        throw new ProjectNotFoundError(`Project with name ${name} is unknown`);
    }
}
