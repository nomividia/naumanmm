import { MigrationInterface, QueryRunner } from "typeorm";

export class experienceNoteLength1660922452542 implements MigrationInterface {
    name = 'experienceNoteLength1660922452542'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE \`job-references\` CHANGE \`note\` \`note\` text NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE \`job-references\` CHANGE \`note\` \`note\` varchar(100) NULL");
    }

}
