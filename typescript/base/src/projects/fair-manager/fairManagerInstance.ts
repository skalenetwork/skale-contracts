import {
    BigNumberish,
    ContractAddress,
    MainContractAddress
} from "../../domain/types";
import { Instance } from "../../instance";

export enum FairManagerContract {
    COMMITTEE = "Committee",
    DKG = "DKG",
    FAIR_ACCESS_MANAGER = "FairAccessManager",
    NODES = "Nodes",
    REWARD_WALLET = "RewardWallet",
    STATUS = "Status",
    STAKING = "Staking"
}

export type FairManagerContractName = `${FairManagerContract}`;

export class FairManagerInstance<ContractType> extends
    Instance<ContractType, FairManagerContractName> {
    contractNames =
        Object.values(FairManagerContract) as FairManagerContractName[];

    async getContractAddress (
        name: FairManagerContractName,
        args?: unknown[]
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

        if (name === "RewardWallet") {
            return this.getRewardWalletAddress(args?.pop() as BigNumberish);
        }

        return await this.callCommittee(
            name.toLowerCase(),
            []
        ) as MainContractAddress;
    }

    private async getRewardWalletAddress (
        nodeId: BigNumberish
    ): Promise<ContractAddress> {
        if (!nodeId) {
            throw new Error(
                "RewardWallet requires only a NodeId bigint compatible argument"
            );
        }
        // Smart contract getter ensures a valid address is returned
        return await this.callStaking(
            "getRewardWallet",
            [nodeId]
        ) as ContractAddress;
    }


    private async callStaking (functionName: string, args: unknown[]) {
        const stakingAddress = await this.getContractAddress("Staking");
        return this.project.network.adapter.makeCall(
            {
                "abi": await this.getContractAbi(stakingAddress),
                "address": this.mainContractAddress
            },
            {
                args,
                functionName
            }
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
