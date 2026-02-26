import { MigrationInterface, QueryRunner } from "typeorm";

export class currentJobsCandidateIdNullable1656407327093 implements MigrationInterface {
    name = 'currentJobsCandidateIdNullable1656407327093'

    public async up(queryRunner: QueryRunner): Promise<void> {

        try {
            await queryRunner.query(`ALTER TABLE \`candidate-current-jobs\` DROP FOREIGN KEY \`FK_bada2f86ae56a99fd741c49d905\``);
            await queryRunner.query(`ALTER TABLE \`candidate-current-jobs\` DROP FOREIGN KEY \`FK_d3f86ed0cd3ef06c21b2f47bb94\``);

        } catch (error) {

        }
        await queryRunner.query(`ALTER TABLE \`candidate-current-jobs\` CHANGE \`candidateId\` \`candidateId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`candidate-current-jobs\` ADD CONSTRAINT \`FK_bada2f86ae56a99fd741c49d905\` FOREIGN KEY (\`candidateId\`) REFERENCES \`candidates\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`candidate-current-jobs\` ADD CONSTRAINT \`FK_d3f86ed0cd3ef06c21b2f47bb94\` FOREIGN KEY (\`currentJobId\`) REFERENCES \`app_values\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidate-current-jobs\` DROP FOREIGN KEY \`FK_d3f86ed0cd3ef06c21b2f47bb94\``);
        await queryRunner.query(`ALTER TABLE \`candidate-current-jobs\` DROP FOREIGN KEY \`FK_bada2f86ae56a99fd741c49d905\``);
        await queryRunner.query(`ALTER TABLE \`candidate-current-jobs\` CHANGE \`candidateId\` \`candidateId\` varchar(36) NOT NULL`);

        await queryRunner.query(`ALTER TABLE \`candidate-current-jobs\` ADD CONSTRAINT \`FK_d3f86ed0cd3ef06c21b2f47bb94\` FOREIGN KEY (\`currentJobId\`) REFERENCES \`app_values\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`candidate-current-jobs\` ADD CONSTRAINT \`FK_bada2f86ae56a99fd741c49d905\` FOREIGN KEY (\`candidateId\`) REFERENCES \`candidates\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
