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
exports.JobOfferService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const puppeteer = require("puppeteer");
const typeorm_2 = require("typeorm");
const candidates_helpers_1 = require("../../../shared/candidates-helpers");
const shared_constants_1 = require("../../../shared/shared-constants");
const app_error_1 = require("../../models/app-error");
const generic_response_1 = require("../../models/responses/generic-response");
const base_model_service_1 = require("../../services/base-model.service");
const referential_service_1 = require("../../services/referential.service");
const mail_service_1 = require("../../services/tools/mail.service");
const job_offer_dto_1 = require("./job-offer-dto");
const job_offer_entity_1 = require("./job-offer.entity");
let JobOfferService = class JobOfferService extends base_model_service_1.ApplicationBaseModelService {
    constructor(repository, mailService, referentialService) {
        super();
        this.repository = repository;
        this.mailService = mailService;
        this.referentialService = referentialService;
        this.modelOptions = {
            getManyResponse: job_offer_dto_1.GetJobOffersResponse,
            getOneResponse: job_offer_dto_1.GetJobOfferResponse,
            getManyResponseField: 'jobOffers',
            getOneResponseField: 'jobOffer',
            getManyRelations: [
                'consultant',
                'customer',
                'contractType',
                'contractType.translations',
                'state',
                'job',
                'state.translations',
            ],
            getOneRelations: [
                'consultant',
                'consultant.image',
                'job',
                'contractType',
                'customer',
                'state',
                'state.translations',
            ],
            repository: this.repository,
            entity: job_offer_entity_1.JobOffer,
            archiveField: 'disabled',
            archiveFieldValue: true,
        };
    }
    createOrUpdate(dto, ...toDtoParameters) {
        const _super = Object.create(null, {
            findOne: { get: () => super.findOne },
            createOrUpdate: { get: () => super.createOrUpdate }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const getAppValueResponse = yield this.referentialService.getOneAppValue(shared_constants_1.JobOfferState.Activated);
            if (!getAppValueResponse.success) {
                throw new app_error_1.AppErrorWithMessage('Error');
            }
            if (!dto.stateId) {
                dto.stateId = getAppValueResponse.appValue.id;
            }
            const getJobOfferResponse = yield _super.findOne.call(this, {
                where: { ref: dto.ref },
            });
            if (getJobOfferResponse.success && getJobOfferResponse.jobOffer) {
                if (getJobOfferResponse.jobOffer.id !== dto.id) {
                    throw new app_error_1.AppErrorWithMessage('Reference existante');
                }
            }
            return _super.createOrUpdate.call(this, dto, toDtoParameters);
        });
    }
    findAllExcludingPlaced(findOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const allJobOffers = yield this.findAll(findOptions);
            if (!allJobOffers.success) {
                return allJobOffers;
            }
            const placedJobOfferIds = yield this.repository
                .createQueryBuilder('jobOffer')
                .select('jobOffer.id')
                .innerJoin('candidates', 'candidate', 'candidate.placedJobOfferId = jobOffer.id')
                .where('candidate.placedJobOfferId IS NOT NULL')
                .getMany();
            const placedIds = placedJobOfferIds.map((jobOffer) => jobOffer.id);
            allJobOffers.jobOffers = allJobOffers.jobOffers.filter((jobOffer) => !placedIds.includes(jobOffer.id));
            allJobOffers.filteredResults = allJobOffers.jobOffers.length;
            return allJobOffers;
        });
    }
    scrapping() {
        return __awaiter(this, void 0, void 0, function* () {
            let lastJobOffer = 1800;
            const response = new generic_response_1.GenericResponse();
            try {
                const browser = yield puppeteer.launch({
                    headless: true,
                    args: ['--no-sandbox'],
                });
                const page = yield browser.newPage();
                console.log('before');
                page.setJavaScriptEnabled(false);
                const httpResponse = yield page.goto('https://www.personneldemaison.agency/jobs--emplois-personnel-de-maison.html');
                console.log('after');
                if (!httpResponse.ok()) {
                    throw new app_error_1.AppErrorWithMessage('httpResponse not ok');
                }
                const links = yield page.evaluate(() => {
                    const data = [];
                    const elements = document.querySelectorAll('div.wsite-section-elements div.imageGallery div.galleryImageHolder div.galleryInnerImageHolder a');
                    for (const element of elements) {
                        data.push(element.href);
                    }
                    return data;
                });
                console.log('Log ~ file: job-offers.service.ts ~ line 47 ~ JobOfferService ~ links ~ links', links);
                let counter = 0;
                for (const link of links) {
                    if (counter === 1) {
                        break;
                    }
                    const httpResponseForLink = yield page.goto(link);
                    if (!httpResponseForLink.ok()) {
                        throw new app_error_1.AppErrorWithMessage('httpResponseForLink not ok');
                    }
                    const jobOfferDataListResult = yield page.evaluate((argLastJobOffer) => {
                        const jobOfferDataList = [];
                        const elements = document.querySelectorAll('div.wsite-multicol .wsite-multicol-col');
                        if (elements.length === 0) {
                            return [];
                        }
                        for (const element of elements) {
                            const refElements = element.querySelectorAll('.paragraph ul li');
                            const jobOfferData = {};
                            if (!(refElements === null || refElements === void 0 ? void 0 : refElements.length) ||
                                refElements[0].textContent.indexOf('Référence: ') === -1) {
                                continue;
                            }
                            let refJobOffer = refElements[0].textContent.split('Référence: ')[1];
                            refJobOffer = refJobOffer.trim();
                            if (!refJobOffer) {
                                continue;
                            }
                            const refSplitted = refJobOffer.split(' ');
                            const refNumber = parseInt(refSplitted[0], 10);
                            if (isNaN(refNumber)) {
                                continue;
                            }
                            if (refNumber < argLastJobOffer) {
                                continue;
                            }
                            const titleElements = element.querySelectorAll('.wsite-content-title a');
                            if (!(titleElements === null || titleElements === void 0 ? void 0 : titleElements.length)) {
                                continue;
                            }
                            jobOfferData.ref = refJobOffer;
                            jobOfferData.title = titleElements[0].textContent;
                            jobOfferData.publicLink = titleElements[0].href;
                            jobOfferDataList.push(jobOfferData);
                        }
                        return jobOfferDataList;
                    }, lastJobOffer);
                    console.log('Log ~ file: job-offers.service.ts ~ line 71 ~ JobOfferService ~ jobOfferDataList ~ jobOfferDataList', jobOfferDataListResult);
                    counter++;
                }
                yield browser.close();
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    sendJobOfferByMail(request, consultantEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailSender = yield candidates_helpers_1.SharedCandidatesHelpers.getMailSenderFromCandidate(null, null, null, consultantEmail);
            return this.mailService.sendMail({
                to: [{ address: request.email }],
                htmlBody: request.content,
                subject: request.object,
                from: { address: request.sender || mailSender },
            });
        });
    }
};
JobOfferService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_offer_entity_1.JobOffer)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        mail_service_1.MailService,
        referential_service_1.ReferentialService])
], JobOfferService);
exports.JobOfferService = JobOfferService;
//# sourceMappingURL=job-offers.service.js.map