import { MigrationInterface, QueryRunner } from "typeorm";
export declare class nullableGenderId1724769882387 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
