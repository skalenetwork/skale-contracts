import { ContractAddressMap, MainContractAddress } from "../../domain/types";
import { Instance } from "../../instance";
import { PaymasterInstance } from "./paymasterInstance";
import { Project } from "../../project";

export class PaymasterProject<ContractType> extends
    Project<ContractType> {
    githubRepo = "https://github.com/skalenetwork/paymaster/";

    mainContractName = "Paymaster";

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
