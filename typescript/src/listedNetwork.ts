import { Adapter } from "./adapter";
import { Network } from "./network";
import { SkaleContracts } from "./skaleContracts";


export class ListedNetwork<ContractType, InterfaceType> extends
    Network<ContractType, InterfaceType> {
    private pathValue;

    constructor (
        skaleContracts: SkaleContracts<ContractType, InterfaceType>,
        adapter: Adapter<ContractType, InterfaceType>,
        path: string
    ) {
        super(
            skaleContracts,
            adapter
        );
        this.pathValue = path;
    }

    get path () {
        return this.pathValue;
    }
}
