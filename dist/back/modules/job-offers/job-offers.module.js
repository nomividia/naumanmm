"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobOfferModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const app_common_module_1 = require("../../shared/app-common.module");
const mail_module_1 = require("../mail/mail.module");
const job_offer_entity_1 = require("./job-offer.entity");
const job_offers_controller_1 = require("./job-offers.controller");
const job_offers_service_1 = require("./job-offers.service");
let JobOfferModule = class JobOfferModule {
};
JobOfferModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => app_common_module_1.AppCommonModule),
            typeorm_1.TypeOrmModule.forFeature([job_offer_entity_1.JobOffer]),
            mail_module_1.MailModule,
        ],
        controllers: [job_offers_controller_1.JobOfferController],
        providers: [job_offers_service_1.JobOfferService],
        exports: [job_offers_service_1.JobOfferService],
    })
], JobOfferModule);
exports.JobOfferModule = JobOfferModule;
//# sourceMappingURL=job-offers.module.js.map