import { FileHelpers, NodeHelpers } from "nextalys-node-helpers";
import * as path from "path";
import { ScriptHelpers } from "./helpers";

let envName: "prod" | "val" = "prod";
process.argv.forEach((val, index, array) => {
    if (index === 2) envName = val as any;
});

async function BuildApplication() {
    try {
        ScriptHelpers.log("Building application for env : " + envName);

        const rootFolder = path.join(__dirname, "..");
        const distFolder = path.join(rootFolder, "dist");
        const backDistFolder = path.join(distFolder, "back");
        const frontFolder = path.join(rootFolder, "front");

        const backEnvDistFolder = path.join(backDistFolder, "environment");

        if (!(await FileHelpers.isDirectory(backEnvDistFolder))) {
            await FileHelpers.createDirectory(backEnvDistFolder);
        }

        // await NodeHelpers.executeCommand('npx ngcc', { cwd: rootFolder });

        const envOverrideFile = path.join(
            frontFolder,
            "src",
            "environments",
            "environment.override.ts"
        );

        const envFileNameToCopy = "environment." + envName + ".ts";

        const envProdFile = path.join(
            frontFolder,
            "src",
            "environments",
            envFileNameToCopy
        );

        if (!(await FileHelpers.fileExists(envOverrideFile))) {
            ScriptHelpers.log(
                "env override does not exist - copying " +
                    envFileNameToCopy +
                    "..."
            );
            await FileHelpers.copyFile(envProdFile, envOverrideFile);
        }

        await NodeHelpers.executeCommand("npm run build:back", {
            cwd: rootFolder,
            autoLogResponse: true,
        });

        //useless
        // const envDistFile = path.join(backEnvDistFolder, 'env.json');
        // if (!await FileHelpers.fileExists(envDistFile)) {
        //     ScriptHelpers.log('env.json does not exist in dist folder - copying env.json...');
        //     await FileHelpers.copyFile(path.join(rootFolder, 'back', 'environment', 'env.default.json'), envDistFile);
        // }

        await NodeHelpers.executeCommand("npm run build:front-" + envName, {
            cwd: rootFolder,
            autoLogResponse: true,
        });

        await NodeHelpers.executeCommand("npm run copy-files-after-build", {
            cwd: rootFolder,
            autoLogResponse: true,
        });
    } catch (err) {
        ScriptHelpers.handleError(err);
    }
}

try {
    BuildApplication()
        .then(() => {
            ScriptHelpers.endScript("Build finished with success !");
        })
        .catch((err) => {
            ScriptHelpers.handleError(err);
        });
} catch (err) {
    ScriptHelpers.handleError(err);
}
