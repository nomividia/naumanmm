import * as fs from "fs";
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

async function revertLatestMigration() {
    try {
        // Build the project
        await NodeHelpers.executeCommand("npm run build:back", {
            cwd: rootFolder,
        });

        // Get the latest migration file
        const migrationsDir = path.join(rootFolder, "back", "migrations");
        const migrationFiles = fs
            .readdirSync(migrationsDir)
            .filter((file) => file.endsWith(".ts"))
            .sort()
            .reverse(); // Sort in descending order to get the latest first

        if (migrationFiles.length === 0) {
            ScriptHelpers.handleError("No migration files found!");
        }

        const latestMigrationFile = migrationFiles[0];
        const latestMigrationName = latestMigrationFile.replace(".ts", "");

        console.log(`Reverting latest migration: ${latestMigrationName}`);

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

        // Connect to database
        const connection = await createConnection(connectionOptions as any);

        // Get the migration instance
        const migrationPath = path.join(
            rootFolder,
            "dist",
            "back",
            "migrations",
            latestMigrationName + ".js"
        );

        if (!fs.existsSync(migrationPath)) {
            await connection.close();
            ScriptHelpers.handleError(
                `Migration file not found: ${migrationPath}`
            );
        }

        // Import the migration class
        const migrationModule = require(migrationPath);
        console.log("Available exports:", Object.keys(migrationModule));

        // Get the first export (migration classes are typically the default export)
        const migrationClassName = Object.keys(migrationModule)[0];

        if (!migrationClassName) {
            await connection.close();
            ScriptHelpers.handleError(
                `Migration class not found in: ${latestMigrationFile}. Available exports: ${Object.keys(
                    migrationModule
                ).join(", ")}`
            );
        }

        console.log(`Found migration class: ${migrationClassName}`);

        const MigrationClass = migrationModule[migrationClassName];
        const migration = new MigrationClass();

        // Run the down method
        console.log("Running migration down() method...");
        await migration.down(connection.createQueryRunner());

        // Remove the migration from the migrations table
        console.log("Removing migration from migrations table...");
        await connection.query(
            `DELETE FROM \`nxs-migrations\` WHERE \`name\` = ?`,
            [latestMigrationName]
        );

        await connection.close();

        ScriptHelpers.endScript(
            `Migration ${latestMigrationName} reverted successfully!`
        );
    } catch (err) {
        ScriptHelpers.handleError(err);
    }
}

revertLatestMigration().catch((err) => {
    ScriptHelpers.handleError(err);
});
