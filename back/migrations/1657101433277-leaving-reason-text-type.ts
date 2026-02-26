import { MigrationInterface, QueryRunner } from "typeorm";

export class leavingReasonTextType1657101433277 implements MigrationInterface {
    name = 'leavingReasonTextType1657101433277'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidates-resume-experience\` MODIFY \`leavingReason\` TEXT NULL;`);
        await queryRunner.query(`ALTER TABLE \`candidate-jobs\` MODIFY \`leavingReason\` TEXT NULL;`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidates-resume-experience\` MODIFY \`leavingReason\` varchar(50) NULL;`);
        await queryRunner.query(`ALTER TABLE \`candidate-jobs\` MODIFY \`leavingReason\` varchar(50) NULL;`);

    }

}
