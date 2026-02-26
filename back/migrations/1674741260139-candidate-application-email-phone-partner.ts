import { MigrationInterface, QueryRunner } from "typeorm";

export class candidateApplicationEmailPhonePartner1674741260139 implements MigrationInterface {
    name = 'candidateApplicationEmailPhonePartner1674741260139'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`DROP INDEX \`IDX_creationDate_ASC\` ON \`candidates\``);
        // await queryRunner.query(`DROP INDEX \`IDX_creationDate_DESC\` ON \`candidates\``);
        // await queryRunner.query(`DROP INDEX \`IDX_creationDate_ASC\` ON \`users\``);
        // await queryRunner.query(`DROP INDEX \`IDX_creationDate_DESC\` ON \`users\``);
        // await queryRunner.query(`DROP INDEX \`IDX_creationDate_ASC\` ON \`customer\``);
        // await queryRunner.query(`DROP INDEX \`IDX_creationDate_DESC\` ON \`customer\``);
        // await queryRunner.query(`DROP INDEX \`IDX_creationDate_ASC\` ON \`job-offers\``);
        // await queryRunner.query(`DROP INDEX \`IDX_creationDate_DESC\` ON \`job-offers\``);
        // await queryRunner.query(`DROP INDEX \`IDX_creationDate_ASC\` ON \`candidate-applications\``);
        // await queryRunner.query(`DROP INDEX \`IDX_creationDate_DESC\` ON \`candidate-applications\``);
        await queryRunner.query(`ALTER TABLE \`candidate-applications\` ADD \`partnerEmail\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`candidate-applications\` ADD \`partnerPhone\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidate-applications\` DROP COLUMN \`partnerPhone\``);
        await queryRunner.query(`ALTER TABLE \`candidate-applications\` DROP COLUMN \`partnerEmail\``);
        // await queryRunner.query(`CREATE INDEX \`IDX_creationDate_DESC\` ON \`candidate-applications\` (\`creationDate\`)`);
        // await queryRunner.query(`CREATE INDEX \`IDX_creationDate_ASC\` ON \`candidate-applications\` (\`creationDate\`)`);
        // await queryRunner.query(`CREATE INDEX \`IDX_creationDate_DESC\` ON \`job-offers\` (\`creationDate\`)`);
        // await queryRunner.query(`CREATE INDEX \`IDX_creationDate_ASC\` ON \`job-offers\` (\`creationDate\`)`);
        // await queryRunner.query(`CREATE INDEX \`IDX_creationDate_DESC\` ON \`customer\` (\`creationDate\`)`);
        // await queryRunner.query(`CREATE INDEX \`IDX_creationDate_ASC\` ON \`customer\` (\`creationDate\`)`);
        // await queryRunner.query(`CREATE INDEX \`IDX_creationDate_DESC\` ON \`users\` (\`creationDate\`)`);
        // await queryRunner.query(`CREATE INDEX \`IDX_creationDate_ASC\` ON \`users\` (\`creationDate\`)`);
        // await queryRunner.query(`CREATE INDEX \`IDX_creationDate_DESC\` ON \`candidates\` (\`creationDate\`)`);
        // await queryRunner.query(`CREATE INDEX \`IDX_creationDate_ASC\` ON \`candidates\` (\`creationDate\`)`);
    }

}
