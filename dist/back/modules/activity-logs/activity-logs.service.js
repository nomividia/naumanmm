"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.ActivityLogsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nextalys_js_helpers_1 = require("nextalys-js-helpers");
const typeorm_2 = require("typeorm");
const base_model_service_1 = require("../../services/base-model.service");
const referential_service_1 = require("../../services/referential.service");
const activity_log_dto_1 = require("./activity-log-dto");
const activity_log_entity_1 = require("./activity-log.entity");
let ActivityLogsService = class ActivityLogsService extends base_model_service_1.ApplicationBaseModelService {
    constructor(activityLogRepository, referentialService) {
        super();
        this.activityLogRepository = activityLogRepository;
        this.referentialService = referentialService;
        this.modelOptions = {
            getManyResponse: activity_log_dto_1.GetActivityLogsResponse,
            getOneResponse: activity_log_dto_1.GetActivityLogResponse,
            getManyResponseField: 'logs',
            getOneResponseField: 'log',
            repository: this.activityLogRepository,
            getManyRelations: ['user', 'type'],
            entity: activity_log_entity_1.ActivityLog,
        };
    }
    addActivityLog(userId, type, meta) {
        return __awaiter(this, void 0, void 0, function* () {
            const getValueResponse = yield this.referentialService.getAllAppValues([
                type,
            ]);
            if (getValueResponse.success && getValueResponse.appValues.length > 0) {
                let metaString = null;
                if (meta) {
                    metaString = JSON.stringify(meta);
                }
                yield this.createOrUpdate({
                    date: nextalys_js_helpers_1.DateHelpers.toUtcDate(new Date()),
                    userId,
                    typeId: getValueResponse.appValues[0].id,
                    meta: metaString,
                });
            }
        });
    }
};
ActivityLogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(activity_log_entity_1.ActivityLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        referential_service_1.ReferentialService])
], ActivityLogsService);
exports.ActivityLogsService = ActivityLogsService;
//# sourceMappingURL=activity-logs.service.js.map