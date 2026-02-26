import { MigrationInterface, QueryRunner } from "typeorm";

export class candidateLicenceCountry1656424541939 implements MigrationInterface {
    name = 'candidateLicenceCountry1656424541939';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidate-licences\` ADD \`countryCode\` varchar(36) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidate-licences\` DROP COLUMN \`countryCode\``);
    }

}
