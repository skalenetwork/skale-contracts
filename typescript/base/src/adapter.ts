import { Abi } from "./domain/types";

export type ContractData = {
    address: string;
    abi: Abi;
}

export type FunctionCall = {
    functionName: string,
    args: unknown[]
}

export abstract class Adapter<ContractType> {
    abstract createContract(address: string, abi: Abi): ContractType;

    abstract makeCall(
        contract: ContractData,
        target: FunctionCall
    ): Promise<unknown>;

    abstract getChainId(): Promise<bigint>;
}
