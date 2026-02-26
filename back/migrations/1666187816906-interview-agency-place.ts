import { MigrationInterface, QueryRunner } from "typeorm";

export class interviewAgencyPlace1666187816906 implements MigrationInterface {
    name = 'interviewAgencyPlace1666187816906'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`interviews\` CHANGE \`agencyPlace\` \`agencyPlace\` varchar(80) NULL `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`interviews\` CHANGE \`agencyPlace\` \`agencyPlace\` text NULL `);
    }

}
