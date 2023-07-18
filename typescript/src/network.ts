import { ProjectFactory } from "./projects/factory";
import { Provider } from "@ethersproject/providers";
import { SkaleContracts } from "./skaleContracts";

export class Network {
    private skaleContracts: SkaleContracts;

    private networkProvider: Provider;

    constructor (skaleContracts: SkaleContracts, provider: Provider) {
        this.networkProvider = provider;
        this.skaleContracts = skaleContracts;
    }

    get provider () {
        return this.networkProvider;
    }

    getProject (name: string) {
        return ProjectFactory.create(
            this,
            name
        );
    }
}
