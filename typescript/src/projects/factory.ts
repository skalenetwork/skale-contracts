import { Network } from "../network";
import { Project } from "../project";
import { SkaleManagerProject } from "./skale-manager/skaleManagerProject";

const skale_manager = "skale-manager";export const projects = {
    skaleManager: {
        name: "skale-manager",
        path: "skale-manager"
    }
}

class ProjectNotFoundError extends Error
{}

class ProjectFactory {
    create(network: Network, name: string): Project {
        if (name === projects.skaleManager.name) {
            return new SkaleManagerProject(network, projects.skaleManager)
        } else {
            throw new ProjectNotFoundError(`Project with name ${name} is unknown`);
        }
    }
}

export const projectFactory = new ProjectFactory();
