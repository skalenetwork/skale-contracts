

import { ContractAddressMap, MainContractAddress } from "../../../domain/types";
import {
    MainnetCreditStationContractName,
    MainnetCreditStationInstance
} from "./MainnetCreditStationInstance";
import { CreditStationInstance } from "../CreditStationInstance";
import { CreditStationProject } from "../CreditStationProject";


export class MainnetCreditStationProject<ContractType> extends
    CreditStationProject<ContractType, MainnetCreditStationContractName> {
    mainContractName = "Ledger";

    createInstance (
        address: MainContractAddress | ContractAddressMap
    ): CreditStationInstance<ContractType, MainnetCreditStationContractName> {
        return new MainnetCreditStationInstance<ContractType>(
            this,
            address
        );
    }
}
