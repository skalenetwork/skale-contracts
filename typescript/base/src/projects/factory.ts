import { Project, SkaleProject, SkaleProjectName } from "../project";
import { MainnetImaProject } from "./ima/mainnet/MainnetImaProject";
import { MirageManagerProject } from "./mirage-manager/mirageManagerProject";
import { Network } from "../network";
import { PaymasterProject } from "./paymaster/paymasterProject";
import {
    ProjectNotFoundError
} from "../domain/errors/project/projectNotFoundError";
import { SchainImaProject } from "./ima/schain/SchainImaProject";
import { SkaleAllocatorProject } from "./skale-allocator/skaleAllocatorProject";
import { SkaleManagerProject } from "./skale-manager/skaleManagerProject";


export const createProject = function createProject<ContractType> (
    network: Network<ContractType>,
    name: SkaleProjectName
): Project<ContractType> {
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
    case SkaleProject.MIRAGE_MANAGER:
        return new MirageManagerProject<ContractType>(
            network,
            metadata
        );
    default:
        throw new ProjectNotFoundError(
            `Project with name ${name} is unknown`
        );
    }
};
