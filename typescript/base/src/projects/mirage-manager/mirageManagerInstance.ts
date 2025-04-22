import {
    ContractAddress,
    MainContractAddress
} from "../../domain/types";
import { Instance, contractExists } from "../../instance";

export enum MirageManagerContract {
    COMMITTEE = "Committee",
    DKG = "DKG",
    NODES = "Nodes",
    MIRAGE_ACCESS_MANAGER = "MirageAccessManager",
    STATUS = "Status",
    STAKING = "Staking"
}

export type MirageManagerContractName = `${MirageManagerContract}`;

export class MirageManagerInstance<ContractType> extends
    Instance<ContractType> {
    async getContractAddress (
        name: MirageManagerContractName
    ): Promise<ContractAddress> {
        if (
            !contractExists(
                MirageManagerContract,
                name
            )
        ) {
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
