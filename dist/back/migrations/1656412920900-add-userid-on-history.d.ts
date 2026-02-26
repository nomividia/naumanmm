import { MigrationInterface, QueryRunner } from "typeorm";
export declare class addUseridOnHistory1656412920900 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
