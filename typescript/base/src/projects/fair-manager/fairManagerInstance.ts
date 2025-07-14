import {
    ContractAddress,
    MainContractAddress
} from "../../domain/types";
import { Instance } from "../../instance";

export enum FairManagerContract {
    COMMITTEE = "Committee",
    DKG = "DKG",
    NODES = "Nodes",
    FAIR_ACCESS_MANAGER = "FairAccessManager",
    STATUS = "Status",
    STAKING = "Staking"
}

export type FairManagerContractName = `${FairManagerContract}`;

export class FairManagerInstance<ContractType> extends
    Instance<ContractType, FairManagerContractName> {
    contractNames =
        Object.values(FairManagerContract) as FairManagerContractName[];

    async getContractAddress (
        name: FairManagerContractName
    ): Promise<ContractAddress> {
        if (
            !this.contractNames.includes(
                name
            )
        ) {
            throw new Error(
                `Contract name ${name} does not exist in fair-manager`
            );
        }

        if (name === "FairAccessManager") {
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
