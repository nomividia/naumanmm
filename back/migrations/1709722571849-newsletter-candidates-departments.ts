import { MigrationInterface, QueryRunner } from "typeorm";

export class newsletterCandidatesDepartments1709722571849 implements MigrationInterface {
    name = 'newsletterCandidatesDepartments1709722571849'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidate-department\` ADD \`newsletterId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`candidate-department\` ADD CONSTRAINT \`FK_1da1e5ebc2b910978d7f7306a07\` FOREIGN KEY (\`newsletterId\`) REFERENCES \`newsletter\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidate-department\` DROP FOREIGN KEY \`FK_1da1e5ebc2b910978d7f7306a07\``);
        await queryRunner.query(`ALTER TABLE \`candidate-department\` DROP COLUMN \`newsletterId\``);
    }

}
