import { Abi } from "./domain/types";

export type ContractData = {
    address: string;
    abi: Abi;
}

export type FunctionCall = {
    functionName: string,
    args: unknown[]
}

export interface Adapter<ContractType> {
    createContract(address: string, abi: Abi): ContractType;

    makeCall(
        contract: ContractData,
        target: FunctionCall
    ): Promise<unknown>;

    getChainId(): Promise<bigint>;

    isAddress(value: string): boolean;
}
