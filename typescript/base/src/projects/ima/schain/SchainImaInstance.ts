import { ContractAddress } from "../../../domain/types";
import { ImaInstance } from "../ImaInstance";


export class SchainImaInstance<ContractType> extends
    ImaInstance<ContractType> {
    static PREDEPLOYED = new Map<string, string>([
        [
            "CommunityLocker",
            "0xD2aaa00300000000000000000000000000000000"
        ],
        [
            "KeyStorage",
            "0xd2aaa00200000000000000000000000000000000"
        ],
        [
            "MessageProxyForSchain",
            "0xd2AAa00100000000000000000000000000000000"
        ],
        [
            "ProxyAdmin",
            "0xd2aAa00000000000000000000000000000000000"
        ],
        [
            "TokenManagerERC1155",
            "0xD2aaA00900000000000000000000000000000000"
        ],
        [
            "TokenManagerERC20",
            "0xD2aAA00500000000000000000000000000000000"
        ],
        [
            "TokenManagerERC721",
            "0xD2aaa00600000000000000000000000000000000"
        ],
        [
            "TokenManagerERC721WithMetadata",
            "0xd2AaA00a00000000000000000000000000000000"
        ],
        [
            "TokenManagerEth",
            "0xd2AaA00400000000000000000000000000000000"
        ],
        [
            "TokenManagerLinker",
            "0xD2aAA00800000000000000000000000000000000"
        ],
        [
            "EthErc20",
            "0xD2Aaa00700000000000000000000000000000000"
        ]
    ]);

    getContractAddress (name: string): Promise<ContractAddress> {
        if (name in this.addressContainer) {
            return Promise.resolve(this.addressContainer[name]);
        }
        if (SchainImaInstance.PREDEPLOYED.has(name)) {
            return Promise.resolve(SchainImaInstance.PREDEPLOYED.
                get(name) as ContractAddress);
        }
        throw new Error(`Can't get address of ${name} contract`);
    }
}
