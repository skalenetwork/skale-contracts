import { Project } from "../../project";

export abstract class CreditStationProject<
    ContractType,
    ContractName extends string
> extends Project<ContractType, ContractName> {
    githubRepo = "https://github.com/skalenetwork/credit-station/";

    getAbiFilename (version: string) {
        return `${this.metadata.name}-${version}-abi.json`;
    }
}
