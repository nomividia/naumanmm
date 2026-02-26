import {MigrationInterface, QueryRunner} from "typeorm";

export class addNotesContent1722351195723 implements MigrationInterface {
    name = 'addNotesContent1722351195723'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidates\` ADD \`notesContent\` text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidates\` DROP COLUMN \`notesContent\``);
    }

}
