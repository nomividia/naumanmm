import { MigrationInterface, QueryRunner } from "typeorm";
export declare class removeNotesContent1731162283815 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
