import { Adapter } from "./adapter";
import { Network } from "./network";
import { SkaleContracts } from "./skaleContracts";

export class ListedNetwork<ContractType> extends Network<ContractType> {
    private pathValue;

    constructor(
        skaleContracts: SkaleContracts<ContractType>,
        adapter: Adapter<ContractType>,
        path: string,
    ) {
        super(skaleContracts, adapter);
        this.pathValue = path;
    }

    get path() {
        return this.pathValue;
    }
}
