import { NetworkMetadata } from "./metadata";
import { Project } from "./project";
import { SkaleContracts } from "./skaleContracts";

class ProjectNotFoundError extends Error
{}

export class Network {
    private _metadata: NetworkMetadata;
    private _skaleContracts: SkaleContracts;

    constructor(skaleContracts: SkaleContracts, metadata: NetworkMetadata) {
        this._metadata = metadata;
        this._skaleContracts = skaleContracts;
    }

    get path() {
        return this._metadata.path;
    }

    get provider() {
        return this._skaleContracts.provider;
    }

    async getProject(name: string) {
        const metadata = this._skaleContracts.metadata;
        await metadata.download();
        const projectMetadata = metadata.projects.find(project => project.name == name);
        if (projectMetadata === undefined) {
            throw new ProjectNotFoundError(`Project with name ${name} is unknown`);
        } else {
            return new Project(this, projectMetadata);
        }        
    }
}