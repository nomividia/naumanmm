import { MigrationInterface, QueryRunner } from "typeorm";
export declare class removeIndexes1652450473656 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
