/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { MainHelpers } from "nextalys-js-helpers";
import { FileHelpers, NodeHelpers } from "nextalys-node-helpers";
import * as path from "path";
import * as EnvironmentJsonFile from "../back/environment/env.json";
import { ScriptHelpers } from "./helpers";
const readline = require("readline");
const rootFolder = path.join(__dirname, "..");

let envJson: any = EnvironmentJsonFile;

console.log(
    "Log ~ file: create-migration.ts ~ line 6 ~ EnvironmentJsonFile",
    envJson
);

if (!envJson.UseTypeOrmMigrations) {
    ScriptHelpers.handleError(
        "You have to set UseTypeOrmMigrations to true in your env.json file"
    );
}

async function createTypeOrmConfigFile() {
    let entitiesPath = FileHelpers.joinPaths(
        rootFolder,
        "dist",
        "back",
        "**",
        "*.entity{.ts,.js}"
    );

    entitiesPath = MainHelpers.replaceAll(entitiesPath, "\\", "\\\\");

    await FileHelpers.writeFile(
        FileHelpers.joinPaths(rootFolder, "ormconfig.json"),
        `{
    "extra": {
      "timezone": "utc"
    },
    "type": "mysql",
    "host": "${envJson.db_host}",
    "port": ${envJson.db_port},
    "username": "${envJson.db_user}",
    "password": "${envJson.db_password}",
    "database": "${envJson.db_name}",
    "logging": true,
    "migrationsTableName": "nxs-migrations",
    "migrations":  ["back/migrations/*.js"],
    "entities": [
      "${entitiesPath}"
    ],
    "synchronize": false,
    "cli": {
      "migrationsDir": "back/migrations"
    }
  }`
    );
}

function nxsReadLine(
    question: string,
    regex: RegExp,
    errorMessage?: string
): Promise<string> {
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question(question, (result: string) => {
            rl.close();
            const test = regex.exec(result);

            if (!!test) {
                resolve(result);
            } else {
                reject(errorMessage || "Texte incorrect !");
            }
        });
    });
}

async function createMigration() {
    try {
        await NodeHelpers.executeCommand("npm run build:back", {
            cwd: rootFolder,
        });
        await createTypeOrmConfigFile();

        const regex = /^[a-zA-Z\-\d]+$/;
        const migration_name = await nxsReadLine(
            "Nom de la migration ? ",
            regex,
            "Nom de migration invalide !"
        );

        await NodeHelpers.executeCommand(
            `npx typeorm migration:generate -n ${migration_name}`,
            { cwd: rootFolder }
        );
    } catch (err) {
        ScriptHelpers.handleError(err);
    }
}

try {
    createMigration()
        .then(() => {
            ScriptHelpers.endScript("Migration created with success !");
        })
        .catch((err) => {
            ScriptHelpers.handleError(err);
        });
} catch (err) {
    ScriptHelpers.handleError(err);
}
