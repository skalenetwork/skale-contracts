import { Abi, Adapter, ContractData, FunctionCall } from '@skalenetwork/skale-contracts';
import {
    Address,
    GetContractReturnType,
    PublicClient,
    Abi as ViemAbi,
    WalletClient,
    getContract as getContractViem,
    isAddress
} from 'viem';

export type ViemContract = GetContractReturnType<
    ViemAbi,
    { public: PublicClient; wallet: WalletClient },
    Address
>;

export class ViemAdapter implements Adapter<ViemContract> {
    client: PublicClient;

    walletClient?: WalletClient;

    constructor(client: PublicClient, walletClient?: WalletClient) {
        this.client = client;
        this.walletClient = walletClient;
    }

    createContract(address: string, abi: Abi): ViemContract {
        return getContractViem({
            abi: abi as ViemAbi,
            address: address as Address,
            client: { public: this.client, wallet: this.walletClient }
        }) as ViemContract;
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

    async getCode(address: Address): Promise<string> {
        const code = await this.client.getCode({ address });
        return code ?? "0x";
    }

    // eslint-disable-next-line class-methods-use-this
    isAddress(value: string): value is Address {
        return isAddress(value);
    }
}
