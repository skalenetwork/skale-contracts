import {
    ContractAddress,
    ContractName
} from "../../domain/types";
import { Instance } from "../../instance";


export class SkaleAllocatorInstance<ContractType> extends
    Instance<ContractType> {
    getContractAddress (
        name: ContractName,
        args?: unknown[]
    ): Promise<ContractAddress> {
        if (name === "Allocator") {
            return Promise.resolve(this.address);
        }
        if (name === "Escrow") {
            const firstArgument = 0;
            const beneficiary = args?.at(firstArgument) as string;
            if (!this.project.network.adapter.isAddress(beneficiary)) {
                throw Error("Beneficiary is not set");
            }
            return this.getEscrow(beneficiary);
        }
        throw new Error(`Contract ${name} is not found`);
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
