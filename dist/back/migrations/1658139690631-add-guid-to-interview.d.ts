import { MigrationInterface, QueryRunner } from "typeorm";
export declare class addGuidToInterview1658139690631 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
