import { ContractAddressMap, MainContractAddress } from "../../../domain/types";
import {
    MainnetImaContract,
    MainnetImaContractName,
    MainnetImaDefaultTypesMap,
    MainnetImaInstance
} from "./MainnetImaInstance";
import { ImaProject } from "../ImaProject";

export class MainnetImaProject<
    ContractType
> extends ImaProject<ContractType, MainnetImaContractName> {
    mainContractName = MainnetImaContract.MESSAGE_PROXY_FOR_MAINNET;

    getAbiFilename (version: string) {
        return `${this.metadata.name}-${version}-abi.json`;
    }

    createInstance<
        TypesMap extends Record<MainnetImaContractName, ContractType> =
            MainnetImaDefaultTypesMap<ContractType>
    > (address: MainContractAddress | ContractAddressMap)
        : MainnetImaInstance<ContractType, TypesMap> {
        return new MainnetImaInstance<ContractType, TypesMap>(
            this,
            address
        );
    }

    getInstance<
        TypesMap extends Record<MainnetImaContractName, ContractType>=
            MainnetImaDefaultTypesMap<ContractType>
    > (
        target: string | MainContractAddress | ContractAddressMap
    ): MainnetImaInstance<ContractType, TypesMap> {
        return super.getInstance<TypesMap>(
            target
        ) as MainnetImaInstance<ContractType, TypesMap>;
    }
}
