import {
    ContractAddress
} from "../../domain/types";
import { Instance } from "../../instance";

export enum SkaleAllocatorContract {
    ALLOCATOR = "Allocator",
    ESCROW = "Escrow",
}
export type SkaleAllocatorContractName = `${SkaleAllocatorContract}`;

export interface SkaleAllocatorDefaultTypesMap<ContractType>
    extends Record<SkaleAllocatorContractName, ContractType> {}

export class SkaleAllocatorInstance<
    ContractType,
    TypesMap extends Record<
        SkaleAllocatorContractName,
        ContractType
    > = SkaleAllocatorDefaultTypesMap<ContractType>
> extends Instance<ContractType, SkaleAllocatorContractName, TypesMap> {
    contractNames =
        Object.values(SkaleAllocatorContract);

    getContractAddress (
        name: SkaleAllocatorContractName,
        args?: unknown[]
    ): Promise<ContractAddress> {
        if (name === SkaleAllocatorContract.ALLOCATOR) {
            return Promise.resolve(this.mainContractAddress);
        }
        if (name === SkaleAllocatorContract.ESCROW) {
            const firstArgument = 0;
            const beneficiary = args?.at(firstArgument) as string;
            if (!this.project.network.adapter.isAddress(beneficiary)) {
                throw Error("Beneficiary is not set");
            }
            return this.getEscrow(beneficiary);
        }
        throw new Error(
            `Contract name ${name} does not exist in skale-allocator`
        );
    }

    // Private

    private async getEscrow (beneficiary: string) {
        const allocatorAddress = await this.getContractAddress("Allocator");
        const allocatorAbi = await this.getContractAbi("Allocator");

        return await this.project.network.adapter.makeCall(
            {
                "abi": allocatorAbi,
                "address": allocatorAddress
            },
            {
                "args": [beneficiary],
                "functionName": "getEscrowAddress"
            }
        ) as ContractAddress;
    }
}
