import { Abi, Adapter, ContractData, FunctionCall } from '@skalenetwork/skale-contracts';
import {
    Account,
    Address,
    Chain,
    GetContractReturnType,
    PublicClient,
    RpcSchema,
    Transport,
    Abi as ViemAbi,
    getContract as getContractViem,
    isAddress
} from 'viem';

export type ViemContract = GetContractReturnType<ViemAbi, { public: PublicClient }, Address>;

export class ViemAdapter implements Adapter<ViemContract> {
    client: PublicClient<Transport, Chain, Account, RpcSchema>;

    constructor(client: PublicClient<Transport, Chain, Account, RpcSchema>) {
        this.client = client;
    }

    createContract(address: string, abi: Abi): ViemContract {
        return getContractViem({
            abi: abi as ViemAbi,
            address: address as Address,
            client: this.client
        });
    }

    async makeCall(
        contract: ContractData,
        targetFunction: FunctionCall
    ): Promise<unknown> {
        return await this.client.readContract({
            abi: contract.abi as ViemAbi,
            address: contract.address as Address,
            args: targetFunction.args,
            functionName: targetFunction.functionName
        });
    }

    async getChainId(): Promise<bigint> {
        const chainId = await this.client.getChainId();
        return BigInt(chainId);
    }

    // eslint-disable-next-line class-methods-use-this
    isAddress(value: string): boolean {
        return isAddress(value);
    }
}