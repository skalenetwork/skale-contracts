import { Adapter } from "./adapter";
import { RetryAdapter } from "./retryAdapter";
import { SkaleContracts } from "./skaleContracts";
import { SkaleProjectName } from "./project";
import { createProject } from "./projects/factory";


export class Network<ContractType> {
    private skaleContracts: SkaleContracts<ContractType>;

    private networkAdapter: Adapter<ContractType>;

    constructor (
        skaleContracts: SkaleContracts<ContractType>,
        adapter: Adapter<ContractType>
    ) {
        this.networkAdapter = new RetryAdapter(adapter);
        this.skaleContracts = skaleContracts;
    }

    get adapter () {
        return this.networkAdapter;
    }

    getProject (name: SkaleProjectName) {
        return createProject<ContractType>(
            this,
            name
        );
    }
}
