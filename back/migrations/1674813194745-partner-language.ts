import { MigrationInterface, QueryRunner } from "typeorm";

export class partnerLanguage1674813194745 implements MigrationInterface {
    name = 'partnerLanguage1674813194745'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`DROP INDEX \`IDX_creationDate_ASC\` ON \`customer\``);
        // await queryRunner.query(`DROP INDEX \`IDX_creationDate_DESC\` ON \`customer\``);
        // await queryRunner.query(`DROP INDEX \`IDX_creationDate_ASC\` ON \`job-offers\``);
        // await queryRunner.query(`DROP INDEX \`IDX_creationDate_DESC\` ON \`job-offers\``);
        // await queryRunner.query(`DROP INDEX \`IDX_creationDate_ASC\` ON \`candidate-applications\``);
        // await queryRunner.query(`DROP INDEX \`IDX_creationDate_DESC\` ON \`candidate-applications\``);
        // await queryRunner.query(`DROP INDEX \`IDX_creationDate_ASC\` ON \`candidates\``);
        // await queryRunner.query(`DROP INDEX \`IDX_creationDate_DESC\` ON \`candidates\``);
        // await queryRunner.query(`DROP INDEX \`IDX_creationDate_ASC\` ON \`users\``);
        // await queryRunner.query(`DROP INDEX \`IDX_creationDate_DESC\` ON \`users\``);
        await queryRunner.query(`ALTER TABLE \`candidate-language\` ADD \`isPartnerLanguage\` tinyint NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidate-language\` DROP COLUMN \`isPartnerLanguage\``);
        // await queryRunner.query(`CREATE INDEX \`IDX_creationDate_DESC\` ON \`users\` (\`creationDate\`)`);
        // await queryRunner.query(`CREATE INDEX \`IDX_creationDate_ASC\` ON \`users\` (\`creationDate\`)`);
        // await queryRunner.query(`CREATE INDEX \`IDX_creationDate_DESC\` ON \`candidates\` (\`creationDate\`)`);
        // await queryRunner.query(`CREATE INDEX \`IDX_creationDate_ASC\` ON \`candidates\` (\`creationDate\`)`);
        // await queryRunner.query(`CREATE INDEX \`IDX_creationDate_DESC\` ON \`candidate-applications\` (\`creationDate\`)`);
        // await queryRunner.query(`CREATE INDEX \`IDX_creationDate_ASC\` ON \`candidate-applications\` (\`creationDate\`)`);
        // await queryRunner.query(`CREATE INDEX \`IDX_creationDate_DESC\` ON \`job-offers\` (\`creationDate\`)`);
        // await queryRunner.query(`CREATE INDEX \`IDX_creationDate_ASC\` ON \`job-offers\` (\`creationDate\`)`);
        // await queryRunner.query(`CREATE INDEX \`IDX_creationDate_DESC\` ON \`customer\` (\`creationDate\`)`);
        // await queryRunner.query(`CREATE INDEX \`IDX_creationDate_ASC\` ON \`customer\` (\`creationDate\`)`);
    }

}
