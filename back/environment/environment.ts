import * as path from 'path';
import { AppDirectories } from '../../shared/shared-constants';

const NODE_ENV = process.env.NODE_ENV || 'development';
let EnvironmentJsonFile;

try {
    EnvironmentJsonFile = require(`./env.${NODE_ENV}.json`);
} catch (error) {
    console.warn(`env.${NODE_ENV}.json not found, falling back to env.json`);
    EnvironmentJsonFile = require('./env.json');
}
const projectUseTypeOrmMigrations = true;
export class AppEnvironment {
    db_host: string;
    db_port: number;
    db_user: string;
    db_password: string;
    db_name: string;
    db_log_enabled: boolean = false;
    ApiPort: number;
    ApiScheme: 'http' | 'https' = 'https';
    EnvName: 'development' | 'val' | 'production' = 'development';
    PdfPublicOutputFolder?: string;
    PdfPrivateOutputFolder?: string;
    HtmlTemplatesFolderName?: string;
    UploadedFilesTempDirectory?: string;
    UserPublicFilesDirectory?: string;
    UserPrivateFilesDirectory?: string;
    PublicImagesFolder?: string;
    SmtpHost: string;
    SmtpUser: string;
    SmtpPassword: string;
    SmtpPort: number;
    MailSender: string;
    SsrEnabled: boolean;
    PrivateUploadsDirectoryName?: string;
    PublicUploadsDirectoryName?: string;
    BaseURL: string;
    SendInBlueApiKey?: string;
    UseRedis?: boolean = false;
    GDriveClientSecretFileName?: string;
    PublicFolder?: string;
    PublicTempFolder?: string;
    FirebaseEnabled?: boolean = false;
    FirebaseDbUrl?: string;
    UseRedisCache?: boolean = false;
    MailProvider?: 'SendInBlue' | 'SMTP' = 'SMTP';
    SmtpSecure?: boolean = true;
    IgnoreAllMailSending?: boolean = false;
    PreserveFilesInTempDirectory?: boolean = false;
    GoogleRecaptchaSecretKey?: string;
    CandidateApplicationsDirectory?: string;
    JobAdderBackupHost?: string;
    JobAdderBackupUser?: string;
    JobAdderBackupPassword?: string;
    CandidatesDirectory?: string;
    CandidateApplicationsPublicDirectory?: string;
    CandidatesPublicDirectory?: string;
    JobAdderAttachmentsFolder?: string;
    JobAdderMigrationFiles: boolean = false;
    CandidateApplicationsMigrationCsvFiles: boolean = false;
    ForceDeleteGCloudFiles: boolean = false;
    UseTypeOrmMigrations?: boolean = false;
    UseRedisWebSocketAdapter?: boolean = false;
    SlackToken?: string;
    SmsProvider?: 'SendInBlue' = 'SendInBlue';
    IgnoreAllSmsSending?: boolean = false;
    PM2AppName?: string;
    PM2ClusterMode?: boolean = false;
    GCloudAppEngineHosted?: boolean = false;
    ApiKey?: string;

    constructor(public ApiBasePath: string) {}
}

const EnvironmentData = new AppEnvironment(process.cwd());
for (const envKey in EnvironmentJsonFile) {
    EnvironmentData[envKey] = EnvironmentJsonFile[envKey];
}
if (EnvironmentData.EnvName === 'development') {
    //specific for development
    EnvironmentData.ApiBasePath = path.join(process.cwd(), 'back');
} else if (EnvironmentData.EnvName === 'val') {
    //specific for val
    EnvironmentData.ApiBasePath = path.join(process.cwd(), 'back');
} else if (EnvironmentData.EnvName === 'production') {
    //specific for production
    EnvironmentData.ApiBasePath = path.join(process.cwd(), 'back');
}

const uploadDirectory = path.join(
    EnvironmentData.ApiBasePath,
    AppDirectories.Uploads,
);

EnvironmentData.HtmlTemplatesFolderName = 'html_templates';
EnvironmentData.PublicUploadsDirectoryName = 'public';
EnvironmentData.PrivateUploadsDirectoryName = 'private';

EnvironmentData.PublicImagesFolder = path.join(
    uploadDirectory,
    EnvironmentData.PublicUploadsDirectoryName,
    AppDirectories.Images,
);

EnvironmentData.PdfPublicOutputFolder = path.join(
    uploadDirectory,
    EnvironmentData.PublicUploadsDirectoryName,
    'pdf_output',
);

EnvironmentData.PdfPrivateOutputFolder = path.join(
    uploadDirectory,
    EnvironmentData.PrivateUploadsDirectoryName,
    'pdf_output',
);

EnvironmentData.UploadedFilesTempDirectory = path.join(
    uploadDirectory,
    'uploaded-files-temp',
);

EnvironmentData.UserPrivateFilesDirectory = path.join(
    uploadDirectory,
    EnvironmentData.PrivateUploadsDirectoryName,
    'users',
);

EnvironmentData.UserPublicFilesDirectory = path.join(
    uploadDirectory,
    EnvironmentData.PublicUploadsDirectoryName,
    'users',
);

EnvironmentData.CandidateApplicationsDirectory = path.join(
    uploadDirectory,
    EnvironmentData.PrivateUploadsDirectoryName,
    'candidate-applications',
);

EnvironmentData.CandidateApplicationsPublicDirectory = path.join(
    uploadDirectory,
    EnvironmentData.PublicUploadsDirectoryName,
    'candidate-applications',
);

EnvironmentData.CandidatesDirectory = path.join(
    uploadDirectory,
    EnvironmentData.PrivateUploadsDirectoryName,
    'candidates',
);

EnvironmentData.CandidatesPublicDirectory = path.join(
    uploadDirectory,
    EnvironmentData.PublicUploadsDirectoryName,
    'candidates',
);

EnvironmentData.PublicFolder = path.join(
    uploadDirectory,
    EnvironmentData.PublicUploadsDirectoryName,
);

EnvironmentData.PublicTempFolder = path.join(
    uploadDirectory,
    EnvironmentData.PublicUploadsDirectoryName,
    AppDirectories.Temp,
);

// console.log(': Environment', EnvironmentData);
export const Environment = EnvironmentData;

Environment.UseTypeOrmMigrations =
    projectUseTypeOrmMigrations || Environment.UseTypeOrmMigrations;
export const FoldersToCreateOnInit: string[] = [
    EnvironmentData.UploadedFilesTempDirectory,
    EnvironmentData.PublicImagesFolder,
    EnvironmentData.UserPrivateFilesDirectory,
    EnvironmentData.CandidateApplicationsDirectory,
    EnvironmentData.CandidatesDirectory,
    EnvironmentData.CandidateApplicationsPublicDirectory,
    EnvironmentData.CandidatesPublicDirectory,
    EnvironmentData.PublicTempFolder,
];
