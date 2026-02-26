import { MigrationInterface, QueryRunner } from "typeorm";

export class setNullableHistory1656406940202 implements MigrationInterface {
    name = 'setNullableHistory1656406940202'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE \`history\` CHANGE \`valueBefore\` \`valueBefore\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`history\` CHANGE \`valueAfter\` \`valueAfter\` varchar(100) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`history\` CHANGE \`valueAfter\` \`valueAfter\` varchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`history\` CHANGE \`valueBefore\` \`valueBefore\` varchar(100) NOT NULL`);
    }

}
