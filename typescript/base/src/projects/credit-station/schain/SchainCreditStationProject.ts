import { ContractAddressMap, MainContractAddress } from "../../../domain/types";
import {
    SchainCreditStationContractName,
    SchainCreditStationInstance
} from "./SchainCreditStationIstance";
import { CreditStationInstance } from "../CreditStationInstance";
import { CreditStationProject } from "../CreditStationProject";


export class SchainCreditStationProject<ContractType> extends
    CreditStationProject<ContractType, SchainCreditStationContractName> {
    mainContractName = "Ledger";

    createInstance (
        address: MainContractAddress | ContractAddressMap
    ): CreditStationInstance<ContractType, SchainCreditStationContractName> {
        return new SchainCreditStationInstance<ContractType>(
            this,
            address
        );
    }
}
