import { BaseContract, ethers } from "ethers";
import { EUROPA_ENDPOINT, MAINNET_ENDPOINT } from "@skalenetwork/skale-contracts/tests/setup";
import { describe, test } from "vitest";
import { loadRequirements, testAllocator, testInstancesForProvider } from "@skalenetwork/skale-contracts/tests/common";
import { Ethers5Adapter } from "../src/ethers5Adapter";
import { SkaleProject } from "@skalenetwork/skale-contracts/src/projects/factory";
import { skaleContracts } from "../src"

const getContractAddress = (contract: BaseContract) =>
    contract.address;

describe(
    "Tests loading skale projects and instances",
    () => {
        describe("Testing instances on Mainnet", async () => {
            const adapter = new Ethers5Adapter(
                new ethers.providers.JsonRpcProvider(
                    MAINNET_ENDPOINT
                )
            );

            await testInstancesForProvider(adapter, getContractAddress, skaleContracts);
            test(`Loading ${SkaleProject.SKALE_ALLOCATOR}`, async () => {
                const instance = await loadRequirements(
                    adapter,
                    skaleContracts,
                    SkaleProject.SKALE_ALLOCATOR
                );
                await testAllocator(instance, getContractAddress, adapter);
            });
        });

        describe("Testing instances on Schain Europa", async () => {
            const provider = new ethers.providers.JsonRpcProvider(
                EUROPA_ENDPOINT
            );
            await testInstancesForProvider(
                new Ethers5Adapter(provider),
                getContractAddress,
                skaleContracts
            );
        });
    }
);
