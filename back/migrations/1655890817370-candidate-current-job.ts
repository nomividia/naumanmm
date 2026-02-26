import { MigrationInterface, QueryRunner } from "typeorm";

export class candidateCurrentJob1655890817370 implements MigrationInterface {
    name = 'candidateCurrentJob1655890817370';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`candidate-current-jobs\` (\`id\` varchar(36) NOT NULL, \`creationDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modifDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`disabled\` tinyint NOT NULL DEFAULT '0', \`candidateId\` varchar(36) NULL, \`currentJobId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`candidate-current-jobs\` ADD CONSTRAINT \`FK_bada2f86ae56a99fd741c49d905\` FOREIGN KEY (\`candidateId\`) REFERENCES \`candidates\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`candidate-current-jobs\` ADD CONSTRAINT \`FK_d3f86ed0cd3ef06c21b2f47bb94\` FOREIGN KEY (\`currentJobId\`) REFERENCES \`app_values\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidate-current-jobs\` DROP FOREIGN KEY \`FK_d3f86ed0cd3ef06c21b2f47bb94\``);
        await queryRunner.query(`ALTER TABLE \`candidate-current-jobs\` DROP FOREIGN KEY \`FK_bada2f86ae56a99fd741c49d905\``);
        await queryRunner.query(`DROP TABLE \`candidate-current-jobs\``);
    }

}
