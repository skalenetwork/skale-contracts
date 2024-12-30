import * as semver from "semver";
import {
    ContractAddress,
    ContractAddressMap,
    ContractName,
    MainContractAddress,
    SkaleABIFile
} from "./domain/types";
import { parse, stringify } from "@renovatebot/pep440/lib/version";
import { Pep440Version } from "@renovatebot/pep440";
import { Project } from "./project";

export type InstanceData = {
    [contractName: string]: MainContractAddress
}

const defaultVersionAbi = [
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

const processSemver = (semVersion: semver.SemVer) => {
    if (!semVersion.prerelease.length) {
        const defaultPrerelease = 0;
        semVersion.prerelease = [
            "stable",
            defaultPrerelease
        ];
    }
    return semVersion.format();
};

const processPep440 = (pyVersion: Pep440Version) => {
    const replaceMap = new Map<string, string>([
        [
            "a",
            "develop"
        ],
        [
            "b",
            "beta"
        ]
    ]);
    pyVersion.pre = pyVersion.pre.map((value: string | number) => {
        if (typeof value === "string" && replaceMap.has(value)) {
            return `-${replaceMap.get(value)!}.`;
        }
        return value;
    });
    return stringify(pyVersion)!;
};

export abstract class Instance<ContractType> {
    protected project: Project<ContractType>;

    addressContainer: ContractAddressMap;

    abi: SkaleABIFile | undefined;

    version: string | undefined;

    constructor (
        project: Project<ContractType>,
        addressOrAddressContainer: MainContractAddress | ContractAddressMap
    ) {
        this.project = project;
        if (typeof addressOrAddressContainer === "string") {
            this.addressContainer = {
                [this.project.mainContractName]: addressOrAddressContainer
            };
        } else {
            this.addressContainer = addressOrAddressContainer;
        }
    }

    get adapter () {
        return this.project.network.adapter;
    }

    abstract getContractAddress(
        name: ContractName,
        args?: unknown[]
    ): Promise<ContractAddress>;

    async getContract (name: ContractName, args?: unknown[]) {
        return this.adapter.createContract(
            await this.getContractAddress(
                name,
                args
            ),
            await this.getContractAbi(name)
        );
    }

    // Protected

    protected queryVersion () {
        return this.project.network.adapter.makeCall(
            {
                "abi": defaultVersionAbi,
                "address": this.mainContractAddress
            },
            {
                "args": [],
                "functionName": "version"
            }
        ) as Promise<string>;
    }

    protected async getContractAbi (contractName: string) {
        const abi = await this.getAbi();
        return abi[contractName];
    }

    get mainContractAddress () {
        return this.addressContainer[this.project.mainContractName];
    }

    // Private

    private async getVersion () {
        if (typeof this.version === "undefined") {
            const rawVersion = await this.queryVersion();
            const semVersion = semver.parse(rawVersion);
            if (semVersion) {
                this.version = processSemver(semVersion);
            } else {
                const pyVersion = parse(rawVersion);
                if (pyVersion) {
                    this.version = processPep440(pyVersion);
                } else {
                    throw new Error(`Can't parse version ${rawVersion}`);
                }
            }
        }
        return this.version;
    }

    private async getAbi () {
        if (typeof this.abi === "undefined") {
            this.abi =
                await this.project.downloadAbiFile(await this.getVersion());
        }
        return this.abi;
    }
}
