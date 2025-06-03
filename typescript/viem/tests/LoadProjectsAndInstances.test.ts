import { Account, Chain, PublicClient, RpcSchema, Transport, createPublicClient, http } from "viem";
import { EUROPA_ENDPOINT, MAINNET_ENDPOINT } from "@skalenetwork/skale-contracts/tests/setup";
import { ViemAdapter, ViemContract } from "../src/viemAdapter";
import { describe, test } from "vitest";
import { loadRequirements, testAllocator, testInstancesForProvider } from "@skalenetwork/skale-contracts/tests/common";
import { RetryAdapter } from "@skalenetwork/skale-contracts/src/retryAdapter";
import { SkaleProject } from "@skalenetwork/skale-contracts/src/projects/factory";
import { mainnet } from "viem/chains";
import { skaleContracts } from "../src";
const getContractAddress = (contract: ViemContract) =>
    contract.address;


const createAdapter = (endpoint: string, chain?: Chain) => {
    const baseClient = createPublicClient({
        chain,
        transport: http(endpoint),
    }) as PublicClient<Transport, Chain, Account, RpcSchema>;

    return new ViemAdapter(baseClient);
}

describe(
    "Tests loading skale projects and instances",
    () => {
        describe("Testing instances on Mainnet", async () => {
            const adapter = createAdapter(MAINNET_ENDPOINT, mainnet);
            const retryAdapter = new RetryAdapter(adapter);
            await testInstancesForProvider(retryAdapter, getContractAddress, skaleContracts);

            test(`Loading ${SkaleProject.SKALE_ALLOCATOR}`, async () => {
                const instance = await loadRequirements<ViemContract>(
                    retryAdapter,
                    skaleContracts,
                    SkaleProject.SKALE_ALLOCATOR
                );
                await testAllocator<ViemContract>(instance, getContractAddress, retryAdapter);
            });
        });

        describe("Testing instances on Schain Europa", async () => {
            const adapter = createAdapter(EUROPA_ENDPOINT);

            await testInstancesForProvider<ViemContract>(adapter, getContractAddress, skaleContracts);
        });
    }
);
