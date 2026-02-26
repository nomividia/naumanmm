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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const base_model_service_1 = require("../../services/base-model.service");
const history_dto_1 = require("./history.dto");
const history_entity_1 = require("./history.entity");
let HistoriesService = class HistoriesService extends base_model_service_1.ApplicationBaseModelService {
    constructor(repository) {
        super();
        this.repository = repository;
        this.modelOptions = {
            getManyResponse: history_dto_1.GetHistoriesResponse,
            getOneResponse: history_dto_1.GetHistoryResponse,
            getManyResponseField: 'histories',
            getOneResponseField: 'history',
            getManyRelations: ['user'],
            getOneRelations: ['user'],
            repository: this.repository,
            entity: history_entity_1.History,
            archiveField: 'disabled',
            archiveFieldValue: true,
        };
    }
};
HistoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(history_entity_1.History)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], HistoriesService);
exports.HistoriesService = HistoriesService;
//# sourceMappingURL=histories.service.js.map