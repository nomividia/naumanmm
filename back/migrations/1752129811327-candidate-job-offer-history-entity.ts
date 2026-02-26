import {MigrationInterface, QueryRunner} from "typeorm";

export class candidateJobOfferHistoryEntity1752129811327 implements MigrationInterface {
    name = 'candidateJobOfferHistoryEntity1752129811327'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`idx_status_disabled_creation\` ON \`candidate-applications\``);
        await queryRunner.query(`CREATE TABLE \`candidate-job-offer-history\` (\`id\` varchar(36) NOT NULL, \`creationDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modifDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`disabled\` tinyint NOT NULL DEFAULT '0', \`candidateId\` varchar(36) NOT NULL, \`jobOfferId\` varchar(36) NOT NULL, \`action\` enum ('LINKED', 'UNLINKED') NOT NULL, \`candidateFirstName\` varchar(130) NULL, \`candidateLastName\` varchar(130) NULL, \`actionDate\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`candidates\` ADD CONSTRAINT \`FK_f3f436e97b1b0da1a21261e9db9\` FOREIGN KEY (\`placedJobOfferId\`) REFERENCES \`job-offers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`candidate-job-offer-history\` ADD CONSTRAINT \`FK_37da5dc7adcc25e6f7b1993543d\` FOREIGN KEY (\`candidateId\`) REFERENCES \`candidates\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`candidate-job-offer-history\` ADD CONSTRAINT \`FK_6ebf44dc628570ffe4aa08200d6\` FOREIGN KEY (\`jobOfferId\`) REFERENCES \`job-offers\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidate-job-offer-history\` DROP FOREIGN KEY \`FK_6ebf44dc628570ffe4aa08200d6\``);
        await queryRunner.query(`ALTER TABLE \`candidate-job-offer-history\` DROP FOREIGN KEY \`FK_37da5dc7adcc25e6f7b1993543d\``);
        await queryRunner.query(`ALTER TABLE \`candidates\` DROP FOREIGN KEY \`FK_f3f436e97b1b0da1a21261e9db9\``);
        await queryRunner.query(`DROP TABLE \`candidate-job-offer-history\``);
        await queryRunner.query(`CREATE INDEX \`idx_status_disabled_creation\` ON \`candidate-applications\` (\`applyStatusId\`, \`disabled\`, \`creationDate\`)`);
    }

}
