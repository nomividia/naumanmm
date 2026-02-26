import { ApiProperty } from '@nestjs/swagger';
import { GenericResponse } from '../../models/responses/generic-response';

export interface JA_Contact {
    FirstName: string;
    LastName: string;
    Phone: string;
    Email: string;
    ContactID: number;
    Salutation: string;
    Mobile: string;
    Deleted: boolean;
    PhoneNumeric: string;
    MobileNumeric: string;
    MobileNormalized: string;
    DateCreated: Date;
}

export interface JA_Candidate {
    CandidateID: number;
    CurrentEmployer: string;
    AddressLine1: string;
    AddressLine2: string;
    ContactID: number;
    Contact: JA_Contact;
    AddressSuburb: string;
    AddressState: string;
    AddressPostcode: string;
    AddressCountry: string;
    StatusID: number;
    Deleted: boolean;
    Email: string;
    DateOfBirth: Date;
}

export interface JA_CandidateStatus {
    Name: string;
    Closed: boolean;
    Default: boolean;
    Deleted: boolean;
    Archived: boolean;
    FloatDefault: boolean;
    StatusID: number;
}

export interface JA_CandidateCustomField {
    FieldID: number;
    Value: string;
    ValueText: string;
}

export interface JA_CustomField {
    FieldID: number;
    Name: string;
    FieldType: string;
    ListMultiSelect: boolean;
    ListValues: string;
    ViewRow: number;
}

export interface JA_CandidateEducation {
    EducationID: number;
    Institution: string;
    Course: string;
    EndDate: string;
}

export interface JA_CandidateNote {
    ContactID: number;
    NoteID: string;
    CandidateNoteID: string;
}

export interface JA_Note {
    NoteID: string;
    Type: string;
    Summary: string;
    Text: string;
    DateCreated: Date;
}
export interface JA_Attachment {
    FileType?: string;
    AttachmentID: number;
    Type: 'Note' | 'Company' | 'Candidate' | 'Contact' | 'JobOrder';
    NoteAttachmentID: string;
    CandidateAttachmentID: number;
    FileName: string;
    DataCreatedUtc: Date;
    XmlStorageName: Date;
    HtmlStorageName: string;
    StorageName: string;
}
export interface JA_CandidateEmploymentHistory {
    ContactID: number;
    EmploymentID: number;
    Employer: string;
    Position: string;
    Location: string;
    StartDate: Date;
    EndDate: Date;
    Description: string;
}
export interface JA_Contact_Attachment {
    AttachmentID: number;
    ContactAttachmentID: number;

    ContactID: string;
    Type: 'Terms' | 'Other';
    Label: string;
    FileName: string;
    FileType: string;
    FileSize: number;
}

export interface JA_Candidate_Attachment {
    AttachmentID: number;
    ContactID: number;
    Type:
        | 'FormattedResume'
        | 'Other'
        | 'Resume'
        | 'License'
        | 'CoverLetter'
        | 'Reference'
        | 'Check'
        | 'Screening';
    FileName: string;
    FileType: string;
    FileSize: number;
}

export interface JA_Contact_Photo {
    ContactID: string;
    Version: number;
    Type: any;
    Data: any;
}

export interface JA_Status {
    StatusID: string;
    Name: string;
}

export interface JA_Application {
    ApplicationID: string;
    Email: string;
    StatusID: string;
    OwnerUserID: string;
    JobReference: string;
    JobTitle: string;
}

export class DataMigrationResponse extends GenericResponse {
    @ApiProperty()
    successList: number[] = [];

    @ApiProperty()
    errorsList: number[] = [];

    @ApiProperty()
    ignoredList: number[] = [];

    @ApiProperty()
    attachmentsIgnored: number[] = [];

    @ApiProperty()
    attachmentsErrors: number[] = [];
}

export class DataMigrationCandidateApplicationResponse extends GenericResponse {
    @ApiProperty()
    successList: string[] = [];

    @ApiProperty()
    successListCount = 0;

    @ApiProperty()
    linesPerFile: { fileName: string; lines: number }[] = [];

    @ApiProperty()
    totalLinesRead = 0;

    @ApiProperty()
    errorsList: string[] = [];

    @ApiProperty()
    ignoredList: string[] = [];

    @ApiProperty()
    bytesIgnored = 0;

    @ApiProperty()
    bytesAdded = 0;

    @ApiProperty()
    get megaBytesAdded() {
        return this.getMegaBytes(this.bytesAdded);
    }

    @ApiProperty()
    get megaBytesIgnored() {
        return this.getMegaBytes(this.bytesIgnored);
    }

    private getMegaBytes(bytes: number) {
        return bytes / 1024 / 1024;
    }
}
