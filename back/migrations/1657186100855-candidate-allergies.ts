import { MigrationInterface, QueryRunner } from "typeorm";

export class candidateAllergies1657186100855 implements MigrationInterface {
    name = 'candidateAllergies1657186100855'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidates\` ADD \`allergy\` enum ('AnyAllergies_CandidateAllergies', 'Dog_CandidateAllergies', 'Cat_CandidateAllergies', 'DogAndCat_CandidateAllergies') NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidates\` DROP COLUMN \`allergy\``);
    }

}
