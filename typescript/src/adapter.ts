export type ContractData<InterfaceType> = {
    address: string;
    abi: InterfaceType
}

export type FunctionCall = {
    functionName: string,
    args: unknown[]
}

export abstract class Adapter<ContractType, InterfaceType> {
    abstract createContract(address: string, abi: InterfaceType): ContractType;

    abstract makeCall(
        contract: ContractData<InterfaceType>,
        target: FunctionCall
    ): Promise<unknown>;

    abstract getChainId(): Promise<bigint>;
}
