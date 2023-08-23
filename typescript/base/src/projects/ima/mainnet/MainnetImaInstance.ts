import { ImaInstance } from "../ImaInstance";

export class MainnetImaInstance<ContractType> extends
    ImaInstance<ContractType> {
    getContractAddress (name: string): Promise<string> {
        if (name === "MessageProxyForMainnet") {
            return Promise.resolve(this.address);
        }
        throw new Error("Method not implemented.");
    }
}
