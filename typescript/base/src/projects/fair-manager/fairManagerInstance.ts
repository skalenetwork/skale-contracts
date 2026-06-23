import {
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
const ZERO_ID = 0n;
export type FairManagerContractName = `${FairManagerContract}`;

export interface FairManagerDefaultTypesMap<ContractType>
    extends Record<FairManagerContractName, ContractType> {}

export class FairManagerInstance<
    ContractType,
    TypesMap extends Record<
        FairManagerContractName,
        ContractType
    > = FairManagerDefaultTypesMap<ContractType>
> extends Instance<ContractType, FairManagerContractName, TypesMap> {
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
            return this.getRewardWalletAddress(args?.pop() as bigint);
        }

        return await this.callCommittee(
            name.toLowerCase(),
            []
        ) as MainContractAddress;
    }

    private async getRewardWalletAddress (
        nodeId: bigint
    ): Promise<ContractAddress> {
        // Throws if not BigInt compatible at runtime
        if (!nodeId || BigInt(nodeId) < ZERO_ID) {
            throw new Error(
                "RewardWallet requires a positive BigInt as an argument"
            );
        }
        // Smart contract getter ensures a valid address is returned
        return await this.callStaking(
            "getRewardWallet",
            [BigInt(nodeId)]
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
