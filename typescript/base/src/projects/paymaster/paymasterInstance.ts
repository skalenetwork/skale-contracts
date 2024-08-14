import {
    ContractAddress,
    ContractName
} from "../../domain/types";
import { Instance } from "../../instance";


export class PaymasterInstance<ContractType> extends
    Instance<ContractType> {
    async getContractAddress (name: ContractName): Promise<ContractAddress> {
        if ([
            "Paymaster",
            "FastForwardPaymaster"
        ].includes(name)) {
            return this.address;
        }
        if (name === "PaymasterAccessManager") {
            return await this.callPaymaster(
                "authority",
                []
            ) as ContractAddress;
        }
        throw new Error(`Contract ${name} is not found`);
    }

    // Private

    private async callPaymaster (functionName: string, args: unknown[]) {
        return this.project.network.adapter.makeCall(
            {
                "abi": await this.getContractAbi("Paymaster"),
                "address": this.address
            },
            {
                args,
                functionName
            }
        );
    }
}
