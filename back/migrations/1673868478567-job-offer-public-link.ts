import { MigrationInterface, QueryRunner } from "typeorm";

export class jobOfferPublicLink1673868478567 implements MigrationInterface {
    name = 'jobOfferPublicLink1673868478567'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job-offers\` MODIFY \`publicLink\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job-offers\` MODIFY \`publicLink\` varchar(255) NULL`);
    }

}
