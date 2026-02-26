import { MigrationInterface, QueryRunner } from "typeorm";

export class removeUnusedRelations1652287546383 implements MigrationInterface {
    name = 'removeUnusedRelations1652287546383'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query("ALTER TABLE `candidate-language` DROP FOREIGN KEY `FK_fa07adc7b0c94803028e7fb3843`");
        // await queryRunner.query("ALTER TABLE `candidate-applications` DROP FOREIGN KEY `FK_c4c6d97b6aef933c762eb41a9a3`");

        try {
            await queryRunner.query("ALTER TABLE `candidate-language` DROP COLUMN `languageCandidateId`");
            await queryRunner.query("ALTER TABLE `candidates` DROP COLUMN `jobOfferLinked`");
        }
        catch {

        }
        await queryRunner.query("ALTER TABLE `candidate-applications` DROP COLUMN `jobOfferLinkedId`");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `candidate-applications` ADD `jobOfferLinkedId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `candidates` ADD `jobOfferLinked` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `candidate-language` ADD `languageCandidateId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `candidate-applications` ADD CONSTRAINT `FK_c4c6d97b6aef933c762eb41a9a3` FOREIGN KEY (`jobOfferLinkedId`) REFERENCES `job-offers`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `candidate-language` ADD CONSTRAINT `FK_fa07adc7b0c94803028e7fb3843` FOREIGN KEY (`languageCandidateId`) REFERENCES `app_values`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
