import {
    ContractAddress,
    ContractName,
    MainContractAddress
} from "../../domain/types";
import { Instance } from "../../instance";

const contracts = [
    "Committee",
    "DKG",
    "Nodes",
    "MirageAccessManager",
    "Status",
    "Staking"
];
export class MirageManagerInstance<ContractType> extends
    Instance<ContractType> {
    async getContractAddress (name: ContractName): Promise<ContractAddress> {
        if (!contracts.includes(name)) {
            throw new Error(
                `Contract name ${name} does not exist in mirage-manager`
            );
        }

        if (name === "MirageAccessManager") {
            return await this.callCommittee(
                "authority",
                []
            ) as MainContractAddress;
        }

        if (name === "Committee") {
            return this.mainContractAddress;
        }

        return await this.callCommittee(
            name.toLowerCase(),
            []
        ) as MainContractAddress;
    }

    private async callCommittee (functionName: string, args: unknown[]) {
        return this.project.network.adapter.makeCall(
            {
                "abi": await this.getContractAbi(this.project.mainContractName),
                "address": this.mainContractAddress
            },
            {
                args,
                functionName
            }
        );
    }
}
