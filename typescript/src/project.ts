import axios from "axios";
import { REPOSITORY_URL } from "./domain/constants";
import { ProjectMetadata } from "./metadata";
import { ListedNetwork, Network, NetworkNotFoundError } from "./network";
import { Instance, InstanceData } from "./instance";
import { MainContractAddress, SkaleABIFile } from "./domain/types";

class InstanceNotFound extends Error {}

export abstract class Project {
    private _metadata: ProjectMetadata;
    network: Network;
    abstract githubRepo: string;

    constructor(network: Network, metadata: ProjectMetadata) {
        this.network = network;
        this._metadata = metadata;
    }

    async getInstance(alias: string) {
        const url = this.getInstanceDataUrl(alias);
        const response = await axios.get(url);
        if (response.status !== 200) {
            throw new InstanceNotFound(`Can't download data for instance ${alias}`);
        } else {
            const data = response.data as InstanceData;
            const keys = Object.keys(data);
            if (keys.length !== 1) {
                throw new InstanceNotFound(`Error during parsing data for ${alias}`);
            }
            return this.createInstance(data[keys[0]]);
        }
    }

    async downloadAbiFile(version: string) {
        const response = await axios.get(this.getAbiUrl(version));
        return JSON.parse(response.data) as SkaleABIFile;
    }

    getAbiUrl(version: string) {
        return `${this.githubRepo}releases/download/${version}/${this.getAbiFilename(version)}`;
    }

    abstract getAbiFilename(version: string): string;

    getInstanceDataUrl(alias: string) {
        if (this.network instanceof ListedNetwork) {
            return `${REPOSITORY_URL}${this.network.path}/${this._metadata.path}/${alias}.json`;
        } else {
            throw new NetworkNotFoundError(`Network is unknown`);
        }
    }

    abstract createInstance(address: MainContractAddress): Instance;
}
