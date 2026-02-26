import {MigrationInterface, QueryRunner} from "typeorm";

export class addReferenceStatus1723124548252 implements MigrationInterface {
    name = 'addReferenceStatus1723124548252'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidate-jobs\` CHANGE \`isGoodReference\` \`referenceStatus\` tinyint NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`candidate-jobs\` DROP COLUMN \`referenceStatus\``);
        await queryRunner.query(`ALTER TABLE \`candidate-jobs\` ADD \`referenceStatus\` varchar(20) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidate-jobs\` DROP COLUMN \`referenceStatus\``);
        await queryRunner.query(`ALTER TABLE \`candidate-jobs\` ADD \`referenceStatus\` tinyint NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`candidate-jobs\` CHANGE \`referenceStatus\` \`isGoodReference\` tinyint NOT NULL DEFAULT '1'`);
    }

}
