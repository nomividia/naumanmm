import { GCloudStorageService } from "./gcloud-storage-service";
export declare class GDriveModule {
    private gCloudStorageService;
    initialized: boolean;
    initializing: boolean;
    constructor(gCloudStorageService: GCloudStorageService);
    init(): Promise<void>;
}
