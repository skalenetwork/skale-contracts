import {
    ContractAddress,
    ContractName,
    MainContractAddress
} from "../../domain/types";
import { Instance } from "../../instance";

export class PlayaManagerInstance<ContractType> extends
    Instance<ContractType> {
    async queryVersion () {
        return await this.callCommittee(
            "version",
            []
        ) as string;
    }

    async getContractAddress (name: ContractName): Promise<ContractAddress> {
        switch (name) {
            case "Nodes":
                return await this.callCommittee(
                    "nodes",
                    []
                ) as MainContractAddress;
            case "Status":
                return await this.callCommittee(
                    "nodes",
                    []
                ) as MainContractAddress;
            case "Dkg":
                return await this.callCommittee(
                    "nodes",
                    []
                ) as MainContractAddress;
            case "Committee":
                return this.mainContractAddress;
            case "PlayaAccessManager":
                return await this.callCommittee(
                    "authority",
                    []
                ) as MainContractAddress;
            case "Staking":
                return await this.callCommittee(
                    "staking",
                    []
                ) as MainContractAddress;
            default:
                throw new Error(
                    `Contract name ${name} does not exist in playa-manager`
                );
        }
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
