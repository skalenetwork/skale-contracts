import {
    ACCESS_MANAGER_NAME,
    CreditStationInstance
} from "../CreditStationInstance";
import { ContractAddress } from "../../../domain/types";


export enum SchainCreditStationContract {
    CREDIT_STATION_ACCESS_MANAGER = ACCESS_MANAGER_NAME,
    LEDGER = "Ledger"
}


export type SchainCreditStationContractName = `${SchainCreditStationContract}`;

export class SchainCreditStationInstance<ContractType> extends
    CreditStationInstance<ContractType, SchainCreditStationContractName> {
    contractNames = Object.values(
        SchainCreditStationContract
    ) as SchainCreditStationContractName[];

    getContractAddress (
        name: SchainCreditStationContractName
    ): Promise<ContractAddress> {
        if (this.contractNames.includes(name)) {
            return super.getContractAddress(name);
        }
        throw new Error(
            `Contract name ${name} does not exist in schain-credit-station`
        );
    }
}
