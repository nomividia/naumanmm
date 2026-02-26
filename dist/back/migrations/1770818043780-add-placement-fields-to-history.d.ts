import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class addPlacementFieldsToHistory1770818043780 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
