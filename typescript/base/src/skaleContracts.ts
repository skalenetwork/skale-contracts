import { Adapter } from "./adapter";
import { ListedNetwork } from "./listedNetwork";
import { Metadata } from "./metadata";
import { Network } from "./network";


export class SkaleContracts<ContractType> {
    metadata = new Metadata();

    async getNetworkByAdapter (adapter: Adapter<ContractType>) {
        const chainId = await adapter.getChainId();
        await this.metadata.download();
        const networkMetadata = this.metadata.networks.
            find((metadata) => BigInt(metadata.chainId) === chainId);
        if (typeof networkMetadata === "undefined") {
            return new Network<ContractType>(
                this,
                adapter
            );
        }
        return new ListedNetwork<ContractType>(
            this,
            adapter,
            networkMetadata.path
        );
    }
}
