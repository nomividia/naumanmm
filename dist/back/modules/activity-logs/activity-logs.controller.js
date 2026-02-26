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
exports.ActivityLogsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const typeorm_linq_repository_1 = require("typeorm-linq-repository");
const shared_constants_1 = require("../../../shared/shared-constants");
const app_value_entity_1 = require("../../entities/app-value.entity");
const base_search_requests_1 = require("../../models/requests/base-search-requests");
const roles_guard_1 = require("../../services/guards/roles-guard");
const roles_decorator_1 = require("../../services/roles.decorator");
const base_controller_1 = require("../../shared/base.controller");
const activity_log_dto_1 = require("./activity-log-dto");
const activity_log_entity_1 = require("./activity-log.entity");
const activity_logs_service_1 = require("./activity-logs.service");
let ActivityLogsController = class ActivityLogsController extends base_controller_1.BaseController {
    constructor(activityLogsService) {
        super();
        this.activityLogsService = activityLogsService;
    }
    getAll(request) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = base_search_requests_1.BaseSearchRequest.getDefaultFindOptionsLinq(request, activity_log_entity_1.ActivityLog);
            if (request.search) {
                const appValues = yield new typeorm_linq_repository_1.LinqRepository(app_value_entity_1.AppValue)
                    .getAll()
                    .where((x) => x.label)
                    .contains(request.search)
                    .toPromise();
                if (appValues.length > 0) {
                    query = query
                        .where((x) => x.typeId)
                        .in(appValues.map((x) => x.id));
                }
                else {
                    return new activity_log_dto_1.GetActivityLogsResponse(true);
                }
            }
            const queryData = {
                query,
                relations: [{ include: (x) => x.user }, { include: (x) => x.type }],
            };
            return yield this.activityLogsService.findAll(queryData);
        });
    }
};
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin),
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all activity logs',
        operationId: 'getActivityLogs',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get activity logs',
        type: activity_log_dto_1.GetActivityLogsResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_search_requests_1.BaseSearchRequest]),
    __metadata("design:returntype", Promise)
], ActivityLogsController.prototype, "getAll", null);
ActivityLogsController = __decorate([
    (0, common_1.Controller)('activity-logs'),
    (0, swagger_1.ApiTags)('activity-logs'),
    __metadata("design:paramtypes", [activity_logs_service_1.ActivityLogsService])
], ActivityLogsController);
exports.ActivityLogsController = ActivityLogsController;
//# sourceMappingURL=activity-logs.controller.js.map