import { Instance } from "../../instance";
import { PaymasterInstance } from "./paymasterInstance";
import { Project } from "../../project";

export class PaymasterProject<ContractType> extends
    Project<ContractType> {
    githubRepo = "https://github.com/skalenetwork/paymaster/";

    createInstance (address: string): Instance<ContractType> {
        return new PaymasterInstance(
            this,
            address
        );
    }

    getAbiFilename (version: string) {
        return `${this.metadata.name}-${version}-abi.json`;
    }
}
