import { MigrationInterface, QueryRunner } from "typeorm";

export class removeIndexes1652450473656 implements MigrationInterface {
    name = 'removeIndexes1652450473656'

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query("DROP INDEX `IDX_1a1491f89f96f3121e64f698e0` ON `app_files`");
            await queryRunner.query("DROP INDEX `IDX_146196707a774dca62a83112cc` ON `app_rights`");
            await queryRunner.query("DROP INDEX `IDX_35b97af562914d7bf9dbd3cfde` ON `notifications`");
            await queryRunner.query("DROP INDEX `IDX_3c712a34b15f3e723dba97704d` ON `candidates-files`");
            await queryRunner.query("DROP INDEX `IDX_9219701f1ae4eb8f46bc7953fb` ON `note-item`");
            await queryRunner.query("DROP INDEX `IDX_bba9a21cc41b5756f801b11e00` ON `candidates-resume-formation`");
            await queryRunner.query("DROP INDEX `IDX_c60fe20239b9d3742add371e31` ON `candidates-resume`");
            await queryRunner.query("DROP INDEX `IDX_b0a0f66e1a09fb43b386ea1b86` ON `candidates-resume-experience`");
            await queryRunner.query("DROP INDEX `IDX_308924f0627053a227df6b5137` ON `experience-family-child`");
            await queryRunner.query("DROP INDEX `IDX_d4bf29ea855c6ba1fa38d85f2e` ON `job-references`");
            await queryRunner.query("DROP INDEX `IDX_8dff94ebaabf67cfdaf83efb0b` ON `candidate-jobs`");
            await queryRunner.query("DROP INDEX `IDX_458e3f8e647242e350cdebcb68` ON `interviews`");
            await queryRunner.query("DROP INDEX `IDX_52f47bb96426f678e00192c566` ON `candidate-children`");
            await queryRunner.query("DROP INDEX `IDX_2e994299ee3944f821ea940b9e` ON `candidate-language`");
            await queryRunner.query("DROP INDEX `IDX_ff0963f10354cad3648244c466` ON `candidate-licences`");
            await queryRunner.query("DROP INDEX `IDX_a997193eb447fe14d8c8ba232d` ON `candidate-pet`");
            await queryRunner.query("DROP INDEX `IDX_b8f013ce4c0701706cf087bb96` ON `candidate-contracts`");
            await queryRunner.query("DROP INDEX `IDX_b780673dd28b2c00b076d2081e` ON `candidate-country`");
            await queryRunner.query("DROP INDEX `IDX_11d5cc22120545105516c5e55e` ON `candidates`");
            await queryRunner.query("DROP INDEX `IDX_9a295686ae2e45fae23fa44c98` ON `users`");
            await queryRunner.query("DROP INDEX `IDX_bf326f200968478f44ea1c9594` ON `customer`");
            await queryRunner.query("DROP INDEX `IDX_698b06e42cd65b8a68ede932e2` ON `job-offers`");
            await queryRunner.query("DROP INDEX `IDX_dbb3b2b59ac4b40a934ee2bc0c` ON `candidate-application-jobs`");
            await queryRunner.query("DROP INDEX `IDX_02f3edb615e5356d4f9b6b0f8f` ON `candidate-applications`");
            await queryRunner.query("DROP INDEX `IDX_0b35ad368f815c9c6e68ee038b` ON `address`");
            await queryRunner.query("DROP INDEX `IDX_3611aa154ac709afe756084129` ON `app_images`");
            await queryRunner.query("DROP INDEX `IDX_35f76c7688fa6b61903f691ef3` ON `candidate-messages`");
            await queryRunner.query("DROP INDEX `IDX_a60bda16a7b116fc6c24b5af35` ON `newsletter-candidate-status`");
            await queryRunner.query("DROP INDEX `IDX_ba40c01afb47e4a17d7fd7ca95` ON `newsletter-joboffer`");
            await queryRunner.query("DROP INDEX `IDX_efb9c33098f3ee17dc4798fb5e` ON `newsletter`");
            await queryRunner.query("DROP INDEX `IDX_1b2f3ba4b398ad05d5c1cfaaf0` ON `newsletter-candidate-jobs`");
        }
        catch {

        }

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE INDEX `IDX_1b2f3ba4b398ad05d5c1cfaaf0` ON `newsletter-candidate-jobs` (`creationDate`)");
        await queryRunner.query("CREATE INDEX `IDX_efb9c33098f3ee17dc4798fb5e` ON `newsletter` (`creationDate`)");
        await queryRunner.query("CREATE INDEX `IDX_ba40c01afb47e4a17d7fd7ca95` ON `newsletter-joboffer` (`creationDate`)");
        await queryRunner.query("CREATE INDEX `IDX_a60bda16a7b116fc6c24b5af35` ON `newsletter-candidate-status` (`creationDate`)");
        await queryRunner.query("CREATE INDEX `IDX_35f76c7688fa6b61903f691ef3` ON `candidate-messages` (`creationDate`)");
        await queryRunner.query("CREATE INDEX `IDX_3611aa154ac709afe756084129` ON `app_images` (`creationDate`)");
        await queryRunner.query("CREATE INDEX `IDX_0b35ad368f815c9c6e68ee038b` ON `address` (`creationDate`)");
        await queryRunner.query("CREATE INDEX `IDX_02f3edb615e5356d4f9b6b0f8f` ON `candidate-applications` (`creationDate`)");
        await queryRunner.query("CREATE INDEX `IDX_dbb3b2b59ac4b40a934ee2bc0c` ON `candidate-application-jobs` (`creationDate`)");
        await queryRunner.query("CREATE INDEX `IDX_698b06e42cd65b8a68ede932e2` ON `job-offers` (`creationDate`)");
        await queryRunner.query("CREATE INDEX `IDX_bf326f200968478f44ea1c9594` ON `customer` (`creationDate`)");
        await queryRunner.query("CREATE INDEX `IDX_9a295686ae2e45fae23fa44c98` ON `users` (`creationDate`)");
        await queryRunner.query("CREATE INDEX `IDX_11d5cc22120545105516c5e55e` ON `candidates` (`creationDate`)");
        await queryRunner.query("CREATE INDEX `IDX_b780673dd28b2c00b076d2081e` ON `candidate-country` (`creationDate`)");
        await queryRunner.query("CREATE INDEX `IDX_b8f013ce4c0701706cf087bb96` ON `candidate-contracts` (`creationDate`)");
        await queryRunner.query("CREATE INDEX `IDX_a997193eb447fe14d8c8ba232d` ON `candidate-pet` (`creationDate`)");
        await queryRunner.query("CREATE INDEX `IDX_ff0963f10354cad3648244c466` ON `candidate-licences` (`creationDate`)");
        await queryRunner.query("CREATE INDEX `IDX_2e994299ee3944f821ea940b9e` ON `candidate-language` (`creationDate`)");
        await queryRunner.query("CREATE INDEX `IDX_52f47bb96426f678e00192c566` ON `candidate-children` (`creationDate`)");
        await queryRunner.query("CREATE INDEX `IDX_458e3f8e647242e350cdebcb68` ON `interviews` (`creationDate`)");
        await queryRunner.query("CREATE INDEX `IDX_8dff94ebaabf67cfdaf83efb0b` ON `candidate-jobs` (`creationDate`)");
        await queryRunner.query("CREATE INDEX `IDX_d4bf29ea855c6ba1fa38d85f2e` ON `job-references` (`creationDate`)");
        await queryRunner.query("CREATE INDEX `IDX_308924f0627053a227df6b5137` ON `experience-family-child` (`creationDate`)");
        await queryRunner.query("CREATE INDEX `IDX_b0a0f66e1a09fb43b386ea1b86` ON `candidates-resume-experience` (`creationDate`)");
        await queryRunner.query("CREATE INDEX `IDX_c60fe20239b9d3742add371e31` ON `candidates-resume` (`creationDate`)");
        await queryRunner.query("CREATE INDEX `IDX_bba9a21cc41b5756f801b11e00` ON `candidates-resume-formation` (`creationDate`)");
        await queryRunner.query("CREATE INDEX `IDX_9219701f1ae4eb8f46bc7953fb` ON `note-item` (`creationDate`)");
        await queryRunner.query("CREATE INDEX `IDX_3c712a34b15f3e723dba97704d` ON `candidates-files` (`creationDate`)");
        await queryRunner.query("CREATE INDEX `IDX_35b97af562914d7bf9dbd3cfde` ON `notifications` (`creationDate`)");
        await queryRunner.query("CREATE INDEX `IDX_146196707a774dca62a83112cc` ON `app_rights` (`creationDate`)");
        await queryRunner.query("CREATE INDEX `IDX_1a1491f89f96f3121e64f698e0` ON `app_files` (`creationDate`)");
    }

}
