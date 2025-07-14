import {
    FairManagerContractName
} from "./fair-manager/fairManagerInstance";
import { FairManagerProject } from "./fair-manager/fairManagerProject";
import { MainnetImaContractName } from "./ima/mainnet/MainnetImaInstance";
import { MainnetImaProject } from "./ima/mainnet/MainnetImaProject";
import { Network } from "../network";
import { PaymasterContractName } from "./paymaster/paymasterInstance";
import { PaymasterProject } from "./paymaster/paymasterProject";
import { Project } from "../project";
import {
    ProjectNotFoundError
} from "../domain/errors/project/projectNotFoundError";
import { SchainImaContractName } from "./ima/schain/SchainImaInstance";
import { SchainImaProject } from "./ima/schain/SchainImaProject";
import {
    SkaleAllocatorContractName
} from "./skale-allocator/skaleAllocatorInstance";
import { SkaleAllocatorProject } from "./skale-allocator/skaleAllocatorProject";
import { SkaleManagerContractName } from "./skale-manager/skaleManagerInstance";
import { SkaleManagerProject } from "./skale-manager/skaleManagerProject";

export enum SkaleProject {
    MAINNET_IMA = "mainnet-ima",
    SCHAIN_IMA = "schain-ima",
    PAYMASTER = "paymaster",
    SKALE_ALLOCATOR = "skale-allocator",
    SKALE_MANAGER = "skale-manager",
    FAIR_MANAGER = "fair-manager"
}
export type SkaleProjectName = `${SkaleProject}`;

export type SkaleContractNames =
    PaymasterContractName |
    MainnetImaContractName |
    SchainImaContractName |
    SkaleManagerContractName |
    FairManagerContractName |
    SkaleManagerContractName |
    SkaleAllocatorContractName;

export const createProject = function createProject<ContractType> (
    network: Network<ContractType>,
    name: SkaleProjectName
): Project<ContractType, SkaleContractNames> {
    const metadata = {
        name,
        "path": name
    };
    switch (name) {
    case SkaleProject.MAINNET_IMA:
        return new MainnetImaProject<ContractType>(
            network,
            metadata
        );
    case SkaleProject.PAYMASTER:
        return new PaymasterProject<ContractType>(
            network,
            metadata
        );
    case SkaleProject.SCHAIN_IMA:
        return new SchainImaProject<ContractType>(
            network,
            metadata
        );
    case SkaleProject.SKALE_ALLOCATOR:
        return new SkaleAllocatorProject<ContractType>(
            network,
            metadata
        );
    case SkaleProject.SKALE_MANAGER:
        return new SkaleManagerProject<ContractType>(
            network,
            metadata
        );
    case SkaleProject.FAIR_MANAGER:
        return new FairManagerProject<ContractType>(
            network,
            metadata
        );
    default:
        throw new ProjectNotFoundError(
            `Project with name ${name} is unknown`
        );
    }
};
