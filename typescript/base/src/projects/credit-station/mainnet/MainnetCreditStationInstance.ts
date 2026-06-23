import {
    ACCESS_MANAGER_NAME,
    CreditStationInstance
} from "../CreditStationInstance";
import { ContractAddress } from "../../../domain/types";


export enum MainnetCreditStationContract {
    CREDIT_STATION_ACCESS_MANAGER = ACCESS_MANAGER_NAME,
    CREDIT_STATION = "CreditStation"
}

export type MainnetCreditStationContractName =
    `${MainnetCreditStationContract}`;


export interface MainnetCreditStationDefaultTypesMap<ContractType>
    extends Record<MainnetCreditStationContractName, ContractType> {}

export class MainnetCreditStationInstance<
    ContractType,
    TypesMap extends Record<
        MainnetCreditStationContractName,
        ContractType
    > = MainnetCreditStationDefaultTypesMap<ContractType>
> extends CreditStationInstance<
    ContractType,
    MainnetCreditStationContractName,
    TypesMap
> {
    contractNames = Object.values(
        MainnetCreditStationContract
    ) as MainnetCreditStationContractName[];

    getContractAddress (
        name: MainnetCreditStationContractName
    ): Promise<ContractAddress> {
        if (this.contractNames.includes(name)) {
            return super.getContractAddress(name);
        }
        throw new Error(
            `Contract name ${name} does not exist in mainnet-credit-station`
        );
    }
}
