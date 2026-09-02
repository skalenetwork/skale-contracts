import { EUROPA_ENDPOINT, MOCK_CONTRACT_ADDRESS } from "@skalenetwork/skale-contracts/tests/setup";
import { createPublicClient, createWalletClient, encodeFunctionData, http } from "viem";
import { describe, expect, test } from "vitest";
import { SchainImaContract } from "@skalenetwork/skale-contracts/src/projects/ima/schain/SchainImaInstance";
import { SkaleProject } from "@skalenetwork/skale-contracts/src/projects/factory";
import { ViemAdapter } from "../src/viemAdapter";
import { skaleContracts } from "../src";

describe("Testing viem adapter", () => {
    const transport = http(EUROPA_ENDPOINT);

    test("getCode returns 0x for an address without code", async () => {
        const adapter = new ViemAdapter(createPublicClient({ transport }));
        expect(await adapter.getCode(MOCK_CONTRACT_ADDRESS)).toBe("0x");
    });

    test("wallet client makes contracts writable", async () => {
        const network = await skaleContracts.getNetworkByProvider(
            createPublicClient({ transport }),
            createWalletClient({ transport })
        );
        const instance = await network.
            getProject(SkaleProject.SCHAIN_IMA).
            getInstance("predeployed");
        const tokenManager = await instance.getContract(
            SchainImaContract.TOKEN_MANAGER_ETH
        );
        const exitAmount = 0n;
        const data = encodeFunctionData({
            abi: tokenManager.abi,
            args: [exitAmount],
            functionName: "exitToMain"
        });
        expect(tokenManager.write).toBeDefined();
        expect(data).toMatch(/^0x[0-9a-f]{72}$/u);
    });
});
