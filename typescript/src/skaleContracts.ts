import { Adapter } from "./adapter";
import { ListedNetwork } from "./listedNetwork";
import { Metadata } from "./metadata";
import { Network } from "./network";


export class SkaleContracts<ContractType, InterfaceType> {
    metadata = new Metadata();

    async getNetworkByAdapter (adapter: Adapter<ContractType, InterfaceType>) {
        const chainId = await adapter.getChainId();
        await this.metadata.download();
        const networkMetadata = this.metadata.networks.
            find((metadata) => BigInt(metadata.chainId) === chainId);
        if (typeof networkMetadata === "undefined") {
            return new Network(
                this,
                adapter
            );
        }
        return new ListedNetwork(
            this,
            adapter,
            networkMetadata.path
        );
    }
}
