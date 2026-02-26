import { MigrationInterface, QueryRunner } from "typeorm";

export class newsletterStats1668630945886 implements MigrationInterface {
    name = 'newsletterStats1668630945886'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`newsletter\` ADD \`sentCount\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`newsletter\` ADD \`deliveredCount\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`newsletter\` ADD \`answeredCount\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`newsletter\` ADD \`unsubscriptionsCount\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`newsletter\` ADD \`openedCount\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`newsletter\` ADD \`clickedCount\` int NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`newsletter\` DROP COLUMN \`clickedCount\``);
        await queryRunner.query(`ALTER TABLE \`newsletter\` DROP COLUMN \`openedCount\``);
        await queryRunner.query(`ALTER TABLE \`newsletter\` DROP COLUMN \`unsubscriptionsCount\``);
        await queryRunner.query(`ALTER TABLE \`newsletter\` DROP COLUMN \`answeredCount\``);
        await queryRunner.query(`ALTER TABLE \`newsletter\` DROP COLUMN \`deliveredCount\``);
        await queryRunner.query(`ALTER TABLE \`newsletter\` DROP COLUMN \`sentCount\``);
    }

}
