import {MigrationInterface, QueryRunner} from "typeorm";

export class removeVisioConfFields1770000000000 implements MigrationInterface {
    name = 'removeVisioConfFields1770000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Find and drop the foreign key constraint on visioConfTypeId dynamically
        const foreignKeys = await queryRunner.query(`
            SELECT CONSTRAINT_NAME
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = 'candidates'
              AND COLUMN_NAME = 'visioConfTypeId'
              AND REFERENCED_TABLE_NAME IS NOT NULL
        `);

        for (const fk of foreignKeys) {
            await queryRunner.query(`ALTER TABLE \`candidates\` DROP FOREIGN KEY \`${fk.CONSTRAINT_NAME}\``);
        }

        // Now drop the columns
        await queryRunner.query(`ALTER TABLE \`candidates\` DROP COLUMN \`visioConfTypeId\``);
        await queryRunner.query(`ALTER TABLE \`candidates\` DROP COLUMN \`visioConfUserId\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidates\` ADD \`visioConfTypeId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`candidates\` ADD \`visioConfUserId\` varchar(36) NULL`);
        // Recreate the foreign key constraint
        await queryRunner.query(`ALTER TABLE \`candidates\` ADD CONSTRAINT \`FK_candidates_visioConfTypeId\` FOREIGN KEY (\`visioConfTypeId\`) REFERENCES \`app_values\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
