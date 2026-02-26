import { NodeHelpers } from "nextalys-node-helpers";
import * as path from "path";
import { createConnection } from "typeorm";
import * as EnvironmentJsonFile from "../back/environment/env.json";
import { ScriptHelpers } from "./helpers";

const rootFolder = path.join(__dirname, "..");
let envJson: any = EnvironmentJsonFile;

if (!envJson.UseTypeOrmMigrations) {
    ScriptHelpers.handleError(
        "You have to set UseTypeOrmMigrations to true in your env.json file"
    );
}

async function runMigration() {
    try {
        // Build the project
        await NodeHelpers.executeCommand("npm run build:back", {
            cwd: rootFolder,
        });

        // Prepare connection options
        const connectionOptions = {
            type: "mysql",
            host: envJson.db_host,
            port: envJson.db_port,
            username: envJson.db_user,
            password: envJson.db_password,
            database: envJson.db_name,
            logging: true,
            migrationsTableName: "nxs-migrations",
            migrations: [
                path.join(rootFolder, "dist", "back", "migrations", "*.js"),
            ],
            entities: [
                path.join(rootFolder, "dist", "back", "**", "*.entity.js"),
            ],
            synchronize: false,
        };

        // Connect and run migrations
        const connection = await createConnection(connectionOptions as any);
        await connection.runMigrations();
        await connection.close();

        ScriptHelpers.endScript("Migration ran successfully!");
    } catch (err) {
        ScriptHelpers.handleError(err);
    }
}

runMigration().catch((err) => {
    ScriptHelpers.handleError(err);
});
