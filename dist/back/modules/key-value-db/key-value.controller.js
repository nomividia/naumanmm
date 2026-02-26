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
exports.KeyValueController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shared_constants_1 = require("../../../shared/shared-constants");
const base_search_requests_1 = require("../../models/requests/base-search-requests");
const generic_response_1 = require("../../models/responses/generic-response");
const roles_guard_1 = require("../../services/guards/roles-guard");
const roles_decorator_1 = require("../../services/roles.decorator");
const base_controller_1 = require("../../shared/base.controller");
const key_value_dto_1 = require("./key-value-dto");
const key_value_entity_1 = require("./key-value.entity");
const key_value_service_1 = require("./key-value.service");
let KeyValueController = class KeyValueController extends base_controller_1.BaseController {
    constructor(keyValueService) {
        super();
        this.keyValueService = keyValueService;
    }
    getAll(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (request.keys) {
                const response = new key_value_dto_1.GetKeyValuesResponse(true);
                response.keyValues =
                    yield this.keyValueService.getMultipleKeyValues(request.keys.split(','));
                return response;
            }
            let query = base_search_requests_1.BaseSearchRequest.getDefaultFindOptionsLinq(request, key_value_entity_1.KeyValue);
            if (request.search) {
                query = query.where((x) => x.key).contains(request.search);
            }
            if (request.onlyFrontEditable === 'true') {
                query = query.where((x) => x.frontEditable).equal(true);
            }
            return yield this.keyValueService.findAll({ query });
        });
    }
    saveKeyValue(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.keyValueService.createOrUpdate(dto);
        });
    }
    deleteKeyValues(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.keyValueService.delete(ids.split(','));
        });
    }
};
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.AdminTech),
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all key values',
        operationId: 'getKeyValues',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get Key Values',
        type: key_value_dto_1.GetKeyValuesResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [key_value_dto_1.GetKeyValuesRequest]),
    __metadata("design:returntype", Promise)
], KeyValueController.prototype, "getAll", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.AdminTech),
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'saveKeyValue', operationId: 'saveKeyValue' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'GetKeyValueResponse',
        type: key_value_dto_1.GetKeyValueResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [key_value_dto_1.KeyValueDto]),
    __metadata("design:returntype", Promise)
], KeyValueController.prototype, "saveKeyValue", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.AdminTech),
    (0, common_1.Delete)(':ids'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'deleteKeyValues',
        operationId: 'deleteKeyValues',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'GenericResponse',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KeyValueController.prototype, "deleteKeyValues", null);
KeyValueController = __decorate([
    (0, common_1.Controller)('key-value'),
    (0, swagger_1.ApiTags)('key-value'),
    __metadata("design:paramtypes", [key_value_service_1.KeyValueService])
], KeyValueController);
exports.KeyValueController = KeyValueController;
//# sourceMappingURL=key-value.controller.js.map