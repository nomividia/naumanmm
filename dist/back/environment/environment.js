"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoldersToCreateOnInit = exports.Environment = exports.AppEnvironment = void 0;
const path = require("path");
const shared_constants_1 = require("../../shared/shared-constants");
const NODE_ENV = process.env.NODE_ENV || 'development';
let EnvironmentJsonFile;
try {
    EnvironmentJsonFile = require(`./env.${NODE_ENV}.json`);
}
catch (error) {
    console.warn(`env.${NODE_ENV}.json not found, falling back to env.json`);
    EnvironmentJsonFile = require('./env.json');
}
const projectUseTypeOrmMigrations = true;
class AppEnvironment {
    constructor(ApiBasePath) {
        this.ApiBasePath = ApiBasePath;
        this.db_log_enabled = false;
        this.ApiScheme = 'https';
        this.EnvName = 'development';
        this.UseRedis = false;
        this.FirebaseEnabled = false;
        this.UseRedisCache = false;
        this.MailProvider = 'SMTP';
        this.SmtpSecure = true;
        this.IgnoreAllMailSending = false;
        this.PreserveFilesInTempDirectory = false;
        this.JobAdderMigrationFiles = false;
        this.CandidateApplicationsMigrationCsvFiles = false;
        this.ForceDeleteGCloudFiles = false;
        this.UseTypeOrmMigrations = false;
        this.UseRedisWebSocketAdapter = false;
        this.SmsProvider = 'SendInBlue';
        this.IgnoreAllSmsSending = false;
        this.PM2ClusterMode = false;
        this.GCloudAppEngineHosted = false;
    }
}
exports.AppEnvironment = AppEnvironment;
const EnvironmentData = new AppEnvironment(process.cwd());
for (const envKey in EnvironmentJsonFile) {
    EnvironmentData[envKey] = EnvironmentJsonFile[envKey];
}
if (EnvironmentData.EnvName === 'development') {
    EnvironmentData.ApiBasePath = path.join(process.cwd(), 'back');
}
else if (EnvironmentData.EnvName === 'val') {
    EnvironmentData.ApiBasePath = path.join(process.cwd(), 'back');
}
else if (EnvironmentData.EnvName === 'production') {
    EnvironmentData.ApiBasePath = path.join(process.cwd(), 'back');
}
const uploadDirectory = path.join(EnvironmentData.ApiBasePath, shared_constants_1.AppDirectories.Uploads);
EnvironmentData.HtmlTemplatesFolderName = 'html_templates';
EnvironmentData.PublicUploadsDirectoryName = 'public';
EnvironmentData.PrivateUploadsDirectoryName = 'private';
EnvironmentData.PublicImagesFolder = path.join(uploadDirectory, EnvironmentData.PublicUploadsDirectoryName, shared_constants_1.AppDirectories.Images);
EnvironmentData.PdfPublicOutputFolder = path.join(uploadDirectory, EnvironmentData.PublicUploadsDirectoryName, 'pdf_output');
EnvironmentData.PdfPrivateOutputFolder = path.join(uploadDirectory, EnvironmentData.PrivateUploadsDirectoryName, 'pdf_output');
EnvironmentData.UploadedFilesTempDirectory = path.join(uploadDirectory, 'uploaded-files-temp');
EnvironmentData.UserPrivateFilesDirectory = path.join(uploadDirectory, EnvironmentData.PrivateUploadsDirectoryName, 'users');
EnvironmentData.UserPublicFilesDirectory = path.join(uploadDirectory, EnvironmentData.PublicUploadsDirectoryName, 'users');
EnvironmentData.CandidateApplicationsDirectory = path.join(uploadDirectory, EnvironmentData.PrivateUploadsDirectoryName, 'candidate-applications');
EnvironmentData.CandidateApplicationsPublicDirectory = path.join(uploadDirectory, EnvironmentData.PublicUploadsDirectoryName, 'candidate-applications');
EnvironmentData.CandidatesDirectory = path.join(uploadDirectory, EnvironmentData.PrivateUploadsDirectoryName, 'candidates');
EnvironmentData.CandidatesPublicDirectory = path.join(uploadDirectory, EnvironmentData.PublicUploadsDirectoryName, 'candidates');
EnvironmentData.PublicFolder = path.join(uploadDirectory, EnvironmentData.PublicUploadsDirectoryName);
EnvironmentData.PublicTempFolder = path.join(uploadDirectory, EnvironmentData.PublicUploadsDirectoryName, shared_constants_1.AppDirectories.Temp);
exports.Environment = EnvironmentData;
exports.Environment.UseTypeOrmMigrations =
    projectUseTypeOrmMigrations || exports.Environment.UseTypeOrmMigrations;
exports.FoldersToCreateOnInit = [
    EnvironmentData.UploadedFilesTempDirectory,
    EnvironmentData.PublicImagesFolder,
    EnvironmentData.UserPrivateFilesDirectory,
    EnvironmentData.CandidateApplicationsDirectory,
    EnvironmentData.CandidatesDirectory,
    EnvironmentData.CandidateApplicationsPublicDirectory,
    EnvironmentData.CandidatesPublicDirectory,
    EnvironmentData.PublicTempFolder,
];
//# sourceMappingURL=environment.js.map