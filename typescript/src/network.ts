import { SkaleContracts } from "./skaleContracts";
import { ProjectFactory } from "./projects/factory";
import { Provider } from "@ethersproject/providers"

export class NetworkNotFoundError extends Error
{}

export class Network {
    private _skaleContracts: SkaleContracts;
    private _provider: Provider;

    constructor(skaleContracts: SkaleContracts, provider: Provider) {
        this._provider = provider;
        this._skaleContracts = skaleContracts;
    }

    get provider() {
        return this._provider;
    }

    async getProject(name: string) {
        return ProjectFactory.create(this, name);
    }
}

export class ListedNetwork extends Network {
    private _path;

    constructor(skaleContracts: SkaleContracts, provider: Provider, path: string) {
        super(skaleContracts, provider);
        this._path = path;
    }

    get path() {
        return this._path;
    }
}
