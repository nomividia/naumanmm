import { MigrationInterface, QueryRunner } from "typeorm";

export class anonymousExchanges1657547607660 implements MigrationInterface {
    name = 'anonymousExchanges1657547607660';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`anonymous-exchanges\` (\`id\` varchar(36) NOT NULL, \`creationDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modifDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`disabled\` tinyint NOT NULL DEFAULT '0', \`candidateApplicationId\` varchar(36) NOT NULL, \`messageContent\` text NOT NULL, \`consultantId\` varchar(36) NULL, \`seen\` tinyint NOT NULL DEFAULT '0', \`senderType\` enum ('consultant', 'guest') NOT NULL, \`fileId\` varchar(36) NULL, UNIQUE INDEX \`REL_fa2fdcb51bfbbb21d5d114ed3d\` (\`fileId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`anonymous-exchanges\` ADD CONSTRAINT \`FK_2ac5684d4b792aa0343a1f1ca8c\` FOREIGN KEY (\`candidateApplicationId\`) REFERENCES \`candidate-applications\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`anonymous-exchanges\` ADD CONSTRAINT \`FK_3ee1b76dfb8c2b6c61531319f5b\` FOREIGN KEY (\`consultantId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`anonymous-exchanges\` ADD CONSTRAINT \`FK_fa2fdcb51bfbbb21d5d114ed3dc\` FOREIGN KEY (\`fileId\`) REFERENCES \`app_files\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`anonymous-exchanges\` DROP FOREIGN KEY \`FK_fa2fdcb51bfbbb21d5d114ed3dc\``);
        await queryRunner.query(`ALTER TABLE \`anonymous-exchanges\` DROP FOREIGN KEY \`FK_3ee1b76dfb8c2b6c61531319f5b\``);
        await queryRunner.query(`ALTER TABLE \`anonymous-exchanges\` DROP FOREIGN KEY \`FK_2ac5684d4b792aa0343a1f1ca8c\``);
        await queryRunner.query(`DROP INDEX \`REL_fa2fdcb51bfbbb21d5d114ed3d\` ON \`anonymous-exchanges\``);
        await queryRunner.query(`DROP TABLE \`anonymous-exchanges\``);
    }

}
