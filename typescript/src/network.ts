import { Adapter } from "./adapter";
import { SkaleContracts } from "./skaleContracts";
import { createProject } from "./projects/factory";


export class Network<ContractType> {
    private skaleContracts: SkaleContracts<ContractType>;

    private networkAdapter: Adapter<ContractType>;

    constructor (
        skaleContracts: SkaleContracts<ContractType>,
        adapter: Adapter<ContractType>
    ) {
        this.networkAdapter = adapter;
        this.skaleContracts = skaleContracts;
    }

    get adapter () {
        return this.networkAdapter;
    }

    getProject (name: string) {
        return createProject(
            this,
            name
        );
    }
}
