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
exports.creationDateIndexOrder1652469309999 = void 0;
class creationDateIndexOrder1652469309999 {
    constructor() {
        this.name = 'creationDateIndexOrder1652469309999';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query("CREATE INDEX `IDX_creationDate_ASC` ON `candidates` (`creationDate` ASC)");
            yield queryRunner.query("CREATE INDEX `IDX_creationDate_DESC` ON `candidates` (`creationDate` DESC)");
            yield queryRunner.query("CREATE INDEX `IDX_creationDate_ASC` ON `users` (`creationDate` ASC)");
            yield queryRunner.query("CREATE INDEX `IDX_creationDate_DESC` ON `users` (`creationDate` DESC)");
            yield queryRunner.query("CREATE INDEX `IDX_creationDate_ASC` ON `customer` (`creationDate` ASC)");
            yield queryRunner.query("CREATE INDEX `IDX_creationDate_DESC` ON `customer` (`creationDate` DESC)");
            yield queryRunner.query("CREATE INDEX `IDX_creationDate_ASC` ON `job-offers` (`creationDate` ASC)");
            yield queryRunner.query("CREATE INDEX `IDX_creationDate_DESC` ON `job-offers` (`creationDate` DESC)");
            yield queryRunner.query("CREATE INDEX `IDX_creationDate_ASC` ON `candidate-applications` (`creationDate` ASC)");
            yield queryRunner.query("CREATE INDEX `IDX_creationDate_DESC` ON `candidate-applications` (`creationDate` DESC)");
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query("DROP INDEX `IDX_creationDate_ASC` ON `candidates`");
            yield queryRunner.query("DROP INDEX `IDX_creationDate_DESC` ON `candidates`");
            yield queryRunner.query("DROP INDEX `IDX_creationDate_ASC` ON `users`");
            yield queryRunner.query("DROP INDEX `IDX_creationDate_DESC` ON `users`");
            yield queryRunner.query("DROP INDEX `IDX_creationDate_ASC` ON `customer`");
            yield queryRunner.query("DROP INDEX `IDX_creationDate_DESC` ON `customer`");
            yield queryRunner.query("DROP INDEX `IDX_creationDate_ASC` ON `job-offers`");
            yield queryRunner.query("DROP INDEX `IDX_creationDate_DESC` ON `job-offers`");
            yield queryRunner.query("DROP INDEX `IDX_creationDate_ASC` ON `candidate-applications`");
            yield queryRunner.query("DROP INDEX `IDX_creationDate_DESC` ON `candidate-applications`");
        });
    }
}
exports.creationDateIndexOrder1652469309999 = creationDateIndexOrder1652469309999;
//# sourceMappingURL=1652469309999-creation-date-index-order.js.map