import { MigrationInterface, QueryRunner } from "typeorm";

export class candidateApplicationsNullableFields1652288771910 implements MigrationInterface {
    name = 'candidateApplicationsNullableFields1652288771910'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `candidate-applications` CHANGE `firstName` `firstName` varchar(60) NULL");
        await queryRunner.query("ALTER TABLE `candidate-applications` CHANGE `lastName` `lastName` varchar(60) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `candidate-applications` CHANGE `lastName` `lastName` varchar(30) NOT NULL");
        await queryRunner.query("ALTER TABLE `candidate-applications` CHANGE `firstName` `firstName` varchar(30) NOT NULL");
    }

}
