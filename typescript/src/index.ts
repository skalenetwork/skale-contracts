import { AliasResolver } from "./resolvers/aliasResolver";

export class Skale {
    hello() {
        console.log("Hello");
        const ar = new AliasResolver();
        console.log(ar.resolve("mainnet", "skale-manager"));
    }
}
