import { MigrationInterface, QueryRunner } from "typeorm";
export declare class addReferenceStatus1723124548252 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
