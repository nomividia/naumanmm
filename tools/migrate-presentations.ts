import { createConnection } from "typeorm";
import * as path from "path";
import * as fs from "fs";

/**
 * Data migration script to move existing presentations from Candidate.skills
 * to CandidatePresentation entity.
 *
 * This script:
 * 1. Finds all candidates who have skills/presentation content
 * 2. Creates a CandidatePresentation record for each with title "Default Presentation"
 * 3. Marks it as the default presentation
 * 4. Optionally clears the candidate.skills field (commented out for safety)
 *
 * Usage: ts-node tools/migrate-presentations.ts
 */

async function migratePresentation() {
    console.log("Starting presentation migration...");

    // Load environment configuration
    const envPath = path.join(__dirname, "../back/environment/env.json");
    if (!fs.existsSync(envPath)) {
        throw new Error(
            `Environment file not found at ${envPath}. Please create it first.`
        );
    }

    const envConfig: any = JSON.parse(fs.readFileSync(envPath, "utf-8"));

    if (!envConfig) {
        throw new Error(`Configuration for environment not found.`);
    }

    console.log(`Using environment: ${envConfig.EnvName}`);
    console.log(`Database: ${envConfig.db_name}`);

    // Create database connection
    const connection = await createConnection({
        type: "mysql",
        host: envConfig.db_host,
        port: envConfig.db_port || 3306,
        username: envConfig.db_user,
        password: envConfig.db_password,
        database: envConfig.db_name,
        charset: "utf8mb4",
        synchronize: false,
        logging: false,
    });

    try {
        // Find all candidates with skills/presentation content
        const candidatesWithSkills: Array<{
            candidateId: string;
            firstName: string;
            lastName: string;
            skills: string;
        }> = await connection.query(
            `
            SELECT
                c.id as candidateId,
                c.firstName,
                c.lastName,
                c.skills
            FROM candidates c
            WHERE c.skills IS NOT NULL
                AND c.skills != ''
                AND c.disabled = 0
            `
        );

        console.log(
            `Found ${candidatesWithSkills.length} candidates with skills/presentations to migrate`
        );

        if (candidatesWithSkills.length === 0) {
            console.log("No presentations to migrate. Exiting.");
            await connection.close();
            return;
        }

        let migratedCount = 0;
        let skippedCount = 0;

        for (const candidate of candidatesWithSkills) {
            try {
                // Check if presentation already exists for this candidate
                const existingPresentation = await connection.query(
                    `
                    SELECT id FROM candidate_presentations
                    WHERE candidateId = ? AND disabled = 0
                    LIMIT 1
                    `,
                    [candidate.candidateId]
                );

                if (existingPresentation.length > 0) {
                    console.log(
                        `Skipping candidate ${candidate.firstName} ${candidate.lastName} (${candidate.candidateId}) - already has presentation(s)`
                    );
                    skippedCount++;
                    continue;
                }

                // Create new CandidatePresentation
                const presentationId = generateUUID();
                await connection.query(
                    `
                    INSERT INTO candidate_presentations
                        (id, title, content, candidateId, isDefault, displayOrder, creationDate, modifDate, disabled)
                    VALUES
                        (?, ?, ?, ?, ?, ?, NOW(), NOW(), 0)
                    `,
                    [
                        presentationId,
                        "Default Presentation",
                        candidate.skills,
                        candidate.candidateId,
                        true, // isDefault
                        1, // displayOrder
                    ]
                );

                console.log(
                    `Migrated presentation for candidate ${candidate.firstName} ${candidate.lastName} (${candidate.candidateId})`
                );
                migratedCount++;

                // OPTIONAL: Clear the candidate.skills field
                // Uncomment the following lines if you want to remove the old skills data
                // await connection.query(
                //     `UPDATE candidates SET skills = NULL WHERE id = ?`,
                //     [candidate.candidateId]
                // );
            } catch (error: any) {
                console.error(
                    `Error migrating presentation for candidate ${candidate.candidateId}:`,
                    error.message
                );
            }
        }

        console.log("\n=== Migration Summary ===");
        console.log(`Total candidates found: ${candidatesWithSkills.length}`);
        console.log(`Successfully migrated: ${migratedCount}`);
        console.log(`Skipped (already exists): ${skippedCount}`);
        console.log(
            `Failed: ${
                candidatesWithSkills.length - migratedCount - skippedCount
            }`
        );
        console.log("\nMigration completed!");
        console.log(
            "\nNOTE: Candidate.skills fields have NOT been cleared. If you want to remove them,"
        );
        console.log(
            "uncomment the UPDATE query in this script and run it again."
        );
    } catch (error) {
        console.error("Migration failed:", error);
        throw error;
    } finally {
        await connection.close();
    }
}

function generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
}

// Run migration
migratePresentation()
    .then(() => {
        console.log("Script completed successfully");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Script failed:", error);
        process.exit(1);
    });
