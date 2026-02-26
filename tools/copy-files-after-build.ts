import { FileHelpers } from "nextalys-node-helpers";
import * as path from "path";
import { BackFoldersToCopy } from "./build-config";
import { ScriptHelpers } from "./helpers";

if (typeof process === "undefined") {
    ScriptHelpers.handleError("Cannot access node process object !");
}

async function CopyFilesAfterBuild() {
    try {
        const currentFolder = process.cwd();
        const backFolder = path.join(currentFolder, "back");
        const files = await FileHelpers.getFilesInFolder(backFolder, {
            returnFullPath: false,
        });
        const filesFromBackToCopy: string[] = [];

        for (const file of files) {
            if (
                (file.indexOf("firebase-admin") !== -1 &&
                    file.endsWith(".json")) ||
                file.indexOf("gdrive-client-secret.json") !== -1
            ) {
                filesFromBackToCopy.push(file);
            }
        }

        await FileHelpers.copyFolderRecursive(
            path.join(currentFolder, "dist", "browser-build"),
            path.join(currentFolder, "dist", "browser"),
            { fullPathSpecified: true, replaceIfExists: true }
        );

        await FileHelpers.copyFile(
            path.join(currentFolder, "ecosystem.config.js"),
            path.join(currentFolder, "dist", "ecosystem.config.js")
        );

        await FileHelpers.copyFile(
            path.join(currentFolder, "package.json"),
            path.join(currentFolder, "dist", "package.json")
        );

        for (const backFolderToCopy of BackFoldersToCopy) {
            await FileHelpers.copyFolderRecursive(
                path.join(backFolder, backFolderToCopy),
                path.join(currentFolder, "dist", "back", backFolderToCopy),
                { fullPathSpecified: true, replaceIfExists: true }
            );
        }

        if (filesFromBackToCopy.length > 0) {
            for (const fileToCopy of filesFromBackToCopy) {
                await FileHelpers.copyFile(
                    path.join(backFolder, fileToCopy),
                    path.join(currentFolder, "dist", "back", fileToCopy)
                );
            }
        }
    } catch (err) {
        ScriptHelpers.handleError(err);
    }
}

try {
    CopyFilesAfterBuild()
        .then(() => {
            ScriptHelpers.endScript("Files copied with success !");
        })
        .catch((err) => {
            ScriptHelpers.handleError(err);
        });
} catch (err) {
    ScriptHelpers.handleError(err);
}
