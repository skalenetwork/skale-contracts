import * as semver from "semver";
import {
    ContractAddressMap,
    MainContractAddress,
    SkaleABIFile,
} from "./domain/types";
import { Instance, InstanceData } from "./instance";
import axios, { HttpStatusCode } from "axios";
import { InstanceNotFound } from "./domain/errors/instance/instanceNotFound";
import { ListedNetwork } from "./listedNetwork";
import { Network } from "./network";
import { NetworkNotFoundError } from "./domain/errors/network/networkNotFoundError";
import { ProjectMetadata } from "./metadata";
import { REPOSITORY_URL } from "./domain/constants";

const alternativeVersionsGenerator = function* alternativeVersionsGenerator(
    version: string,
) {
    const semVersion = semver.parse(version);
    const wordIndex = 0;
    const nextIndex = 1;
    if (semVersion?.prerelease[wordIndex] === "stable") {
        for (let prereleaseVersion = 0; ; prereleaseVersion += nextIndex) {
            semVersion.prerelease = ["rc", prereleaseVersion];
            yield semVersion.format();
        }
    }
};

export abstract class Project<ContractType> {
    protected metadata: ProjectMetadata;

    network: Network<ContractType>;

    abstract githubRepo: string;

    abstract mainContractName: string;

    constructor(network: Network<ContractType>, metadata: ProjectMetadata) {
        this.network = network;
        this.metadata = metadata;
    }

    getInstance(target: string | MainContractAddress | ContractAddressMap) {
        if (
            this.network.adapter.isAddress(target) ||
            this.isContractAddressMap(target)
        ) {
            return this.getInstanceByAddress(target);
        }
        return this.getInstanceByAlias(target);
    }

    async downloadAbiFile(version: string) {
        const exceptions: string[] = [];
        let abiFile = await this.downloadAbiFileByVersion(version, exceptions);
        if (abiFile !== null) {
            return abiFile;
        }

        // Stable version can be absent for some time after upgrade.
        // Try release candidate branch
        abiFile = await this.downloadAlternativeAbiFile(version, exceptions);

        if (abiFile !== null) {
            return abiFile;
        }
        throw new Error(exceptions.join(""));
    }

    getAbiUrls(version: string) {
        return [
            this.getGithubReleaseAbiUrl(version),
            this.getGithubRepositoryAbiUrl(version),
        ];
    }

    abstract getAbiFilename(version: string): string;

    getInstanceDataUrl(alias: string) {
        if (this.network instanceof ListedNetwork) {
            return (
                `${REPOSITORY_URL}${this.network.path}/` +
                `${this.metadata.path}/${alias}.json`
            );
        }
        throw new NetworkNotFoundError("Network is unknown");
    }

    abstract createInstance(
        address: MainContractAddress | ContractAddressMap,
    ): Instance<ContractType>;

    public isContractAddressMap = (obj: unknown): obj is ContractAddressMap => {
        if (typeof obj !== "object" || obj === null) {
            return false;
        }

        return Object.entries(obj).every(
            ([key, value]) =>
                typeof key === "string" &&
                typeof value === "string" &&
                this.network.adapter.isAddress(value),
        );
    };

    // Private

    private getInstanceByAddress(
        address: MainContractAddress | ContractAddressMap,
    ) {
        return this.createInstance(address);
    }

    private async getInstanceByAlias(alias: string) {
        const response = await axios.get(this.getInstanceDataUrl(alias));
        if (response.status === HttpStatusCode.Ok) {
            const [address] = Object.values(response.data as InstanceData);
            return this.createInstance(address);
        }
        throw new InstanceNotFound(`Can't download data for instance ${alias}`);
    }

    private getGithubReleaseAbiUrl(version: string) {
        return (
            `${this.githubRepo}releases/download/` +
            `${version}/${this.getAbiFilename(version)}`
        );
    }

    private getGithubRepositoryAbiUrl(version: string) {
        return `${this.githubRepo.replace(
            "github.com",
            "raw.githubusercontent.com",
        )}abi/${this.getAbiFilename(version)}`;
    }

    private async downloadAbiFileByVersion(
        version: string,
        exceptions: string[],
    ) {
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
        return null;
    }

    private async downloadAlternativeAbiFile(
        version: string,
        exceptions: string[],
    ) {
        let abiFile: SkaleABIFile | null = null;
        for (const alternativeVersion of alternativeVersionsGenerator(
            version,
        )) {
            // Await expression must be executed sequentially
            // eslint-disable-next-line no-await-in-loop
            const alternativeAbiFile = await this.downloadAbiFileByVersion(
                alternativeVersion,
                exceptions,
            );
            if (alternativeAbiFile === null) {
                // If abiFile is null
                // the previous one is the latest
                break;
            } else {
                abiFile = alternativeAbiFile;
            }
        }
        return abiFile;
    }
}
