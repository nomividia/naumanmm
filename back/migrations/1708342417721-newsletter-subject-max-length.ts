import { MigrationInterface, QueryRunner } from "typeorm";

export class newsletterSubjectMaxLength1708342417721 implements MigrationInterface {
    name = 'newsletterSubjectMaxLength1708342417721'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`newsletter\` CHANGE \`subject\` \`subject\` varchar(190) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`newsletter\` CHANGE \`subject\` \`subject\` varchar(100) NULL`);

    }

}
