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
import { SkaleContracts } from "../lib";

const MIN_CONTRACT_CODE_SIZE = 2;

interface NetworkLike {
    chainId: bigint | number;
}
interface ProviderLike {
    getCode(
        address: string
    ): Promise<string | undefined>;
    getNetwork?(): Promise<NetworkLike>;
    getChainId?(): Promise<bigint | number>;
}

interface SkaleContractsLike<ContractType>
    extends SkaleContracts<ContractType> {
    getNetworkByProvider(provider: ProviderLike): Promise<Network<ContractType>>
}

export const checkInstance = async function checkInstance<ContractType> (
    instance: Instance<ContractType, SkaleContractNames>,
    provider: ProviderLike,
    addressGetter: (contract: ContractType) => string | Promise<string>
) {
    const codeChecks = instance.contractNames.map(async (contractName) => {
        const contract = await instance.getContract(contractName);
        const code = await provider.getCode(await addressGetter(contract));
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
    provider: ProviderLike,
    skaleContracts: SkaleContractsLike<ContractType>,
    projectName: SkaleProject
) {
    const network = await skaleContracts.getNetworkByProvider(
        provider
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
    provider: ProviderLike
) {
    const allocator = await instance.getContract(
        SkaleAllocatorContract.ALLOCATOR
    );
    const codeAllocator = await provider.getCode(
        await addressGetter(allocator)
    );
    expect(codeAllocator).toBeTruthy();
    expect(codeAllocator?.length).to.be.greaterThan(MIN_CONTRACT_CODE_SIZE);

    const escrow = await instance.getContract(
        SkaleAllocatorContract.ESCROW,
        [await addressGetter(allocator)]
    );

    const codeEscrow = await provider.getCode(await addressGetter(escrow));
    expect(codeAllocator).toBeTruthy();
    expect(codeEscrow?.length).to.be.greaterThan(MIN_CONTRACT_CODE_SIZE);
};

const MAINNET_CHAIN_ID = 1;

const getChainId = async function getChainId (provider: ProviderLike) {
    if (provider.getNetwork) {
        return (await provider.getNetwork()).chainId;
    } else if (provider.getChainId) {
        const chainId = provider.getChainId();
        return chainId;
    }

    throw new Error("Cannot get chainId for this provider.");
};

export const testInstancesForProvider =
async function testInstancesForProvider<ContractType> (
    provider: ProviderLike,
    getContractAddress: (contract: ContractType) => string | Promise<string>,
    skaleContracts: SkaleContractsLike<ContractType>
) {
    let projects = SCHAIN_PROJECTS;
    const chainId = (await getChainId(provider)).toString();
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
                provider,
                skaleContracts,
                projectName
            );
            await checkInstance(
                instance,
                provider,
                getContractAddress
            );
        }
    );
};
