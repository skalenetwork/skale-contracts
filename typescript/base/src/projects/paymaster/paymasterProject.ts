import { ContractAddressMap, MainContractAddress } from "../../domain/types";
import {
    PaymasterContract,
    PaymasterContractName,
    PaymasterDefaultTypesMap,
    PaymasterInstance
} from "./paymasterInstance";
import { Project } from "../../project";

export class PaymasterProject<
    ContractType,
> extends Project<ContractType, PaymasterContractName> {
    githubRepo = "https://github.com/skalenetwork/paymaster/";

    mainContractName = PaymasterContract.PAYMASTER;

    createInstance<
        TypesMap extends Record<PaymasterContractName, ContractType>=
            PaymasterDefaultTypesMap<ContractType>
    > (address: MainContractAddress | ContractAddressMap)
        : PaymasterInstance<ContractType, TypesMap> {
        return new PaymasterInstance<ContractType, TypesMap>(
            this,
            address
        );
    }

    getInstance<
        TypesMap extends Record<PaymasterContractName, ContractType>=
            PaymasterDefaultTypesMap<ContractType>
    > (
        target: string | MainContractAddress | ContractAddressMap
    ): PaymasterInstance<ContractType, TypesMap> {
        return super.getInstance<TypesMap>(
            target
        ) as PaymasterInstance<ContractType, TypesMap>;
    }

    getAbiFilename (version: string) {
        return `${this.metadata.name}-${version}-abi.json`;
    }
}
