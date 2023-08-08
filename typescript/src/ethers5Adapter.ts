import { Adapter, ContractData, FunctionCall } from "./adapter";
import { BaseContract, ethers } from "ethers";
import { Interface } from "ethers/lib/utils";
import { Provider } from "@ethersproject/providers";


export class Ethers5Adapter extends Adapter<BaseContract, Interface> {
    provider: Provider;

    constructor (provider: Provider) {
        super();
        this.provider = provider;
    }

    createContract (address: string, abi: Interface): ethers.Contract {
        return new ethers.Contract(
            address,
            abi,
            this.provider
        ) as BaseContract;
    }

    makeCall (
        contract: ContractData<Interface>,
        target: FunctionCall
    ): Promise<unknown> {
        const contractObject = new ethers.Contract(
            contract.address,
            contract.abi,
            this.provider
        );
        return contractObject.functions[target.functionName].call(target.args);
    }

    async getChainId (): Promise<bigint> {
        const { chainId } = await this.provider.getNetwork();
        return BigInt(chainId);
    }
}
