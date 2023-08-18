import { BaseContract, Provider, ethers } from "ethers";
import {
    SkaleContracts as BaseSkaleContracts
} from "@skalenetwork/skale-contracts";
import { Ethers6Adapter } from "./ethers6Adapter";


export class SkaleContracts extends BaseSkaleContracts<BaseContract> {
    getNetworkByChainId (chainId: number) {
        return this.getNetworkByProvider(ethers.getDefaultProvider(chainId));
    }

    getNetworkByProvider (provider: Provider) {
        return this.getNetworkByAdapter(new Ethers6Adapter(provider));
    }
}
