import { Instance, InstanceData } from "./instance";
import { MainContractAddress, SkaleABIFile } from "./domain/types";
import axios, { HttpStatusCode } from "axios";
import { InstanceNotFound } from "./domain/errors/instance/instanceNotFound";
import { ListedNetwork } from "./listedNetwork";
import { Network } from "./network";
import {
    NetworkNotFoundError
} from "./domain/errors/network/networkNotFoundError";
import { ProjectMetadata } from "./metadata";
import { REPOSITORY_URL } from "./domain/constants";

export abstract class Project<ContractType> {
    protected metadata: ProjectMetadata;

    network: Network<ContractType>;

    abstract githubRepo: string;

    constructor (
        network: Network<ContractType>,
        metadata: ProjectMetadata
    ) {
        this.network = network;
        this.metadata = metadata;
    }

    getInstance (aliasOrAddress: string) {
        if (this.network.adapter.isAddress(aliasOrAddress)) {
            return this.getInstanceByAddress(aliasOrAddress);
        }
        return this.getInstanceByAlias(aliasOrAddress);
    }

    async downloadAbiFile (version: string) {
        const exceptions: string[] = [];
        for (const abiUrl of this.getAbiUrls(version)) {
            try {
                // Await expression should be executed only
                // when it failed on the previous iteration
                // eslint-disable-next-line no-await-in-loop
                const response = await axios.get(abiUrl);
                return response.data as SkaleABIFile;
            } catch (exception) {
                exceptions.push(`\nDownloading from ${abiUrl} - ${exception}`);
            }
        }
        throw new Error(exceptions.join(""));
    }

    getAbiUrls (version: string) {
        return [
            `${this.githubRepo}releases/download/` +
                `${version}/${this.getAbiFilename(version)}`,
            `${this.githubRepo.replace(
                "github.com",
                "raw.githubusercontent.com"
            )}abi/${this.getAbiFilename(version)}`
        ];
    }

    abstract getAbiFilename(version: string): string;

    getInstanceDataUrl (alias: string) {
        if (this.network instanceof ListedNetwork) {
            return `${REPOSITORY_URL}${this.network.path}/` +
                `${this.metadata.path}/${alias}.json`;
        }
        throw new NetworkNotFoundError("Network is unknown");
    }

    abstract createInstance(address: MainContractAddress):
        Instance<ContractType>;

    // Private

    private getInstanceByAddress (address: string) {
        return this.createInstance(address);
    }

    private async getInstanceByAlias (alias: string) {
        const response = await axios.get(this.getInstanceDataUrl(alias));
        if (response.status === HttpStatusCode.Ok) {
            const [address] = Object.values(response.data as InstanceData);
            return this.createInstance(address);
        }
        throw new InstanceNotFound(`Can't download data for instance ${alias}`);
    }
}
