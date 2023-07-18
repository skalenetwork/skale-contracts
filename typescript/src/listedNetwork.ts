import { Network } from "./network";
import { Provider } from "@ethersproject/providers";
import { SkaleContracts } from "./skaleContracts";

export class ListedNetwork extends Network {
    private pathValue;

    constructor (
        skaleContracts: SkaleContracts,
        provider: Provider,
        path: string
    ) {
        super(
            skaleContracts,
            provider
        );
        this.pathValue = path;
    }

    get path () {
        return this.pathValue;
    }
}
