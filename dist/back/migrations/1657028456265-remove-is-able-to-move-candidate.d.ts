import { MigrationInterface, QueryRunner } from "typeorm";
export declare class removeIsAbleToMoveCandidate1657028456265 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
