import { MigrationInterface, QueryRunner } from "typeorm";

export class addHistoryTable1656405592181 implements MigrationInterface {
    name = 'addHistoryTable1656405592181'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // eslint-disable-next-line max-len
        await queryRunner.query(`CREATE TABLE \`history\` (\`id\` varchar(36) NOT NULL, \`creationDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modifDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`disabled\` tinyint NOT NULL DEFAULT '0', \`entity\` varchar(255) NOT NULL, \`field\` varchar(255) NOT NULL, \`date\` datetime NOT NULL, \`valueBefore\` varchar(100) NOT NULL, \`valueAfter\` varchar(100) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`history\``);
    }

}
