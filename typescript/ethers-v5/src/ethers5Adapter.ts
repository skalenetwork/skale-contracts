import {
    Abi,
    Adapter,
    ContractData,
    FunctionCall
} from "@skalenetwork/skale-contracts";
import { BaseContract, ethers } from "ethers";
import {
    ContractAddress
} from "@skalenetwork/skale-contracts/lib/domain/types";
import { Provider } from "@ethersproject/providers";


export class Ethers5Adapter implements Adapter<BaseContract> {
    provider: Provider;

    constructor (provider: Provider) {
        this.provider = provider;
    }

    createContract (address: string, abi: Abi): ethers.Contract {
        return new ethers.Contract(
            address,
            new ethers.utils.Interface(abi),
            this.provider
        ) as BaseContract;
    }

    async makeCall (
        contract: ContractData,
        targetFunction: FunctionCall
    ): Promise<unknown> {
        const contractInterface = new ethers.utils.Interface(contract.abi);
        const [result] = contractInterface.decodeFunctionResult(
            targetFunction.functionName,
            await this.provider.call({
                "data": contractInterface.encodeFunctionData(
                    targetFunction.functionName,
                    targetFunction.args
                ),
                "to": contract.address
            })
        );
        return result;
    }

    async getChainId (): Promise<bigint> {
        const { chainId } = await this.provider.getNetwork();
        return BigInt(chainId);
    }

    async getCode(address: string | Promise<string>): Promise<string> {
        const code = await this.provider.getCode(address);
        return code;
    }

    // eslint-disable-next-line class-methods-use-this
    isAddress (value: string): value is ContractAddress {
        return ethers.utils.isAddress(value);
    }
}
