import { MigrationInterface, QueryRunner } from 'typeorm';

export class noteItemFiles1766122078065 implements MigrationInterface {
    name = 'noteItemFiles1766122078065';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`note-item-files\` (
                \`id\` varchar(36) NOT NULL,
                \`creationDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modifDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`disabled\` tinyint NOT NULL DEFAULT '0',
                \`fileId\` varchar(36) NULL,
                \`noteItemId\` varchar(36) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `ALTER TABLE \`note-item-files\` ADD CONSTRAINT \`FK_note_item_files_file\` FOREIGN KEY (\`fileId\`) REFERENCES \`app_files\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`note-item-files\` ADD CONSTRAINT \`FK_note_item_files_note_item\` FOREIGN KEY (\`noteItemId\`) REFERENCES \`note-item\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`note-item-files\` DROP FOREIGN KEY \`FK_note_item_files_note_item\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`note-item-files\` DROP FOREIGN KEY \`FK_note_item_files_file\``,
        );
        await queryRunner.query(`DROP TABLE \`note-item-files\``);
    }
}
