import { ContractAddressMap, MainContractAddress } from "../../../domain/types";
import {
    SchainCreditStationContractName,
    SchainCreditStationDefaultTypesMap,
    SchainCreditStationInstance
} from "./SchainCreditStationInstance";
import { CreditStationProject } from "../CreditStationProject";


export class SchainCreditStationProject<ContractType> extends
    CreditStationProject<ContractType, SchainCreditStationContractName> {
    mainContractName = "Ledger";

    createInstance<
        TypesMap extends Record<SchainCreditStationContractName, ContractType>
    > (
        address: MainContractAddress | ContractAddressMap
    ): SchainCreditStationInstance<ContractType, TypesMap> {
        return new SchainCreditStationInstance<ContractType, TypesMap>(
            this,
            address
        );
    }

    getInstance<
        TypesMap extends Record<SchainCreditStationContractName, ContractType>=
            SchainCreditStationDefaultTypesMap<ContractType>
    > (
        target: string | MainContractAddress | ContractAddressMap
    ): SchainCreditStationInstance<ContractType, TypesMap> {
        return super.getInstance<TypesMap>(
            target
        ) as SchainCreditStationInstance<ContractType, TypesMap>;
    }
}
