
import { ListedNetwork, Network } from "./network";
import { Provider as EthersProvider } from "@ethersproject/providers";
import { Metadata } from "./metadata";
import { ethers } from "ethers";

export class SkaleContracts {
    metadata = new Metadata();

    getNetworkByChainId (chainId: number) {
        return this.getNetworkByProvider(ethers.getDefaultProvider(chainId));
    }

    async getNetworkByProvider (provider: EthersProvider) {
        const { chainId } = await provider.getNetwork();
        await this.metadata.download();
        const networkMetadata = this.metadata.networks.
            find((metadata) => metadata.chainId === chainId);
        if (typeof networkMetadata === "undefined") {
            return new Network(
                this,
                provider
            );
        }
        return new ListedNetwork(
            this,
            provider,
            networkMetadata.path
        );
    }
}
