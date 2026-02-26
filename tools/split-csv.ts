import { MainHelpers } from "nextalys-js-helpers";
import { CSVHelpers } from "nextalys-js-helpers/dist/csv-helpers/csv-helpers";
import { FileHelpers } from "nextalys-node-helpers";
import { ScriptHelpers } from "./helpers";
const path = require("path");
const maxSplit = 2000;

let filePath: string = null;
process.argv.forEach((val, index, array) => {
    if (index === 2) filePath = val as any;
});

ScriptHelpers.log("--- SPLIT CSV START ---");
ScriptHelpers.log("file Path : ", filePath);
ScriptHelpers.log("max Split : ", maxSplit);

// ScriptHelpers.log(process.env);

if (!filePath) {
    ScriptHelpers.handleError("you must provide file path");
    process.exit(1);
}

let currentLinesToSave: string[][] = [];
let currentCsvHeaders: string[] = [];
let currentLineIndex = 0;
let currentFileIndex = 1;
let csvSplittedOutputFolder: string;
let initialFileNameWithoutExt: string;

const filesSaved: { filePath: string; size: number }[] = [];
function resetCurrentLine() {
    currentLineIndex = 0;
    currentLinesToSave = [];
    currentLinesToSave.push(currentCsvHeaders);
}

async function flushCurrentCsvLines() {
    if (!currentLinesToSave?.length || currentLinesToSave.length === 1) {
        return;
    }

    const lastLine = currentLinesToSave[currentLinesToSave.length - 1];
    // console.log("Log ~ file: split-csv.ts ~ line 44 ~ flushCurrentCsvLines ~ lastLine", currentLinesToSave[currentLinesToSave.length - 1]);

    if (lastLine.length <= 1) {
        currentLinesToSave.splice(currentLinesToSave.length - 1, 1);
    }

    const csvContentToSave = CSVHelpers.generateCSV(currentLinesToSave);
    // console.log("Log ~ file: split-csv.ts ~ line 44 ~ flushCurrentCsvLines ~ lastLine", currentLinesToSave[currentLinesToSave.length - 1]);

    const fileToSave = FileHelpers.joinPaths(
        csvSplittedOutputFolder,
        initialFileNameWithoutExt + "_splitted_" + currentFileIndex + ".csv"
    );

    ScriptHelpers.log(
        "writing file num " + currentFileIndex + " to " + fileToSave
    );

    // console.log("Log ~ file: split-csv.ts ~ line 51 ~ flushCurrentCsvLLines ~ currentFileIndex", currentFileIndex);
    // console.log("Log ~ file: split-csv.ts ~ line 36 ~ flushCurrentCsvLLines ~ currentLineIndex", currentLineIndex);
    // console.log("Log ~ file: split-csv.ts ~ line 52 ~ flushCurrentCsvLLines ~ fileToSave", fileToSave);

    let fileInfo: {
        success: boolean;
        error?: any;
        data?: {
            size: number;
            atimeMs: number;
            mtimeMs: number;
            ctimeMs: number;
            birthtimeMs: number;
            atime: Date;
            mtime: Date;
            ctime: Date;
            birthtime: Date;
        };
    };

    try {
        const writeResponse = await FileHelpers.writeFile(
            fileToSave,
            csvContentToSave
        );

        fileInfo = await FileHelpers.getFileInfo(fileToSave);
    } catch (error) {
        ScriptHelpers.handleError(error);
    }

    resetCurrentLine();
    currentFileIndex++;
    filesSaved.push({ filePath: fileToSave, size: fileInfo?.data?.size || 0 });
}

function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) {
        return "0 Bytes";
    }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

async function readCsvFile() {
    const fileExists = await FileHelpers.fileExists(filePath);

    if (!fileExists) {
        ScriptHelpers.handleError("file does not exist : " + filePath);
        process.exit(1);
    }

    const initialFileInfo = await FileHelpers.getFileInfo(filePath);
    ScriptHelpers.log("Initial file name : " + filePath);
    ScriptHelpers.log(
        "Initial file size : " + formatBytes(initialFileInfo.data.size)
    );

    const csvFullFileContent = (await FileHelpers.readFile(
        filePath,
        true
    )) as string;

    if (!csvFullFileContent) {
        ScriptHelpers.handleError("file is empty : " + filePath);
        process.exit(1);
    }

    const csvFilesFolder = path.dirname(filePath);
    csvSplittedOutputFolder = FileHelpers.joinPaths(csvFilesFolder, "splitted");

    if (!(await FileHelpers.fileExists(csvSplittedOutputFolder))) {
        await FileHelpers.createDirectory(csvSplittedOutputFolder);
    }

    const initialCsvFolder = FileHelpers.joinPaths(
        csvFilesFolder,
        "initial-csv"
    );

    if (!(await FileHelpers.fileExists(initialCsvFolder))) {
        await FileHelpers.createDirectory(initialCsvFolder);
    }

    const initialFileName = MainHelpers.getFileNameFromPath(filePath);
    initialFileNameWithoutExt =
        MainHelpers.getFileWithoutExtension(initialFileName);

    const allLines = CSVHelpers.parseCSV(csvFullFileContent) as any[][];
    currentCsvHeaders = allLines[0];
    allLines[0] = null;

    resetCurrentLine();

    for (const csvLine of allLines) {
        if (!csvLine) {
            continue;
        }

        currentLinesToSave.push(csvLine);
        currentLineIndex++;

        if (currentLineIndex >= maxSplit) {
            await flushCurrentCsvLines();
        }
    }

    if (filesSaved.length) {
        await flushCurrentCsvLines();
        await FileHelpers.renameFile(
            filePath,
            FileHelpers.joinPaths(
                csvFilesFolder,
                "initial-csv",
                initialFileName
            )
        );
    }
}

try {
    readCsvFile()
        .then(() => {
            for (const fileSaved of filesSaved) {
                ScriptHelpers.log(
                    "File saved : " +
                        fileSaved.filePath +
                        " -  size : " +
                        formatBytes(fileSaved.size)
                );
            }
            ScriptHelpers.endScript(
                "--- SPLIT CSV END - Files saved count : " +
                    filesSaved.length +
                    " ---"
            );
        })
        .catch((err) => {
            ScriptHelpers.handleError(err);
        });
} catch (err) {
    ScriptHelpers.handleError(err);
}
