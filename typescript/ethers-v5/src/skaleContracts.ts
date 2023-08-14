import { BaseContract, ethers } from "ethers";
import {
    SkaleContracts as BaseSkaleContracts
} from "@skalenetwork/skale-contracts";
import { Ethers5Adapter } from "./ethers5Adapter";
import { Provider } from "@ethersproject/providers";


export class SkaleContracts extends BaseSkaleContracts<BaseContract> {
    getNetworkByChainId (chainId: number) {
        return this.getNetworkByProvider(ethers.getDefaultProvider(chainId));
    }

    getNetworkByProvider (provider: Provider) {
        return this.getNetworkByAdapter(new Ethers5Adapter(provider));
    }
}
