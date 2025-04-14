import { MainnetImaProject } from "./ima/mainnet/MainnetImaProject";
import { MirageManagerProject } from "./mirage-manager/mirageManagerProject";
import { Network } from "../network";
import { PaymasterProject } from "./paymaster/paymasterProject";
import { Project } from "../project";
import {
    ProjectNotFoundError
} from "../domain/errors/project/projectNotFoundError";
import { SchainImaProject } from "./ima/schain/SchainImaProject";
import { SkaleAllocatorProject } from "./skale-allocator/skaleAllocatorProject";
import { SkaleManagerProject } from "./skale-manager/skaleManagerProject";


export const projects = {
    "mainnetIma": {
        "name": "mainnet-ima",
        "path": "mainnet-ima"
    },
    "mirageManager": {
        "name": "mirage-manager",
        "path": "mirage-manager"
    },
    "paymaster": {
        "name": "paymaster",
        "path": "paymaster"
    },
    "schainIma": {
        "name": "schain-ima",
        "path": "schain-ima"
    },
    "skaleAllocator": {
        "name": "skale-allocator",
        "path": "skale-allocator"
    },
    "skaleManager": {
        "name": "skale-manager",
        "path": "skale-manager"
    }
};

export const createProject =
    function createProject<ContractType> (
        network: Network<ContractType>,
        name: string
    ): Project<ContractType> {
        switch (name) {
            case projects.skaleManager.name:
                return new SkaleManagerProject<ContractType>(
                    network,
                    projects.skaleManager
                );
            case projects.mainnetIma.name:
                return new MainnetImaProject<ContractType>(
                    network,
                    projects.mainnetIma
                );
            case projects.schainIma.name:
                return new SchainImaProject<ContractType>(
                    network,
                    projects.schainIma
                );
            case projects.skaleAllocator.name:
                return new SkaleAllocatorProject<ContractType>(
                    network,
                    projects.skaleAllocator
                );
            case projects.paymaster.name:
                return new PaymasterProject<ContractType>(
                    network,
                    projects.paymaster
                );
            case projects.mirageManager.name:
                return new MirageManagerProject<ContractType>(
                    network,
                    projects.mirageManager
                );
            default:
                throw new ProjectNotFoundError(
                    `Project with name ${name} is unknown`
                );
        }
    };
