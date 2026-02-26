import { MigrationInterface, QueryRunner } from "typeorm";

export class creationDateIndexOrder1652469309999 implements MigrationInterface {
    name = 'creationDateIndexOrder1652469309999';

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query("CREATE INDEX `IDX_creationDate_ASC` ON `candidates` (`creationDate` ASC)");
        await queryRunner.query("CREATE INDEX `IDX_creationDate_DESC` ON `candidates` (`creationDate` DESC)");

        await queryRunner.query("CREATE INDEX `IDX_creationDate_ASC` ON `users` (`creationDate` ASC)");
        await queryRunner.query("CREATE INDEX `IDX_creationDate_DESC` ON `users` (`creationDate` DESC)");

        await queryRunner.query("CREATE INDEX `IDX_creationDate_ASC` ON `customer` (`creationDate` ASC)");
        await queryRunner.query("CREATE INDEX `IDX_creationDate_DESC` ON `customer` (`creationDate` DESC)");

        await queryRunner.query("CREATE INDEX `IDX_creationDate_ASC` ON `job-offers` (`creationDate` ASC)");
        await queryRunner.query("CREATE INDEX `IDX_creationDate_DESC` ON `job-offers` (`creationDate` DESC)");

        await queryRunner.query("CREATE INDEX `IDX_creationDate_ASC` ON `candidate-applications` (`creationDate` ASC)");
        await queryRunner.query("CREATE INDEX `IDX_creationDate_DESC` ON `candidate-applications` (`creationDate` DESC)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_creationDate_ASC` ON `candidates`");
        await queryRunner.query("DROP INDEX `IDX_creationDate_DESC` ON `candidates`");

        await queryRunner.query("DROP INDEX `IDX_creationDate_ASC` ON `users`");
        await queryRunner.query("DROP INDEX `IDX_creationDate_DESC` ON `users`");

        await queryRunner.query("DROP INDEX `IDX_creationDate_ASC` ON `customer`");
        await queryRunner.query("DROP INDEX `IDX_creationDate_DESC` ON `customer`");

        await queryRunner.query("DROP INDEX `IDX_creationDate_ASC` ON `job-offers`");
        await queryRunner.query("DROP INDEX `IDX_creationDate_DESC` ON `job-offers`");

        await queryRunner.query("DROP INDEX `IDX_creationDate_ASC` ON `candidate-applications`");
        await queryRunner.query("DROP INDEX `IDX_creationDate_DESC` ON `candidate-applications`");

    }

}
