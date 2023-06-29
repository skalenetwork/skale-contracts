import { ethers } from "ethers";
import { Metadata } from "./metadata";
import { Network } from "./network";
import { BaseProvider } from "@ethersproject/providers";

class NetworkNotFoundError extends Error
{}

export class SkaleContracts {
    metadata = new Metadata();

    async getNetworks() {
        await this.metadata.download();
        return this.metadata.networks.map(metadata => new Network(
            this,
            ethers.getDefaultProvider(metadata.chainId),
            metadata));
    }

    async getNetworkByChainId(chainId: number, provider = ethers.getDefaultProvider(chainId)) {
        await this.metadata.download();
        const networkMetadata = this.metadata.networks.find(metadata => metadata.chainId == chainId);
        if (networkMetadata === undefined) {
            throw new NetworkNotFoundError(`Network with chainId ${chainId} is unknown`);
        } else {
            return new Network(this, provider, networkMetadata);
        }
    }

    async getNetworkByProvider(provider: BaseProvider) {
        return await this.getNetworkByChainId((await provider.getNetwork()).chainId, provider)
    }
}
