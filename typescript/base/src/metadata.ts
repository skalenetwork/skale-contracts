import { METADATA_FILENAME, REPOSITORY_URL } from "./domain/constants";
import {
    MetadataIsNotDownloaded
} from "./domain/errors/metadata/metadataIsNotDownloaded";
import { SkaleProjectName } from "./projects/factory";

import axios from "axios";


export type NetworkMetadata = {
    name: string;
    chainId: number;
    path: string;
}

export type ProjectMetadata = {
    name: SkaleProjectName;
    path: string;
}

type MetadataFile = {
    networks: NetworkMetadata[];
    projects: ProjectMetadata[];
}

export class Metadata {
    private networksMetadata: NetworkMetadata[] | undefined;

    private projectsMetadata: ProjectMetadata[] | undefined;

    private static NOT_DOWNLOADED_ERROR = "download() method has to be called";

    get networks (): NetworkMetadata[] {
        if (typeof this.networksMetadata === "undefined") {
            throw new MetadataIsNotDownloaded(Metadata.NOT_DOWNLOADED_ERROR);
        }
        return this.networksMetadata;
    }

    get projects (): ProjectMetadata[] {
        if (typeof this.projectsMetadata === "undefined") {
            throw new MetadataIsNotDownloaded(Metadata.NOT_DOWNLOADED_ERROR);
        }
        return this.projectsMetadata;
    }

    async download () {
        if (typeof this.networksMetadata === "undefined") {
            const metadata =
                (await axios.get(REPOSITORY_URL + METADATA_FILENAME)).data as
                    MetadataFile;
            this.networksMetadata = metadata.networks;
            this.projectsMetadata = metadata.projects;
        }
    }
}
