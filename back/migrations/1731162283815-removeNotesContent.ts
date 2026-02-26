import {MigrationInterface, QueryRunner} from "typeorm";

export class removeNotesContent1731162283815 implements MigrationInterface {
    name = 'removeNotesContent1731162283815'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidates\` DROP COLUMN \`notesContent\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidates\` ADD \`notesContent\` text NOT NULL`);
    }

}
