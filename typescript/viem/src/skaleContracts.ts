import { GetContractReturnType, PublicClient, Abi as ViemAbi } from 'viem';
import {
    Instance as BaseInstance
} from "@skalenetwork/skale-contracts/lib/instance";
import {
    SkaleContracts as BaseSkaleContracts
} from "@skalenetwork/skale-contracts";
import { ViemAdapter } from './viemAdapter';

export type Instance = BaseInstance<GetContractReturnType<ViemAbi, { public: PublicClient }>>;

export class SkaleContracts extends BaseSkaleContracts<GetContractReturnType<ViemAbi, { public: PublicClient }>> {
    getNetworkByProvider(client: PublicClient) {
        return this.getNetworkByAdapter(new ViemAdapter(client));
    }
}

export const skaleContracts = new SkaleContracts();