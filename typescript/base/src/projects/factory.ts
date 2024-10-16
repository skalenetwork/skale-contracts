import { MainnetImaProject } from "./ima/mainnet/MainnetImaProject";
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
        if (name === projects.skaleManager.name) {
            return new SkaleManagerProject<ContractType>(
                network,
                projects.skaleManager
            );
        } else if (name === projects.mainnetIma.name) {
            return new MainnetImaProject<ContractType>(
                network,
                projects.mainnetIma
            );
        } else if (name === projects.schainIma.name) {
            return new SchainImaProject<ContractType>(
                network,
                projects.schainIma
            );
        } else if (name === projects.skaleAllocator.name) {
            return new SkaleAllocatorProject<ContractType>(
                network,
                projects.skaleAllocator
            );
        } else if (name === projects.paymaster.name) {
            return new PaymasterProject<ContractType>(
                network,
                projects.paymaster
            );
        }
        throw new ProjectNotFoundError(`Project with name ${name} is unknown`);
    };
