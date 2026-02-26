import { MigrationInterface, QueryRunner } from "typeorm";
export declare class updateReferenceStatus1723125702814 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
