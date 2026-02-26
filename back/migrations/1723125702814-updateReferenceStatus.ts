import {MigrationInterface, QueryRunner} from "typeorm";

export class updateReferenceStatus1723125702814 implements MigrationInterface {
    name = 'updateReferenceStatus1723125702814'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidate-jobs\` CHANGE \`referenceStatus\` \`referenceStatusId\` varchar(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`candidate-jobs\` DROP COLUMN \`referenceStatusId\``);
        await queryRunner.query(`ALTER TABLE \`candidate-jobs\` ADD \`referenceStatusId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`candidate-jobs\` ADD CONSTRAINT \`FK_367bd3292e4bf7b76080285478e\` FOREIGN KEY (\`referenceStatusId\`) REFERENCES \`app_values\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidate-jobs\` DROP FOREIGN KEY \`FK_367bd3292e4bf7b76080285478e\``);
        await queryRunner.query(`ALTER TABLE \`candidate-jobs\` DROP COLUMN \`referenceStatusId\``);
        await queryRunner.query(`ALTER TABLE \`candidate-jobs\` ADD \`referenceStatusId\` varchar(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`candidate-jobs\` CHANGE \`referenceStatusId\` \`referenceStatus\` varchar(20) NULL`);
    }

}
