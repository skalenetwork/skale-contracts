import { Instance } from "../../instance";
import { Project } from "../../project";
import { SkaleManagerInstance } from "./skaleManagerInstance";

export class SkaleManagerProject extends Project {
    githubRepo = "https://github.com/skalenetwork/skale-manager/";

    createInstance (address: string): Instance {
        return new SkaleManagerInstance(
            this,
            address
        );
    }

    static getAbiFilename (version: string) {
        return `skale-manager-${version}-abi.json`;
    }
}
