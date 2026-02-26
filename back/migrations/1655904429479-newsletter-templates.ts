import { MigrationInterface, QueryRunner } from "typeorm";

export class newsletterTemplates1655904429479 implements MigrationInterface {
    name = 'newsletterTemplates1655904429479'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`newsletter-templates\` (\`id\` varchar(36) NOT NULL, \`creationDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modifDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`disabled\` tinyint NOT NULL DEFAULT '0', \`content\` MEDIUMTEXT NOT NULL,\`title\` varchar(255) NOT NULL,\`subject\` varchar(100) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`newsletter-templates\``);
    }

}
