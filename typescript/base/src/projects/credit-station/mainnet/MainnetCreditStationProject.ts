

import { ContractAddressMap, MainContractAddress } from "../../../domain/types";
import {
    MainnetCreditStationContractName,
    MainnetCreditStationDefaultTypesMap,
    MainnetCreditStationInstance
} from "./MainnetCreditStationInstance";
import { CreditStationProject } from "../CreditStationProject";


export class MainnetCreditStationProject<ContractType> extends
    CreditStationProject<ContractType, MainnetCreditStationContractName> {
    mainContractName = "Ledger";

    createInstance<
        TypesMap extends Record<MainnetCreditStationContractName, ContractType>=
            MainnetCreditStationDefaultTypesMap<ContractType>
    > (
        address: MainContractAddress | ContractAddressMap
    ): MainnetCreditStationInstance<ContractType, TypesMap> {
        return new MainnetCreditStationInstance<ContractType, TypesMap>(
            this,
            address
        );
    }

    getInstance<
        TypesMap extends Record<MainnetCreditStationContractName, ContractType>=
            MainnetCreditStationDefaultTypesMap<ContractType>
    > (
        target: string | MainContractAddress | ContractAddressMap
    ): MainnetCreditStationInstance<ContractType, TypesMap> {
        return super.getInstance<TypesMap>(
            target
        ) as MainnetCreditStationInstance<ContractType, TypesMap>;
    }
}
