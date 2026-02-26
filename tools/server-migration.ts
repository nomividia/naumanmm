import {
    FtpOptions,
    FtpResponse,
} from "nextalys-node-helpers/dist/helpers/ftp/ftp-client-base";
import { FtpManager } from "nextalys-node-helpers/dist/ssh-ftp-helpers";
import * as path from "path";
import * as ServerConfig from "./server-config.json";
const FtpDeploy = require("ftp-deploy");

class FtpDeployManager {
    private static options: FtpOptions;
    static ftpClientNative: any;
    static init(options: FtpOptions) {
        this.options = options;
        this.ftpClientNative = new FtpDeploy();
    }
    static async publishFolder(
        source: string,
        dest: string,
        include: string[],
        exclude?: string[],
        deleteRemote?: boolean
    ): Promise<FtpResponse> {
        const res: FtpResponse = { success: false };

        try {
            if (typeof FtpDeploy === "undefined") {
                throw new Error(
                    "FtpDeploy is not available. npm install ftp-deploy"
                );
            }

            if (!this.options) {
                throw new Error("call init to set options");
            }

            const config = {
                user: this.options.user, // NOTE that this was username in 1.x
                password: this.options.password, // optional, prompted if none given
                host: this.options.host,
                port: this.options.port,
                localRoot: source,
                remoteRoot: dest,
                include: include, // this would upload everything except dot files //['*', '**/*']
                //include: ['*.php', 'dist/*'],
                exclude: exclude, // e.g. exclude sourcemaps - ** exclude: [] if nothing to exclude ** //['dist/**/*.map', 'back/**/env.json']
                deleteRemote: !!deleteRemote, // delete ALL existing files at destination before uploading, if true
                forcePasv: true, // Passive mode is forced (EPSV command is not sent)
                sftp: !!this.options.sftp,
            };

            const ftpData = await this.ftpClientNative.deploy(config);

            // console.log('FTP upload finished:', res);
            res.data = ftpData;
            res.success = true;
        } catch (err) {
            // console.error(err);
            res.error = err;
            res.success = false;
        }

        return res;
    }
}
class GlobalHelpers {
    public static handleError(error: string | any) {
        if (
            typeof error !== "undefined" &&
            error.underline &&
            error.underline.red
        ) {
            console.error(error.underline.red);
        } else {
            console.error(error);
        }

        process.exit(1);
    }
}

if (typeof process === "undefined") {
    GlobalHelpers.handleError("Cannot access node process object !");
}

const ftp_user = ServerConfig?.remote?.user;
const ftp_password = ServerConfig?.remote?.password;
const ftp_server = ServerConfig?.remote?.host;

const originBasePath = ServerConfig?.origin?.basePath;
const remoteBasePath = ServerConfig?.remote?.basePath;

console.log("originBasePath", originBasePath);
console.log("remoteBasePath", remoteBasePath);

console.log("ftp_user", ftp_user);
console.log("ftp_password", ftp_password);
console.log("ftp_server", ftp_server);

if (
    !ftp_user ||
    !ftp_password ||
    !ftp_server ||
    !originBasePath ||
    !remoteBasePath
) {
    GlobalHelpers.handleError("Invalid arguments !");
}

async function buildAndPublish() {
    try {
        let filesToCopy: { from: string; to: string }[] = [
            {
                from: path.join(
                    originBasePath,
                    "back",
                    "environment",
                    "env.json"
                ),
                to: path.join(
                    remoteBasePath,
                    "back",
                    "environment",
                    "env.json"
                ),
            },
            {
                from: path.join(
                    originBasePath,
                    "back",
                    "environment",
                    "env.json"
                ),
                to: path.join(
                    remoteBasePath,
                    "dist",
                    "back",
                    "environment",
                    "env.json"
                ),
            },
            {
                from: path.join(
                    originBasePath,
                    "front",
                    "src",
                    "environments",
                    "environment.override.ts"
                ),
                to: path.join(
                    remoteBasePath,
                    "front",
                    "src",
                    "environments",
                    "environment.override.ts"
                ),
            },
        ];

        filesToCopy = [];

        let foldersToCopy: { from: string; to: string }[] = [
            {
                from: path.join(originBasePath, "dist", "back", "uploads"),
                to: path.join(remoteBasePath, "dist", "back", "uploads"),
            },
        ];

        foldersToCopy = [
            {
                from: path.join(
                    originBasePath,
                    "dist",
                    "back",
                    "uploads",
                    "public"
                ),
                to: path.join(
                    remoteBasePath,
                    "dist",
                    "back",
                    "uploads",
                    "public"
                ),
            },
        ];

        FtpManager.init("sftp", {
            user: ftp_user,
            password: ftp_password,
            host: ftp_server,
            port: 22,
            sftp: true,
        });

        for (const file of filesToCopy) {
            const ftpResponse = await FtpManager.uploadFile(file.from, file.to);

            console.log("file uploaded : " + file.from);

            if (!ftpResponse.success) {
                console.error(
                    "Error while uploading file",
                    file.from,
                    "to",
                    file.to
                );
                GlobalHelpers.handleError(ftpResponse.error);

                return;
            }
        }

        FtpDeployManager.init({
            user: ftp_user,
            password: ftp_password,
            host: ftp_server,
            port: 22,
            sftp: true,
        });

        FtpDeployManager?.ftpClientNative?.on("upload-error", (data: any) => {
            GlobalHelpers.handleError(
                "Error while uploading file " + data.filename
            );
            GlobalHelpers.handleError(data);
        });

        FtpDeployManager?.ftpClientNative?.on("uploaded", (data: any) => {
            if (
                data?.transferredFileCount != null &&
                data?.totalFilesCount != null
            ) {
                const percentage = Math.round(
                    (data.transferredFileCount / data.totalFilesCount) * 100
                );

                console.log(
                    "[" +
                        percentage +
                        "%] - file " +
                        data.transferredFileCount +
                        "/" +
                        data.totalFilesCount +
                        " uploaded : " +
                        data.filename
                );
            } else {
                console.log("file uploaded : " + (data?.filename || ""));
            }
        });

        for (const folder of foldersToCopy) {
            const ftpResponse = await FtpDeployManager.publishFolder(
                folder.from,
                folder.to,
                ["*", "**/*"]
            );

            if (!ftpResponse) {
                GlobalHelpers.handleError(
                    "Error while uploading file " +
                        folder.from +
                        "to" +
                        folder.to
                );

                return;
            }
        }
    } catch (err) {
        GlobalHelpers.handleError(err);
    }
}

try {
    buildAndPublish()
        .then(() => {
            console.log("Publish finished with success !");
            process.exit(0);
        })
        .catch((err) => {
            GlobalHelpers.handleError(err);
        });
} catch (err) {
    GlobalHelpers.handleError(err);
}
