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
exports.UserRoleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_role_entity_1 = require("../entities/user-role.entity");
const user_role_dto_1 = require("../models/dto/user-role-dto");
const base_model_service_1 = require("./base-model.service");
let UserRoleService = class UserRoleService extends base_model_service_1.ApplicationBaseModelService {
    constructor(userRolesRepository) {
        super();
        this.userRolesRepository = userRolesRepository;
        this.userRolesList = [];
        this.modelOptions = {
            getManyResponse: user_role_dto_1.GetUserRolesResponse,
            getOneResponse: user_role_dto_1.GetUserRoleResponse,
            getManyResponseField: 'userRoles',
            getOneResponseField: 'userRole',
            getOneRelations: ['rights'],
            repository: this.userRolesRepository,
            entity: user_role_entity_1.UserRole,
            archiveField: 'enabled',
            archiveFieldValue: false,
        };
    }
    createOrUpdate(dto) {
        const _super = Object.create(null, {
            createOrUpdate: { get: () => super.createOrUpdate }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.userRolesList = [];
            return yield _super.createOrUpdate.call(this, dto);
        });
    }
    getAllUserRoles() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new user_role_dto_1.GetUserRolesResponse();
            if ((_a = this.userRolesList) === null || _a === void 0 ? void 0 : _a.length) {
                response.userRoles = this.userRolesList;
                response.success = true;
                return response;
            }
            const userRolesResponse = yield this.findAll();
            if (userRolesResponse.success && userRolesResponse.userRoles) {
                this.userRolesList = userRolesResponse.userRoles;
                response.userRoles = this.userRolesList;
                response.success = true;
            }
            else if (!userRolesResponse.success) {
                response.message = userRolesResponse.message;
            }
            return response;
        });
    }
    delete(ids) {
        const _super = Object.create(null, {
            delete: { get: () => super.delete }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.userRolesList = [];
            return yield _super.delete.call(this, ids);
        });
    }
    archive(ids) {
        const _super = Object.create(null, {
            archive: { get: () => super.archive }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.userRolesList = [];
            return yield _super.archive.call(this, ids);
        });
    }
};
UserRoleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_role_entity_1.UserRole)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserRoleService);
exports.UserRoleService = UserRoleService;
//# sourceMappingURL=user-roles.service.js.map