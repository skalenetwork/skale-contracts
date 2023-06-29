import { NetworkMetadata } from "./metadata";
import { SkaleContracts } from "./skaleContracts";
import { projectFactory } from "./projects/factory";
import { Provider } from "@ethersproject/providers"

export class Network {
    private _metadata: NetworkMetadata;
    private _skaleContracts: SkaleContracts;
    private _provider: Provider;

    constructor(skaleContracts: SkaleContracts, provider: Provider, metadata: NetworkMetadata) {
        this._metadata = metadata;
        this._provider = provider;
        this._skaleContracts = skaleContracts;
    }

    get path() {
        return this._metadata.path;
    }

    get provider() {
        return this._provider;
    }

    async getProject(name: string) {
        return projectFactory.create(this, name);
    }
}
