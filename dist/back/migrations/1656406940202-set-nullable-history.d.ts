import { MigrationInterface, QueryRunner } from "typeorm";
export declare class setNullableHistory1656406940202 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
