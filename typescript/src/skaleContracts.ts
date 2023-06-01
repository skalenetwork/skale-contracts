import { Metadata } from "./metadata";
import { Network } from "./network";

export class SkaleContracts {
    metadata = new Metadata();

    async getNetworks() {
        await this.metadata.download();
        return this.metadata.networks.map(metadata => new Network(metadata));
    }
}