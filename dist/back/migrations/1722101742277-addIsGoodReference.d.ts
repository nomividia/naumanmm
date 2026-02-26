import { MigrationInterface, QueryRunner } from "typeorm";
export declare class addIsGoodReference1722101742277 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
