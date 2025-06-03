import {
    Abi,
    Adapter,
    ContractData,
    FunctionCall
} from "@skalenetwork/skale-contracts";
import { AddressLike, BaseContract, Provider, ethers } from "ethers";
import {
    ContractAddress
} from "@skalenetwork/skale-contracts/lib/domain/types";


export class Ethers6Adapter implements Adapter<BaseContract> {
    provider: Provider;

    constructor (provider: Provider) {
        this.provider = provider;
    }

    createContract (address: string, abi: Abi) {
        return new ethers.Contract(
            address,
            new ethers.Interface(abi),
            this.provider
        ) as BaseContract;
    }

    async makeCall (
        contract: ContractData,
        targetFunction: FunctionCall
    ): Promise<unknown> {
        const contractInterface = new ethers.Interface(contract.abi);
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

    async getCode(address: AddressLike): Promise<string> {
        const code = await this.provider.getCode(address);
        return code;
    }

    // eslint-disable-next-line class-methods-use-this
    isAddress (value: string): value is ContractAddress {
        return ethers.isAddress(value);
    }
}
