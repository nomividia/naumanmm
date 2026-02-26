"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobReferencesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const app_common_module_1 = require("../../shared/app-common.module");
const job_reference_entity_1 = require("./job-reference.entity");
const job_references_controller_1 = require("./job-references.controller");
const job_references_service_1 = require("./job-references.service");
let JobReferencesModule = class JobReferencesModule {
};
JobReferencesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => app_common_module_1.AppCommonModule),
            typeorm_1.TypeOrmModule.forFeature([job_reference_entity_1.JobReference]),
        ],
        controllers: [job_references_controller_1.JobReferencesController],
        providers: [job_references_service_1.JobReferencesService],
        exports: [job_references_service_1.JobReferencesService],
    })
], JobReferencesModule);
exports.JobReferencesModule = JobReferencesModule;
//# sourceMappingURL=job-references.module.js.map