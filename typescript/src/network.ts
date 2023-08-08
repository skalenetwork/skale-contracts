import { Adapter } from "./adapter";
import { SkaleContracts } from "./skaleContracts";
import { createProject } from "./projects/factory";


export class Network<ContractType, InterfaceType> {
    private skaleContracts: SkaleContracts<ContractType, InterfaceType>;

    private networkAdapter: Adapter<ContractType, InterfaceType>;

    constructor (
        skaleContracts: SkaleContracts<ContractType, InterfaceType>,
        adapter: Adapter<ContractType, InterfaceType>
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
