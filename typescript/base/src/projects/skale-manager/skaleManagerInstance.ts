import {
    ContractAddress,
    ContractName,
    MainContractAddress
} from "../../domain/types";
import { Instance } from "../../instance";

export enum SkaleManagerContract {
    CONTRACT_MANAGER = "ContractManager",

    DELEGATION_CONTROLLER = "DelegationController",
    DELEGATION_PERIOD_MANAGER = "DelegationPeriodManager",
    DISTRIBUTOR = "Distributor",
    PUNISHER = "Punisher",
    SLASHING_TABLE = "SlashingTable",
    TIME_HELPERS = "TimeHelpers",
    TOKEN_STATE = "TokenState",
    VALIDATOR_SERVICE = "ValidatorService",

    CONSTANTS_HOLDER = "ConstantsHolder",
    NODES = "Nodes",
    NODE_ROTATION = "NodeRotation",
    SCHAINS_INTERNAL = "SchainsInternal",
    SCHAINS = "Schains",
    DECRYPTION = "Decryption",
    ECDH = "ECDH",
    KEY_STORAGE = "KeyStorage",
    SKALE_DKG = "SkaleDKG",
    SKALE_VERIFIER = "SkaleVerifier",
    SKALE_MANAGER = "SkaleManager",
    BOUNTY = "Bounty",
    BOUNTY_V2 = "BountyV2",
    WALLETS = "Wallets",
    SYNC_MANAGER = "SyncManager",
    PAYMASTER_CONTROLLER = "PaymasterController",
    TIME_HELPERS_WITH_DEBUG = "TimeHelpersWithDebug",
    SKALE_TOKEN = "SkaleToken"
}
export type SkaleManagerContractName = `${SkaleManagerContract}`;

const skaleManagerAbi = [
    {
        "inputs": [],
        "name": "contractManager",
        "outputs": [
            {
                "internalType": "contract IContractManager",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "version",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

export class SkaleManagerInstance<ContractType> extends
    Instance<ContractType, SkaleManagerContractName> {
    contractNames =
        Object.values(SkaleManagerContract) as SkaleManagerContractName[];

    customNames = new Map<string, string>([
        [
            "BountyV2",
            "Bounty"
        ],
        [
            "TimeHelpersWithDebug",
            "TimeHelpers"
        ]
    ]);

    async queryVersion () {
        return await this.callSkaleManager(
            "version",
            []
        ) as string;
    }

    async getContractAddress (
        name: SkaleManagerContractName
    ): Promise<ContractAddress> {
        if (
            !this.contractNames.includes(
                name
            )
        ) {
            throw new Error(
                `Contract name ${name} does not exist in skale-manager`
            );
        }
        const contractManagerAbi =
                await this.getContractAbi("ContractManager");
        const contractManagerAddress = await this.callSkaleManager(
            "contractManager",
            []
        ) as string;

        return await this.project.network.adapter.makeCall(
            {
                "abi": contractManagerAbi,
                "address": contractManagerAddress
            },
            {
                "args": [this.actualName(name)],
                "functionName": "getContract"
            }
        ) as MainContractAddress;
    }

    getContract (
        name: SkaleManagerContractName,
        args?: unknown[]
    ): Promise<ContractType> {
        if (name === SkaleManagerContract.BOUNTY) {
            // Required because the ABI has the name as BOUNTY_V2
            // Even thought ContractManager stores address at BOUNTY
            return super.getContract(
                SkaleManagerContract.BOUNTY_V2,
                args
            );
        }
        return super.getContract(
            name,
            args
        );
    }

    // Private

    private actualName (name: ContractName) {
        if (this.customNames.has(name)) {
            return this.customNames.get(name) as string;
        }
        return name;
    }

    private callSkaleManager (functionName: string, args: unknown[]) {
        return this.project.network.adapter.makeCall(
            {
                "abi": skaleManagerAbi,
                "address": this.mainContractAddress
            },
            {
                args,
                functionName
            }
        );
    }
}
