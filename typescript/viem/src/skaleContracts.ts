import { ViemAdapter, ViemContract } from './viemAdapter';
import {
    Instance as BaseInstance
} from "@skalenetwork/skale-contracts/lib/instance";
import {
    SkaleContracts as BaseSkaleContracts
} from "@skalenetwork/skale-contracts";
import { PublicClient } from 'viem';


export type Instance = BaseInstance<ViemContract>;

export class SkaleContracts extends BaseSkaleContracts<ViemContract> {
    getNetworkByProvider(client: PublicClient) {
        return this.getNetworkByAdapter(new ViemAdapter(client));
    }
}

export const skaleContracts = new SkaleContracts();