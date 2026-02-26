import { MigrationInterface, QueryRunner } from "typeorm";

export class newsletterRelatedTables1666188166968 implements MigrationInterface {
    name = 'newsletterRelatedTables1666188166968'

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`ALTER TABLE \`newsletter-candidate-jobs\` DROP FOREIGN KEY \`FK_ebeef19b3e23e9fc71fa20452d8\``);
        } catch (error) {
            console.log("error migration", error);
        }
        try {
            await queryRunner.query(`ALTER TABLE \`newsletter-joboffer\` DROP FOREIGN KEY \`FK_87c35e523dd0effe1e75b25fcb0\``);

        } catch (error) {
            console.log("error migration", error);
        }

        try {
            await queryRunner.query(`ALTER TABLE \`newsletter-joboffer\` DROP FOREIGN KEY \`FK_9c1128a1b1d840490585e8047b4\``);

        } catch (error) {
            console.log("error migration", error);
        }

        try {
            await queryRunner.query(`ALTER TABLE \`newsletter-candidate-status\` DROP FOREIGN KEY \`FK_2e35ee9860df4fcc795934b774a\``);
        } catch (error) {
            console.log("error migration", error);
        }
        try {
            await queryRunner.query(`ALTER TABLE \`newsletter-candidate-jobs\` DROP FOREIGN KEY \`FK_233c9e4f97bbc54b603d9e5a4d0\``);
        } catch (error) {
            console.log("error migration", error);
        }
        try {
            await queryRunner.query(`ALTER TABLE \`newsletter-candidate-status\` DROP FOREIGN KEY \`FK_ff9bb4dddff022f78f526bd6cf0\``);
        } catch (error) {
            console.log("error migration", error);
        }


        await queryRunner.query(`ALTER TABLE \`newsletter-candidate-jobs\` CHANGE \`jobTypeId\` \`jobTypeId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`newsletter-candidate-jobs\` CHANGE \`newsLetterId\` \`newsLetterId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`newsletter-joboffer\` CHANGE \`jobOfferId\` \`jobOfferId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`newsletter-joboffer\` CHANGE \`newsletterId\` \`newsletterId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`newsletter-candidate-status\` CHANGE \`candidateStatusId\` \`candidateStatusId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`newsletter-candidate-status\` CHANGE \`newsletterId\` \`newsletterId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`newsletter-candidate-jobs\` ADD CONSTRAINT \`FK_ebeef19b3e23e9fc71fa20452d8\` FOREIGN KEY (\`jobTypeId\`) REFERENCES \`app_values\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`newsletter-candidate-jobs\` ADD CONSTRAINT \`FK_233c9e4f97bbc54b603d9e5a4d0\` FOREIGN KEY (\`newsLetterId\`) REFERENCES \`newsletter\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`newsletter-joboffer\` ADD CONSTRAINT \`FK_87c35e523dd0effe1e75b25fcb0\` FOREIGN KEY (\`jobOfferId\`) REFERENCES \`job-offers\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`newsletter-joboffer\` ADD CONSTRAINT \`FK_9c1128a1b1d840490585e8047b4\` FOREIGN KEY (\`newsletterId\`) REFERENCES \`newsletter\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`newsletter-candidate-status\` ADD CONSTRAINT \`FK_2e35ee9860df4fcc795934b774a\` FOREIGN KEY (\`candidateStatusId\`) REFERENCES \`app_values\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`newsletter-candidate-status\` ADD CONSTRAINT \`FK_ff9bb4dddff022f78f526bd6cf0\` FOREIGN KEY (\`newsletterId\`) REFERENCES \`newsletter\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`newsletter-candidate-status\` DROP FOREIGN KEY \`FK_ff9bb4dddff022f78f526bd6cf0\``);
        await queryRunner.query(`ALTER TABLE \`newsletter-candidate-status\` DROP FOREIGN KEY \`FK_2e35ee9860df4fcc795934b774a\``);
        await queryRunner.query(`ALTER TABLE \`newsletter-joboffer\` DROP FOREIGN KEY \`FK_9c1128a1b1d840490585e8047b4\``);
        await queryRunner.query(`ALTER TABLE \`newsletter-joboffer\` DROP FOREIGN KEY \`FK_87c35e523dd0effe1e75b25fcb0\``);
        await queryRunner.query(`ALTER TABLE \`newsletter-candidate-jobs\` DROP FOREIGN KEY \`FK_233c9e4f97bbc54b603d9e5a4d0\``);
        await queryRunner.query(`ALTER TABLE \`newsletter-candidate-jobs\` DROP FOREIGN KEY \`FK_ebeef19b3e23e9fc71fa20452d8\``);
        await queryRunner.query(`ALTER TABLE \`newsletter-candidate-status\` CHANGE \`newsletterId\` \`newsletterId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`newsletter-candidate-status\` CHANGE \`candidateStatusId\` \`candidateStatusId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`newsletter-candidate-status\` ADD CONSTRAINT \`FK_ff9bb4dddff022f78f526bd6cf0\` FOREIGN KEY (\`newsletterId\`) REFERENCES \`newsletter\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`newsletter-joboffer\` CHANGE \`newsletterId\` \`newsletterId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`newsletter-joboffer\` CHANGE \`jobOfferId\` \`jobOfferId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`newsletter-candidate-jobs\` CHANGE \`newsLetterId\` \`newsLetterId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`newsletter-candidate-jobs\` CHANGE \`jobTypeId\` \`jobTypeId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`newsletter-candidate-jobs\` ADD CONSTRAINT \`FK_233c9e4f97bbc54b603d9e5a4d0\` FOREIGN KEY (\`newsLetterId\`) REFERENCES \`newsletter\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`newsletter-candidate-status\` ADD CONSTRAINT \`FK_2e35ee9860df4fcc795934b774a\` FOREIGN KEY (\`candidateStatusId\`) REFERENCES \`app_values\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`newsletter-joboffer\` ADD CONSTRAINT \`FK_9c1128a1b1d840490585e8047b4\` FOREIGN KEY (\`newsletterId\`) REFERENCES \`newsletter\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`newsletter-joboffer\` ADD CONSTRAINT \`FK_87c35e523dd0effe1e75b25fcb0\` FOREIGN KEY (\`jobOfferId\`) REFERENCES \`job-offers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`newsletter-candidate-jobs\` ADD CONSTRAINT \`FK_ebeef19b3e23e9fc71fa20452d8\` FOREIGN KEY (\`jobTypeId\`) REFERENCES \`app_values\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
