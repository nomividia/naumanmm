import {MigrationInterface, QueryRunner} from "typeorm";

export class newsletterSender1651841120661 implements MigrationInterface {
    name = 'newsletterSender1651841120661'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `newsletter` ADD `sender` varchar(200) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `newsletter` DROP COLUMN `sender`");
    }

}
