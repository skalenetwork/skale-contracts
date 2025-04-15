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
        if (name === "PlayaAccessManager") {
            return await this.callCommittee(
                "authority",
                []
            ) as MainContractAddress;
        }
        const abi = await this.getContractAbi(this.project.mainContractName);
        const hasFunc = abi.find((item) => item.type === "function" &&
            item.stateMutability === "view" &&
            item.name === name.toLowerCase());
        if (hasFunc) {
            return await this.callCommittee(
                name.toLowerCase(),
                []
            ) as MainContractAddress;
        }
        throw new Error(
            `Contract name ${name} does not exist in playa-manager`
        );
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
