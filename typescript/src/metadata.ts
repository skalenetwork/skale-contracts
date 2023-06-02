import axios from 'axios';
import { METADATA_FILENAME, REPOSITORY_URL } from './domain/constants';

export type NetworkMetadata = {
    name: string;
    chainId: number;
    folder: string;
}

type MetadataFile = {
    networks: NetworkMetadata[];
}

class MetadataIsNotDownloaded extends Error {

}

export class Metadata {
    private _networks: NetworkMetadata[] | undefined;
    
    constructor() {
    }

    get networks(): NetworkMetadata[] {
        if (this._networks !== undefined) {
            return this._networks;
        } else {
            throw new MetadataIsNotDownloaded("download() method has to be called");
        }
    }

    async download() {
        if (this._networks === undefined) {
            const metadataResponse = await axios.get(REPOSITORY_URL + METADATA_FILENAME);
            const metadata = metadataResponse.data as MetadataFile;
            this._networks = metadata.networks;
        }
    }
}