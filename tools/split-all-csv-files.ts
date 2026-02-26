import { FileHelpers, NodeHelpers } from "nextalys-node-helpers";
import { ScriptHelpers } from "./helpers";

ScriptHelpers.log("--- SPLIT ALL CSV FILES START ---");

let csvFiles: string[] = [];

async function splitCsvFiles() {
    const cwd = FileHelpers.joinPaths(__dirname, "..");

    const csvFilesFolder = FileHelpers.joinPaths(
        __dirname,
        "..",
        "back",
        "import-data"
    );

    csvFiles = await FileHelpers.getFilesInFolder(csvFilesFolder, {
        returnFullPath: true,
    });

    ScriptHelpers.log(csvFiles.length + " csv files to split");

    for (const csvFile of csvFiles) {
        if (!csvFile || !csvFile.endsWith(".csv")) {
            continue;
        }

        const cmd = 'npm run split-csv -- "' + csvFile + '"';
        ScriptHelpers.log(cmd, "in folder : " + cwd);
        await NodeHelpers.executeCommand(cmd, { cwd: cwd });
    }
}

try {
    splitCsvFiles()
        .then(() => {
            ScriptHelpers.log(csvFiles.length + " csv files splitted");
            ScriptHelpers.endScript("--- SPLIT ALL CSV FILES END ---");
        })
        .catch((err) => {
            ScriptHelpers.handleError(err);
        });
} catch (err) {
    ScriptHelpers.handleError(err);
}
