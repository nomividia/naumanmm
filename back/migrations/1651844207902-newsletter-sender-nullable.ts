import {MigrationInterface, QueryRunner} from "typeorm";

export class newsletterSenderNullable1651844207902 implements MigrationInterface {
    name = 'newsletterSenderNullable1651844207902'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `newsletter` CHANGE `sender` `sender` varchar(200) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `newsletter` CHANGE `sender` `sender` varchar(200) NOT NULL");
    }

}
