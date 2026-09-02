import { PublicClient, WalletClient } from 'viem';
import { ViemAdapter, ViemContract } from './viemAdapter';
import {
    Instance as BaseInstance
} from "@skalenetwork/skale-contracts/lib/instance";
import {
    SkaleContracts as BaseSkaleContracts
} from "@skalenetwork/skale-contracts";
import {
    SkaleContractNames
} from '@skalenetwork/skale-contracts/lib/projects/factory';


export type Instance = BaseInstance<ViemContract, SkaleContractNames>;

export class SkaleContracts extends BaseSkaleContracts<ViemContract> {
    getNetworkByProvider(client: PublicClient, walletClient?: WalletClient) {
        return this.getNetworkByAdapter(new ViemAdapter(client, walletClient));
    }
}

export const skaleContracts = new SkaleContracts();
