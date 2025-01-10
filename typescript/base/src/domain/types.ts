export type ContractAddress = `0x${string}`;
export type ContractName = string;
export type MainContractAddress = ContractAddress;
export type ContractAddressMap = {
    [contractName: ContractName]: ContractAddress
}

export interface AbiFragmentType {
    readonly name?: string;
    readonly indexed?: boolean;
    readonly type?: string;
    readonly components?: ReadonlyArray<AbiFragmentType>;
}

export interface AbiFragment {
    readonly name?: string;
    readonly type?: string;

    readonly anonymous?: boolean;

    readonly payable?: boolean;
    readonly constant?: boolean;
    readonly stateMutability?: string;

    readonly inputs?: ReadonlyArray<AbiFragmentType>;
    readonly outputs?: ReadonlyArray<AbiFragmentType>;

    readonly gas?: string;
}

export type Abi = ReadonlyArray<AbiFragment>;

export interface SkaleABIFile {
    [key: string]: Abi;
}
