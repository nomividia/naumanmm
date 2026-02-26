import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { GDriveFile, GDriveMimeType } from "nextalys-node-helpers";
import { GenericResponse } from "../../models/responses/generic-response";

class GDriveFileClass implements GDriveFile {
    @ApiProperty({ type: String })
    mimeType: GDriveMimeType;
    @ApiPropertyOptional({ type: () => GDriveFileClass, isArray: true })
    children?: GDriveFileClass[];
    @ApiProperty()
    id: string;
    @ApiProperty()
    name: string;
    @ApiPropertyOptional({ type: String, isArray: true })
    parents: string[];
    @ApiProperty()
    modifiedTime: string;
    @ApiProperty()
    fileExtension: string;
    @ApiProperty()
    size: number;
    @ApiProperty()
    ownedByMe: boolean;
    @ApiProperty()
    shared: boolean;
    @ApiProperty()
    driveId: string;
    @ApiProperty()
    createdTime: string;
}

export class GetGDriveFilesResponse extends GenericResponse {

    @ApiProperty({ type: () => GDriveFileClass, isArray: true })
    files: GDriveFile[] = [];
}

export class GetGDriveFileResponse extends GenericResponse {

    @ApiProperty({ type: () => GDriveFileClass })
    file: GDriveFile;
}
