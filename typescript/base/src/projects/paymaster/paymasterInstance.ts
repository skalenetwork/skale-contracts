import {
    ContractAddress
} from "../../domain/types";
import { Instance } from "../../instance";

export enum PaymasterContract {
    PAYMASTER = "Paymaster",
    PAYMASTER_ACCESS_MANAGER = "PaymasterAccessManager",
    FAST_FORWARD_PAYMASTER = "FastForwardPaymaster"
}
export type PaymasterContractName = `${PaymasterContract}`;
export class PaymasterInstance<ContractType> extends
    Instance<ContractType> {
    async getContractAddress (
        name: PaymasterContractName
    ): Promise<ContractAddress> {
        if ([
            PaymasterContract.PAYMASTER,
            PaymasterContract.FAST_FORWARD_PAYMASTER
        ].includes(name as PaymasterContract)) {
            return this.mainContractAddress;
        }
        if (name === PaymasterContract.PAYMASTER_ACCESS_MANAGER) {
            return await this.callPaymaster(
                "authority",
                []
            ) as ContractAddress;
        }
        throw new Error(
            `Contract name ${name} does not exist in paymaster`
        );
    }

    // Private

    private async callPaymaster (functionName: string, args: unknown[]) {
        return this.project.network.adapter.makeCall(
            {
                "abi": await this.getContractAbi("Paymaster"),
                "address": this.mainContractAddress
            },
            {
                args,
                functionName
            }
        );
    }
}
