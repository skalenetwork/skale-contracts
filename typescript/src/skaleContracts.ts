import { Provider, ethers } from "ethers";
import { Metadata } from "./metadata";
import { Network } from "./network";

class NetworkNotFoundError extends Error
{}

export class SkaleContracts {
    metadata = new Metadata();
    provider: Provider;

    constructor(provider = ethers.getDefaultProvider(ethers.Network.from("mainnet")) ) {
        this.provider = provider;
    }

    async getNetworks() {
        await this.metadata.download();
        return this.metadata.networks.map(metadata => new Network(this, metadata));
    }

    async getNetworkByChainId(chainId: number) {
        await this.metadata.download();
        const networkMetadata = this.metadata.networks.find(metadata => metadata.chainId == chainId);
        if (networkMetadata === undefined) {
            throw new NetworkNotFoundError(`Network with chainId ${chainId} is unknown`);
        } else {
            return new Network(this, networkMetadata);
        }
    }
}