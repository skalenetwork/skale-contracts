/* eslint-disable max-lines-per-function */
import {
    FairManagerContractName
} from "./fair-manager/fairManagerInstance";
import { FairManagerProject } from "./fair-manager/fairManagerProject";
import {
    MainnetCreditStationContractName
} from "./credit-station/mainnet/MainnetCreditStationInstance";
import {
    MainnetCreditStationProject
} from "./credit-station/mainnet/MainnetCreditStationProject";

import { MainnetImaContractName } from "./ima/mainnet/MainnetImaInstance";
import { MainnetImaProject } from "./ima/mainnet/MainnetImaProject";
import { Network } from "../network";
import { PaymasterContractName } from "./paymaster/paymasterInstance";
import { PaymasterProject } from "./paymaster/paymasterProject";
import { Project } from "../project";
import {
    ProjectNotFoundError
} from "../domain/errors/project/projectNotFoundError";
import {
    SchainCreditStationContractName
} from "./credit-station/schain/SchainCreditStationInstance";
import {
    SchainCreditStationProject
} from "./credit-station/schain/SchainCreditStationProject";
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
    MAINNET_CREDIT_STATION = "mainnet-credit-station",
    SCHAIN_CREDIT_STATION = "schain-credit-station",
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
    SkaleAllocatorContractName |
    SchainCreditStationContractName |
    MainnetCreditStationContractName;

type ProjectConstructor<ContractType> = new (
    network: Network<ContractType>,
    metadata: { name: SkaleProjectName; path: SkaleProjectName }
) => Project<ContractType, SkaleContractNames>;

const projectMap: Record<SkaleProject, ProjectConstructor<unknown>> = {
    [SkaleProject.MAINNET_IMA]: MainnetImaProject,
    [SkaleProject.PAYMASTER]: PaymasterProject,
    [SkaleProject.SCHAIN_IMA]: SchainImaProject,
    [SkaleProject.SKALE_ALLOCATOR]: SkaleAllocatorProject,
    [SkaleProject.SKALE_MANAGER]: SkaleManagerProject,
    [SkaleProject.FAIR_MANAGER]: FairManagerProject,
    [SkaleProject.MAINNET_CREDIT_STATION]: MainnetCreditStationProject,
    [SkaleProject.SCHAIN_CREDIT_STATION]: SchainCreditStationProject
};

export const createProject = function createProject<ContractType> (
    network: Network<ContractType>,
    name: SkaleProjectName
): Project<ContractType, SkaleContractNames> {
    const metadata = {
        name,
        "path": name
    };
    const ProjectClass = projectMap[name as SkaleProject];
    if (!ProjectClass) {
        throw new ProjectNotFoundError(
            `Project with name ${name} is unknown`
        );
    }
    return new ProjectClass(
        network,
        metadata
    ) as Project<ContractType, SkaleContractNames>;
};
