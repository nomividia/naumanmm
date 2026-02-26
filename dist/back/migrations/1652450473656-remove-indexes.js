"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeIndexes1652450473656 = void 0;
class removeIndexes1652450473656 {
    constructor() {
        this.name = 'removeIndexes1652450473656';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield queryRunner.query("DROP INDEX `IDX_1a1491f89f96f3121e64f698e0` ON `app_files`");
                yield queryRunner.query("DROP INDEX `IDX_146196707a774dca62a83112cc` ON `app_rights`");
                yield queryRunner.query("DROP INDEX `IDX_35b97af562914d7bf9dbd3cfde` ON `notifications`");
                yield queryRunner.query("DROP INDEX `IDX_3c712a34b15f3e723dba97704d` ON `candidates-files`");
                yield queryRunner.query("DROP INDEX `IDX_9219701f1ae4eb8f46bc7953fb` ON `note-item`");
                yield queryRunner.query("DROP INDEX `IDX_bba9a21cc41b5756f801b11e00` ON `candidates-resume-formation`");
                yield queryRunner.query("DROP INDEX `IDX_c60fe20239b9d3742add371e31` ON `candidates-resume`");
                yield queryRunner.query("DROP INDEX `IDX_b0a0f66e1a09fb43b386ea1b86` ON `candidates-resume-experience`");
                yield queryRunner.query("DROP INDEX `IDX_308924f0627053a227df6b5137` ON `experience-family-child`");
                yield queryRunner.query("DROP INDEX `IDX_d4bf29ea855c6ba1fa38d85f2e` ON `job-references`");
                yield queryRunner.query("DROP INDEX `IDX_8dff94ebaabf67cfdaf83efb0b` ON `candidate-jobs`");
                yield queryRunner.query("DROP INDEX `IDX_458e3f8e647242e350cdebcb68` ON `interviews`");
                yield queryRunner.query("DROP INDEX `IDX_52f47bb96426f678e00192c566` ON `candidate-children`");
                yield queryRunner.query("DROP INDEX `IDX_2e994299ee3944f821ea940b9e` ON `candidate-language`");
                yield queryRunner.query("DROP INDEX `IDX_ff0963f10354cad3648244c466` ON `candidate-licences`");
                yield queryRunner.query("DROP INDEX `IDX_a997193eb447fe14d8c8ba232d` ON `candidate-pet`");
                yield queryRunner.query("DROP INDEX `IDX_b8f013ce4c0701706cf087bb96` ON `candidate-contracts`");
                yield queryRunner.query("DROP INDEX `IDX_b780673dd28b2c00b076d2081e` ON `candidate-country`");
                yield queryRunner.query("DROP INDEX `IDX_11d5cc22120545105516c5e55e` ON `candidates`");
                yield queryRunner.query("DROP INDEX `IDX_9a295686ae2e45fae23fa44c98` ON `users`");
                yield queryRunner.query("DROP INDEX `IDX_bf326f200968478f44ea1c9594` ON `customer`");
                yield queryRunner.query("DROP INDEX `IDX_698b06e42cd65b8a68ede932e2` ON `job-offers`");
                yield queryRunner.query("DROP INDEX `IDX_dbb3b2b59ac4b40a934ee2bc0c` ON `candidate-application-jobs`");
                yield queryRunner.query("DROP INDEX `IDX_02f3edb615e5356d4f9b6b0f8f` ON `candidate-applications`");
                yield queryRunner.query("DROP INDEX `IDX_0b35ad368f815c9c6e68ee038b` ON `address`");
                yield queryRunner.query("DROP INDEX `IDX_3611aa154ac709afe756084129` ON `app_images`");
                yield queryRunner.query("DROP INDEX `IDX_35f76c7688fa6b61903f691ef3` ON `candidate-messages`");
                yield queryRunner.query("DROP INDEX `IDX_a60bda16a7b116fc6c24b5af35` ON `newsletter-candidate-status`");
                yield queryRunner.query("DROP INDEX `IDX_ba40c01afb47e4a17d7fd7ca95` ON `newsletter-joboffer`");
                yield queryRunner.query("DROP INDEX `IDX_efb9c33098f3ee17dc4798fb5e` ON `newsletter`");
                yield queryRunner.query("DROP INDEX `IDX_1b2f3ba4b398ad05d5c1cfaaf0` ON `newsletter-candidate-jobs`");
            }
            catch (_a) {
            }
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query("CREATE INDEX `IDX_1b2f3ba4b398ad05d5c1cfaaf0` ON `newsletter-candidate-jobs` (`creationDate`)");
            yield queryRunner.query("CREATE INDEX `IDX_efb9c33098f3ee17dc4798fb5e` ON `newsletter` (`creationDate`)");
            yield queryRunner.query("CREATE INDEX `IDX_ba40c01afb47e4a17d7fd7ca95` ON `newsletter-joboffer` (`creationDate`)");
            yield queryRunner.query("CREATE INDEX `IDX_a60bda16a7b116fc6c24b5af35` ON `newsletter-candidate-status` (`creationDate`)");
            yield queryRunner.query("CREATE INDEX `IDX_35f76c7688fa6b61903f691ef3` ON `candidate-messages` (`creationDate`)");
            yield queryRunner.query("CREATE INDEX `IDX_3611aa154ac709afe756084129` ON `app_images` (`creationDate`)");
            yield queryRunner.query("CREATE INDEX `IDX_0b35ad368f815c9c6e68ee038b` ON `address` (`creationDate`)");
            yield queryRunner.query("CREATE INDEX `IDX_02f3edb615e5356d4f9b6b0f8f` ON `candidate-applications` (`creationDate`)");
            yield queryRunner.query("CREATE INDEX `IDX_dbb3b2b59ac4b40a934ee2bc0c` ON `candidate-application-jobs` (`creationDate`)");
            yield queryRunner.query("CREATE INDEX `IDX_698b06e42cd65b8a68ede932e2` ON `job-offers` (`creationDate`)");
            yield queryRunner.query("CREATE INDEX `IDX_bf326f200968478f44ea1c9594` ON `customer` (`creationDate`)");
            yield queryRunner.query("CREATE INDEX `IDX_9a295686ae2e45fae23fa44c98` ON `users` (`creationDate`)");
            yield queryRunner.query("CREATE INDEX `IDX_11d5cc22120545105516c5e55e` ON `candidates` (`creationDate`)");
            yield queryRunner.query("CREATE INDEX `IDX_b780673dd28b2c00b076d2081e` ON `candidate-country` (`creationDate`)");
            yield queryRunner.query("CREATE INDEX `IDX_b8f013ce4c0701706cf087bb96` ON `candidate-contracts` (`creationDate`)");
            yield queryRunner.query("CREATE INDEX `IDX_a997193eb447fe14d8c8ba232d` ON `candidate-pet` (`creationDate`)");
            yield queryRunner.query("CREATE INDEX `IDX_ff0963f10354cad3648244c466` ON `candidate-licences` (`creationDate`)");
            yield queryRunner.query("CREATE INDEX `IDX_2e994299ee3944f821ea940b9e` ON `candidate-language` (`creationDate`)");
            yield queryRunner.query("CREATE INDEX `IDX_52f47bb96426f678e00192c566` ON `candidate-children` (`creationDate`)");
            yield queryRunner.query("CREATE INDEX `IDX_458e3f8e647242e350cdebcb68` ON `interviews` (`creationDate`)");
            yield queryRunner.query("CREATE INDEX `IDX_8dff94ebaabf67cfdaf83efb0b` ON `candidate-jobs` (`creationDate`)");
            yield queryRunner.query("CREATE INDEX `IDX_d4bf29ea855c6ba1fa38d85f2e` ON `job-references` (`creationDate`)");
            yield queryRunner.query("CREATE INDEX `IDX_308924f0627053a227df6b5137` ON `experience-family-child` (`creationDate`)");
            yield queryRunner.query("CREATE INDEX `IDX_b0a0f66e1a09fb43b386ea1b86` ON `candidates-resume-experience` (`creationDate`)");
            yield queryRunner.query("CREATE INDEX `IDX_c60fe20239b9d3742add371e31` ON `candidates-resume` (`creationDate`)");
            yield queryRunner.query("CREATE INDEX `IDX_bba9a21cc41b5756f801b11e00` ON `candidates-resume-formation` (`creationDate`)");
            yield queryRunner.query("CREATE INDEX `IDX_9219701f1ae4eb8f46bc7953fb` ON `note-item` (`creationDate`)");
            yield queryRunner.query("CREATE INDEX `IDX_3c712a34b15f3e723dba97704d` ON `candidates-files` (`creationDate`)");
            yield queryRunner.query("CREATE INDEX `IDX_35b97af562914d7bf9dbd3cfde` ON `notifications` (`creationDate`)");
            yield queryRunner.query("CREATE INDEX `IDX_146196707a774dca62a83112cc` ON `app_rights` (`creationDate`)");
            yield queryRunner.query("CREATE INDEX `IDX_1a1491f89f96f3121e64f698e0` ON `app_files` (`creationDate`)");
        });
    }
}
exports.removeIndexes1652450473656 = removeIndexes1652450473656;
//# sourceMappingURL=1652450473656-remove-indexes.js.map