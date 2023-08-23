import { Project } from "../../project";

export abstract class ImaProject<ContractType> extends
    Project<ContractType> {
    githubRepo = "https://github.com/skalenetwork/IMA/";
}
