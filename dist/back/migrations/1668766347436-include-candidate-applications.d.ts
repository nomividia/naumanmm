import { MigrationInterface, QueryRunner } from "typeorm";
export declare class includeCandidateApplications1668766347436 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
