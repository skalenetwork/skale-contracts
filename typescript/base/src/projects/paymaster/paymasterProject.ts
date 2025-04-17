import { ContractAddressMap, MainContractAddress } from "../../domain/types";
import { PaymasterContract, PaymasterInstance } from "./paymasterInstance";
import { Instance } from "../../instance";
import { Project } from "../../project";

export class PaymasterProject<ContractType> extends
    Project<ContractType> {
    githubRepo = "https://github.com/skalenetwork/paymaster/";

    mainContractName = PaymasterContract.PAYMASTER;

    createInstance (address: MainContractAddress | ContractAddressMap)
        : Instance<ContractType> {
        return new PaymasterInstance(
            this,
            address
        );
    }

    getAbiFilename (version: string) {
        return `${this.metadata.name}-${version}-abi.json`;
    }
}
