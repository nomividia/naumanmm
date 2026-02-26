import { MigrationInterface, QueryRunner } from "typeorm";

export class candidateDepartments1673889790114 implements MigrationInterface {
    name = 'candidateDepartments1673889790114'

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
        await queryRunner.query(`CREATE TABLE \`candidate-department\` (\`id\` varchar(36) NOT NULL, \`creationDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modifDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`disabled\` tinyint NOT NULL DEFAULT '0', \`candidateId\` varchar(36) NULL, \`candidateApplicationId\` varchar(36) NULL, \`country\` varchar(2) NOT NULL, \`department\` varchar(20) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        // await queryRunner.query(`ALTER TABLE \`candidates-resume-experience\` DROP COLUMN \`place\``);
        // await queryRunner.query(`ALTER TABLE \`candidates-resume-formation\` DROP COLUMN \`place\``);
        // await queryRunner.query(`ALTER TABLE \`candidates-resume-formation\` ADD \`place\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`candidate-department\` ADD CONSTRAINT \`FK_6a489e7689a0932a0c488ea0b1b\` FOREIGN KEY (\`candidateId\`) REFERENCES \`candidates\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`candidate-department\` ADD CONSTRAINT \`FK_e947cb5b8749beb950c19847136\` FOREIGN KEY (\`candidateApplicationId\`) REFERENCES \`candidate-applications\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidate-department\` DROP FOREIGN KEY \`FK_e947cb5b8749beb950c19847136\``);
        await queryRunner.query(`ALTER TABLE \`candidate-department\` DROP FOREIGN KEY \`FK_6a489e7689a0932a0c488ea0b1b\``);
        await queryRunner.query(`ALTER TABLE \`candidates-resume-formation\` DROP COLUMN \`place\``);
        await queryRunner.query(`ALTER TABLE \`candidates-resume-formation\` ADD \`place\` text NULL`);
        // await queryRunner.query(`ALTER TABLE \`candidates-resume-experience\` ADD \`place\` text NULL`);
        await queryRunner.query(`DROP TABLE \`candidate-department\``);
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
