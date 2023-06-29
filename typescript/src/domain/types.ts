import { ContractInterface } from "ethers";

export type ContractAddress = string;
export type ContractName = string;
export type MainContractAddress = ContractAddress;

export interface SkaleABIFile {
    [key: string]: ContractInterface;
}
