import axios from "axios";
import { REPOSITORY_URL } from "./domain/constants";
import { ProjectMetadata } from "./metadata";
import { Network } from "./network";
import { Instance, InstanceData } from "./instance";

class InstanceNotFound extends Error {}

export class Project {
    private _metadata: ProjectMetadata;
    network: Network;
    
    constructor(network: Network, metadata: ProjectMetadata) {
        this.network = network;
        this._metadata = metadata;
    }

    async getInstance(alias: string) {
        const url = this.calculateInstanceDataUrl(alias);
        const response = await axios.get(url);
        if (response.status !== 200) {
            throw new InstanceNotFound(`Can't download data for instance ${alias}`);
        } else {
            const data = response.data as InstanceData;
            const keys = Object.keys(data);
            if (keys.length !== 1) {
                throw new InstanceNotFound(`Error during parsing data for ${alias}`);
            }
            return new Instance(this, data[keys[0]])
        }
    }

    calculateInstanceDataUrl(alias: string) {
        return `${REPOSITORY_URL}${this.network.path}/${this._metadata.path}/${alias}.json`;
    }
}
