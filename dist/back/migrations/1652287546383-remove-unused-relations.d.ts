import { MigrationInterface, QueryRunner } from "typeorm";
export declare class removeUnusedRelations1652287546383 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
