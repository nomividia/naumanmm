import {MigrationInterface, QueryRunner} from "typeorm";

export class candidateApplicationsNullableFields21652289003274 implements MigrationInterface {
    name = 'candidateApplicationsNullableFields21652289003274'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `candidate-applications` CHANGE `email` `email` varchar(255) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `candidate-applications` CHANGE `email` `email` varchar(255) NOT NULL");
    }

}
