import { MigrationInterface, QueryRunner } from "typeorm";

export class candidateRelationshipIdNullable1690962341561 implements MigrationInterface {
    name = 'candidateRelationshipIdNullable1690962341561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidates\` DROP FOREIGN KEY \`FK_50e729b525bd7c9bf803aad4bd3\``);
        await queryRunner.query(`ALTER TABLE \`candidates\` CHANGE \`relationshipStatusId\` \`relationshipStatusId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`candidates\` ADD CONSTRAINT \`FK_50e729b525bd7c9bf803aad4bd3\` FOREIGN KEY (\`relationshipStatusId\`) REFERENCES \`app_values\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidates\` DROP FOREIGN KEY \`FK_50e729b525bd7c9bf803aad4bd3\``);
        await queryRunner.query(`ALTER TABLE \`candidates\` CHANGE \`relationshipStatusId\` \`relationshipStatusId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`candidates\` ADD CONSTRAINT \`FK_50e729b525bd7c9bf803aad4bd3\` FOREIGN KEY (\`relationshipStatusId\`) REFERENCES \`app_values\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
