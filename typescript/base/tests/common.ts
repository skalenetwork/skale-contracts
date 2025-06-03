import { Adapter, SkaleContracts } from "../lib";
import {
    MAINNET_PROJECTS,
    SCHAIN_NOT_PREDEPLOYED,
    SCHAIN_PROJECTS
} from "./setup";
import { SkaleContractNames, SkaleProject } from "../src/projects/factory";
import { expect, test } from "vitest";
import { Instance } from "../lib/instance";
import { Network } from "../lib/network";
import {
    SkaleAllocatorContract
} from "../lib/projects/skale-allocator/skaleAllocatorInstance";

const MIN_CONTRACT_CODE_SIZE = 2;

interface SkaleContractsLike<ContractType>
    extends SkaleContracts<ContractType> {
    getNetworkByProvider(
        adapter: Adapter<ContractType>
    ): Promise<Network<ContractType>>
}

export const checkInstance = async function checkInstance<ContractType> (
    instance: Instance<ContractType, SkaleContractNames>,
    adapter: Adapter<ContractType>,
    addressGetter: (contract: ContractType) => string | Promise<string>
) {
    const codeChecks = instance.contractNames.map(async (contractName) => {
        const contract = await instance.getContract(contractName);
        const code = await adapter.getCode(await addressGetter(contract));
        expect(code).toBeTruthy();
        expect(code?.length).to.be.greaterThan(MIN_CONTRACT_CODE_SIZE);
    });
    await Promise.all(codeChecks);
};

const loadInstance = async function loadInstance<ContractType> (
    network: Network<ContractType>,
    projectName: SkaleProject,
    alias: string
): Promise<Instance<ContractType, SkaleContractNames>> {
    const project = network.getProject(projectName);
    const instance = await project.getInstance(alias);
    return instance;
};


export const loadRequirements = async function loadRequirements<ContractType> (
    adapter: Adapter<ContractType>,
    skaleContracts: SkaleContractsLike<ContractType>,
    projectName: SkaleProject
) {
    const network = await skaleContracts.getNetworkByAdapter(
        adapter
    );
    let alias = "production";
    if (
        SCHAIN_PROJECTS.includes(projectName) &&
        !SCHAIN_NOT_PREDEPLOYED.includes(projectName)
    ) {
        alias = "predeployed";
    }
    const instance = await loadInstance(
        network,
        projectName,
        alias
    );
    return instance;
};

export const testAllocator = async function testAllocator<ContractType> (
    instance: Instance<ContractType, SkaleContractNames>,
    addressGetter: (contract: ContractType) => string | Promise<string>,
    adapter: Adapter<ContractType>
) {
    const allocator = await instance.getContract(
        SkaleAllocatorContract.ALLOCATOR
    );
    const codeAllocator = await adapter.getCode(
        await addressGetter(allocator)
    );
    expect(codeAllocator).toBeTruthy();
    expect(codeAllocator?.length).to.be.greaterThan(MIN_CONTRACT_CODE_SIZE);

    const escrow = await instance.getContract(
        SkaleAllocatorContract.ESCROW,
        [await addressGetter(allocator)]
    );

    const codeEscrow = await adapter.getCode(await addressGetter(escrow));
    expect(codeAllocator).toBeTruthy();
    expect(codeEscrow?.length).to.be.greaterThan(MIN_CONTRACT_CODE_SIZE);
};

const MAINNET_CHAIN_ID = 1;

export const testInstancesForProvider =
async function testInstancesForProvider<ContractType> (
    adapter: Adapter<ContractType>,
    getContractAddress: (contract: ContractType) => string | Promise<string>,
    skaleContracts: SkaleContractsLike<ContractType>
) {
    let projects = SCHAIN_PROJECTS;
    const chainId = (await adapter.getChainId()).toString();
    // eslint-disable-next-line function-call-argument-newline
    if (parseInt(chainId, 10) === MAINNET_CHAIN_ID) {
        projects = MAINNET_PROJECTS;
    }
    test.each(
        projects.filter(
            (proj: SkaleProject) => proj !== SkaleProject.SKALE_ALLOCATOR
        )
    )(
        "Loading %s",
        async (...[projectName]) => {
            const instance = await loadRequirements<ContractType>(
                adapter,
                skaleContracts,
                projectName
            );
            await checkInstance(
                instance,
                adapter,
                getContractAddress
            );
        }
    );
};
