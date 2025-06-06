import { Account, Chain, PublicClient, RpcSchema, Transport } from 'viem';
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
    getNetworkByProvider(
        client: PublicClient<Transport, Chain, Account, RpcSchema>
    ) {
        return this.getNetworkByAdapter(new ViemAdapter(client));
    }
}

export const skaleContracts = new SkaleContracts();
