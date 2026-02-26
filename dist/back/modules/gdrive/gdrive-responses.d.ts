import { GDriveFile } from "nextalys-node-helpers";
import { GenericResponse } from "../../models/responses/generic-response";
export declare class GetGDriveFilesResponse extends GenericResponse {
    files: GDriveFile[];
}
export declare class GetGDriveFileResponse extends GenericResponse {
    file: GDriveFile;
}
