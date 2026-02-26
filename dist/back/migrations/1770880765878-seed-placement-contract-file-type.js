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
exports.seedPlacementContractFileType1770880765878 = void 0;
class seedPlacementContractFileType1770880765878 {
    constructor() {
        this.name = 'seedPlacementContractFileType1770880765878';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = yield queryRunner.query(`SELECT COUNT(*) as cnt FROM \`app_values\` WHERE \`code\` = 'CandidateFileType_PlacementContract'`);
            if (exists[0].cnt === 0) {
                const [existingType] = yield queryRunner.query(`SELECT \`appTypeId\` FROM \`app_values\` WHERE \`code\` LIKE 'CandidateFileType_%' LIMIT 1`);
                const appTypeId = existingType === null || existingType === void 0 ? void 0 : existingType.appTypeId;
                if (appTypeId) {
                    yield queryRunner.query(`INSERT INTO \`app_values\` (\`id\`, \`label\`, \`enabled\`, \`code\`, \`appTypeId\`, \`order\`) VALUES (UUID(), 'Placement Contract', 1, 'CandidateFileType_PlacementContract', '${appTypeId}', 99)`);
                }
            }
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DELETE FROM \`app_values\` WHERE \`code\` = 'CandidateFileType_PlacementContract'`);
        });
    }
}
exports.seedPlacementContractFileType1770880765878 = seedPlacementContractFileType1770880765878;
//# sourceMappingURL=1770880765878-seed-placement-contract-file-type.js.map