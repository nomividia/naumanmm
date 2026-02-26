import { MigrationInterface, QueryRunner } from "typeorm";
export declare class addHistoryTable1656405592181 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
