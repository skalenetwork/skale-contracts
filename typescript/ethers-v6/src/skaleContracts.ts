import { BaseContract, Provider, ethers } from "ethers";
import { Instance as BaseInstance } from "@skalenetwork/skale-contracts/lib/instance";
import { SkaleContracts as BaseSkaleContracts } from "@skalenetwork/skale-contracts";
import { Ethers6Adapter } from "./ethers6Adapter";

export type Instance = BaseInstance<BaseContract>;

export class SkaleContracts extends BaseSkaleContracts<BaseContract> {
    getNetworkByChainId(chainId: number) {
        return this.getNetworkByProvider(ethers.getDefaultProvider(chainId));
    }

    getNetworkByProvider(provider: Provider) {
        return this.getNetworkByAdapter(new Ethers6Adapter(provider));
    }
}
