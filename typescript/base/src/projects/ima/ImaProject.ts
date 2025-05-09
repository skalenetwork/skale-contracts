import { Project } from "../../project";

export abstract class ImaProject<ContractType, ContractName extends string>
    extends Project<ContractType, ContractName> {
    githubRepo = "https://github.com/skalenetwork/IMA/";
}
