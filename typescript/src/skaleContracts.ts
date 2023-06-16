import { Provider, ethers } from "ethers";
import { Metadata } from "./metadata";
import { Network } from "./network";

class NetworkNotFoundError extends Error
{}

export class SkaleContracts {
    metadata = new Metadata();

    async getNetworks() {
        await this.metadata.download();
        return this.metadata.networks.map(metadata => new Network(
            this,
            ethers.getDefaultProvider(ethers.Network.from(metadata.chainId)),
            metadata));
    }

    async getNetworkByChainId(chainId: number, provider = ethers.getDefaultProvider(ethers.Network.from(chainId))) {
        await this.metadata.download();
        const networkMetadata = this.metadata.networks.find(metadata => metadata.chainId == chainId);
        if (networkMetadata === undefined) {
            throw new NetworkNotFoundError(`Network with chainId ${chainId} is unknown`);
        } else {
            return new Network(this, provider, networkMetadata);
        }
    }
}
