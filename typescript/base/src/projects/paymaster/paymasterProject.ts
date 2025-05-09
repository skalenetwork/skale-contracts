import { ContractAddressMap, MainContractAddress } from "../../domain/types";
import {
    PaymasterContract,
    PaymasterContractName,
    PaymasterInstance
} from "./paymasterInstance";
import { Instance } from "../../instance";
import { Project } from "../../project";

export class PaymasterProject<ContractType> extends
    Project<ContractType, PaymasterContractName> {
    githubRepo = "https://github.com/skalenetwork/paymaster/";

    mainContractName = PaymasterContract.PAYMASTER;

    createInstance (address: MainContractAddress | ContractAddressMap)
        : Instance<ContractType, PaymasterContractName> {
        return new PaymasterInstance(
            this,
            address
        );
    }

    getAbiFilename (version: string) {
        return `${this.metadata.name}-${version}-abi.json`;
    }
}
