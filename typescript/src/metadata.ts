import axios from 'axios';
import { METADATA_FILENAME, REPOSITORY_URL } from './domain/constants';

export type NetworkMetadata = {
    name: string;
    chainId: bigint;
    path: string;
}

export type ProjectMetadata = {
    name: string;
    path: string;
}

type MetadataFile = {
    networks: NetworkMetadata[];
    projects: ProjectMetadata[];
}

class MetadataIsNotDownloaded extends Error {

}

export class Metadata {
    private _networks: NetworkMetadata[] | undefined;
    private _projects: ProjectMetadata[] | undefined;

    constructor() {
    }

    get networks(): NetworkMetadata[] {
        if (this._networks !== undefined) {
            return this._networks;
        } else {
            throw new MetadataIsNotDownloaded("download() method has to be called");
        }
    }

    get projects(): ProjectMetadata[] {
        if (this._projects !== undefined) {
            return this._projects
        } else {
            throw new MetadataIsNotDownloaded("download() method has to be called");
        }
    }

    async download() {
        if (this._networks === undefined) {
            const metadataResponse = await axios.get(REPOSITORY_URL + METADATA_FILENAME);
            const metadata = metadataResponse.data as MetadataFile;
            this._networks = metadata.networks;
            this._projects = metadata.projects;
        }
    }
}
