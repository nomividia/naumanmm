import { MigrationInterface, QueryRunner } from 'typeorm';

export class candidatePresentation1761892157298 implements MigrationInterface {
    name = 'candidatePresentation1761892157298';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`candidate_presentations\` (\`id\` varchar(36) NOT NULL, \`creationDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modifDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`disabled\` tinyint NOT NULL DEFAULT '0', \`title\` varchar(255) NOT NULL, \`content\` text NULL, \`candidateId\` varchar(36) NOT NULL, \`isDefault\` tinyint NOT NULL DEFAULT 0, \`displayOrder\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `ALTER TABLE \`candidate_presentations\` ADD CONSTRAINT \`FK_2f9fa22aee02bf6af54849fca6c\` FOREIGN KEY (\`candidateId\`) REFERENCES \`candidates\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`candidate_presentations\` DROP FOREIGN KEY \`FK_2f9fa22aee02bf6af54849fca6c\``,
        );
        await queryRunner.query(`DROP TABLE \`candidate_presentations\``);
    }
}
