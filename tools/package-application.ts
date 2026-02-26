import { MainHelpers } from "nextalys-js-helpers";
import { ArchiveManager, FileHelpers } from "nextalys-node-helpers";
import * as path from "path";
import { environment } from "../front/src/environments/environment";
import { ScriptHelpers } from "./helpers";

async function PackageApplication() {
    try {
        const rootFolder = path.join(__dirname, "..");
        const frontFolder = path.join(rootFolder, "front");
        const backFolder = path.join(rootFolder, "back");
        const sharedFolder = path.join(rootFolder, "shared");
        const toolsFolder = path.join(rootFolder, "tools");
        let zipFile = path.join(
            rootFolder,
            MainHelpers.formatToUrl(environment.appName) +
                "_v" +
                environment.version +
                ".zip"
        );

        await FileHelpers.removeFile(zipFile);
        ScriptHelpers.log("creating archive...");
        ArchiveManager.init("Zip");

        const foldersToAdd = [
            backFolder,
            sharedFolder,
            frontFolder,
            toolsFolder,
        ];

        console.log(
            "Log ~ file: package-application.ts ~ line 18 ~ PackageApplication ~ foldersToAdd",
            foldersToAdd
        );

        let filesToAdd = [
            "package.json",
            "package-lock.json",
            "tsconfig.json",
            "ecosystem.config.js",
            "angular.json",
        ];

        filesToAdd = filesToAdd.map((x) => path.join(rootFolder, x));

        console.log(
            "Log ~ file: package-application.ts ~ line 21 ~ PackageApplication ~ filesToAdd",
            filesToAdd
        );

        zipFile = await ArchiveManager.createArchiveFromFolders(
            zipFile,
            foldersToAdd
        );

        for (const fileToAdd of filesToAdd) {
            await ArchiveManager.addFileToArchive(fileToAdd, zipFile);
        }

        await ArchiveManager.removeFileFromArchive(
            zipFile,
            "back/environment/env.json"
        );

        await ArchiveManager.removeFileFromArchive(
            zipFile,
            "back/environment/env.default.json"
        );

        await ArchiveManager.removeFileFromArchive(
            zipFile,
            "front/src/environments/environment.override.ts"
        );

        ScriptHelpers.endScript("archive created : " + zipFile);
    } catch (err) {
        ScriptHelpers.handleError(err);
    }
}

try {
    PackageApplication()
        .then(() => {
            ScriptHelpers.endScript(
                "Package application finished with success !"
            );
        })
        .catch((err) => {
            ScriptHelpers.handleError(err);
        });
} catch (err) {
    ScriptHelpers.handleError(err);
}
