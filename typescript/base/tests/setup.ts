import * as dotenv from "dotenv";
import { SkaleProject } from "../src/projects/factory";

dotenv.config();

if (!process.env.ENDPOINT) {
    throw new Error("Please set ENDPOINT for ethereum mainnet in .env file");
}
export const MAINNET_ENDPOINT = process.env.ENDPOINT;
export const EUROPA_ENDPOINT =
    process.env.EUROPA_ENDPOINT ??
    "https://mainnet.skalenodes.com/v1/elated-tan-skat";

export const SCHAIN_PROJECTS = [
    SkaleProject.SCHAIN_IMA,
    SkaleProject.PAYMASTER
];

// In development
export const NOT_DEPLOYED = [SkaleProject.MIRAGE_MANAGER];

export const MAINNET_PROJECTS = Object.values(SkaleProject).filter(
    (project) => !SCHAIN_PROJECTS.includes(project) &&
            !NOT_DEPLOYED.includes(project)
);

export const SCHAIN_NOT_PREDEPLOYED = [SkaleProject.PAYMASTER];

export const MOCK_CONTRACT_ADDRESS =
    "0xAbC1234567890DEF1234567890abcdef12345678";
