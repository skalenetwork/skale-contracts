import { ethers } from "ethers";
import { Metadata } from "./metadata";
import { ListedNetwork, Network } from "./network";
import { Provider as EthersProvider } from "@ethersproject/providers";

export class SkaleContracts {
    metadata = new Metadata();

    async getNetworkByChainId(chainId: number) {
        return this.getNetworkByProvider(ethers.getDefaultProvider(chainId))
    }

    async getNetworkByProvider(provider: EthersProvider) {
        const chainId = (await provider.getNetwork()).chainId;
        await this.metadata.download();
        const networkMetadata = this.metadata.networks.find(metadata => metadata.chainId == chainId);
        if (networkMetadata === undefined) {
            return new Network(this, provider);
        } else {
            return new ListedNetwork(this, provider, networkMetadata.path);
        }
    }
}
