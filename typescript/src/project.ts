import { ProjectMetadata } from "./metadata";
import { Network } from "./network";

export class Project {
    private _metadata: ProjectMetadata;
    network: Network;
    
    constructor(network: Network, metadata: ProjectMetadata) {
        this.network = network;
        this._metadata = metadata;
    }
}
