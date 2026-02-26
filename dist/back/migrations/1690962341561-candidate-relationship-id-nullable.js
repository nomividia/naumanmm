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
exports.candidateRelationshipIdNullable1690962341561 = void 0;
class candidateRelationshipIdNullable1690962341561 {
    constructor() {
        this.name = 'candidateRelationshipIdNullable1690962341561';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidates\` DROP FOREIGN KEY \`FK_50e729b525bd7c9bf803aad4bd3\``);
            yield queryRunner.query(`ALTER TABLE \`candidates\` CHANGE \`relationshipStatusId\` \`relationshipStatusId\` varchar(36) NULL`);
            yield queryRunner.query(`ALTER TABLE \`candidates\` ADD CONSTRAINT \`FK_50e729b525bd7c9bf803aad4bd3\` FOREIGN KEY (\`relationshipStatusId\`) REFERENCES \`app_values\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`candidates\` DROP FOREIGN KEY \`FK_50e729b525bd7c9bf803aad4bd3\``);
            yield queryRunner.query(`ALTER TABLE \`candidates\` CHANGE \`relationshipStatusId\` \`relationshipStatusId\` varchar(36) NOT NULL`);
            yield queryRunner.query(`ALTER TABLE \`candidates\` ADD CONSTRAINT \`FK_50e729b525bd7c9bf803aad4bd3\` FOREIGN KEY (\`relationshipStatusId\`) REFERENCES \`app_values\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
}
exports.candidateRelationshipIdNullable1690962341561 = candidateRelationshipIdNullable1690962341561;
//# sourceMappingURL=1690962341561-candidate-relationship-id-nullable.js.map