export type ContractAddress = string;
export type ContractName = string;
export type MainContractAddress = ContractAddress;

export interface SkaleABIFile<InterfaceType> {
    [key: string]: InterfaceType;
}
