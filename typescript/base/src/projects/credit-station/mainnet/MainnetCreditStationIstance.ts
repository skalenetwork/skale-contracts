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


export class MainnetCreditStationInstance<ContractType> extends
    CreditStationInstance<ContractType, MainnetCreditStationContractName> {
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
