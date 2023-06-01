import { NetworkMetadata } from "./metadata";

export class Network {
    private _metadata: NetworkMetadata;

    constructor(metadata: NetworkMetadata) {
        this._metadata = metadata;
    }
}