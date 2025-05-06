import { Account, Chain,PublicClient, RpcSchema, Transport, createPublicClient, http } from "viem";
import { EUROPA_ENDPOINT, MAINNET_ENDPOINT, MAINNET_PROJECTS, SCHAIN_NOT_PREDEPLOYED, SCHAIN_PROJECTS } from "./setup";
import { Instance, skaleContracts } from "../src"
import { describe, expect, test } from "vitest";
import { SkaleAllocatorContract } from "@skalenetwork/skale-contracts/src/projects/skale-allocator/skaleAllocatorInstance";
import { SkaleProject } from "@skalenetwork/skale-contracts/src/projects/factory";
import { mainnet } from "viem/chains";

const MIN_CONTRACT_CODE_SIZE = 2;

const checkInstanceContracts = async (
    instance: Instance,
    provider: PublicClient<Transport, Chain, Account, RpcSchema>
) => {
    const codeChecks = instance.contractNames.map(async (contractName) => {
        const contract = await instance.getContract(contractName);
        const code = await provider.getCode({ address: contract.address });
        expect(code).toBeTruthy();
        expect(code!.length).to.be.greaterThan(MIN_CONTRACT_CODE_SIZE);
    });
    await Promise.all(codeChecks);
}

describe(
    "Tests loading skale projects and instances",
    // eslint-disable-next-line max-lines-per-function
    () => {
        describe("Testing instances on Mainnet", async () => {
            const provider = createPublicClient({
                chain: mainnet,
                transport: http(MAINNET_ENDPOINT)
            }) as PublicClient<Transport, Chain, Account, RpcSchema>;
            const network = await skaleContracts.getNetworkByProvider(
                provider
            );

            test.each(
                MAINNET_PROJECTS.filter(proj => proj !== SkaleProject.SKALE_ALLOCATOR)
            )('Loading %s', async (projectName) => {
                const project = network.getProject(projectName);

                const instance = await project.getInstance("production");
                await checkInstanceContracts(instance, provider);
            });

            test(`Loading ${SkaleProject.SKALE_ALLOCATOR}`, async () => {
                const project = network.getProject(SkaleProject.SKALE_ALLOCATOR);

                const instance = await project.getInstance("production");
                const allocator = await instance.getContract(
                    SkaleAllocatorContract.ALLOCATOR
                );
                const codeAllocator = await provider.getCode({ address: allocator.address });
                expect(codeAllocator).toBeTruthy();
                expect(codeAllocator!.length).to.be.greaterThan(MIN_CONTRACT_CODE_SIZE);

                const escrow = await instance.getContract(
                    SkaleAllocatorContract.ESCROW,
                    [allocator.address]
                );

                const codeEscrow = await provider.getCode({ address: escrow.address });
                expect(codeEscrow).toBeTruthy();
                expect(codeEscrow!.length).to.be.greaterThan(MIN_CONTRACT_CODE_SIZE);
            });
        });


        describe("Testing instances on Schain Europa", async () => {
            const provider = createPublicClient({
                transport: http(EUROPA_ENDPOINT)
            }) as PublicClient<Transport, Chain, Account, RpcSchema>;
            const network = await skaleContracts.getNetworkByProvider(
                provider
            );
            test.each(SCHAIN_PROJECTS)('Loading %s', async (projectName) => {
                const project = network.getProject(projectName);
                let alias = "predeployed";
                if (SCHAIN_NOT_PREDEPLOYED.includes(projectName)) {
                    alias = "production";
                }
                const instance = await project.getInstance(alias);

                await checkInstanceContracts(instance, provider);
            });
        });
    }
);
