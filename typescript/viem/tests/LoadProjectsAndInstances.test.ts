import { Account, Chain,PublicClient, RpcSchema, Transport, createPublicClient, http } from "viem";
import { EUROPA_ENDPOINT, MAINNET_ENDPOINT } from "@skalenetwork/skale-contracts/tests/setup";
import { describe, test } from "vitest";
import { loadRequirements, testAllocator, testInstancesForProvider } from "@skalenetwork/skale-contracts/tests/common";
import { SkaleProject } from "@skalenetwork/skale-contracts/src/projects/factory";
import { ViemContract } from "../src/viemAdapter";
import { mainnet } from "viem/chains";
import { skaleContracts } from "../src";
const getContractAddress = (contract: ViemContract) =>
    contract.address;


const createMyClient = (endpoint: string, chain?: Chain) => {
    const baseClient = createPublicClient({
        chain,
        transport: http(endpoint),
    });

    // Overriding getCode for tests
    return {
        ...baseClient,
        getCode(input: `0x${string}`){
            return baseClient.getCode({ address: input });
        },
    }
}

describe(
    "Tests loading skale projects and instances",
    () => {
        describe("Testing instances on Mainnet", async () => {
            const provider = createMyClient(MAINNET_ENDPOINT, mainnet);
            await provider.getChainId();
            await testInstancesForProvider(provider, getContractAddress, skaleContracts);

            test(`Loading ${SkaleProject.SKALE_ALLOCATOR}`, async () => {
                const instance = await loadRequirements<ViemContract>(
                    provider,
                    skaleContracts,
                    SkaleProject.SKALE_ALLOCATOR
                );
                await testAllocator<ViemContract>(instance, getContractAddress, provider);
            });
        });

        describe("Testing instances on Schain Europa", async () => {
            const provider = createMyClient(EUROPA_ENDPOINT);

            await testInstancesForProvider<ViemContract>(provider, getContractAddress, skaleContracts);
        });
    }
);
