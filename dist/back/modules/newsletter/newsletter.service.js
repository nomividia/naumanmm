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
exports.NewsletterService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nextalys_js_helpers_1 = require("nextalys-js-helpers");
const typeorm_2 = require("typeorm");
const country_names_helper_1 = require("../../../shared/country-names-helper");
const routes_1 = require("../../../shared/routes");
const shared_constants_1 = require("../../../shared/shared-constants");
const shared_service_1 = require("../../../shared/shared-service");
const address_entity_1 = require("../../entities/address.entity");
const environment_1 = require("../../environment/environment");
const app_error_1 = require("../../models/app-error");
const base_search_requests_1 = require("../../models/requests/base-search-requests");
const generic_response_1 = require("../../models/responses/generic-response");
const base_model_service_1 = require("../../services/base-model.service");
const referential_service_1 = require("../../services/referential.service");
const logger_service_1 = require("../../services/tools/logger.service");
const mail_service_1 = require("../../services/tools/mail.service");
const translation_service_1 = require("../../services/translation.service");
const candidate_applications_service_1 = require("../candidates-application/candidate-applications.service");
const candidate_current_jobs_entity_1 = require("../candidates/candidate-current-jobs/candidate-current-jobs.entity");
const candidates_service_1 = require("../candidates/candidates.service");
const sms_service_1 = require("../sms/sms.service");
const newsletter_dto_1 = require("./newsletter.dto");
const newsletter_entity_1 = require("./newsletter.entity");
let NewsletterService = class NewsletterService extends base_model_service_1.ApplicationBaseModelService {
    constructor(repository, referentialService, candidateService, candidateApplicationService, mailService, smsService) {
        super();
        this.repository = repository;
        this.referentialService = referentialService;
        this.candidateService = candidateService;
        this.candidateApplicationService = candidateApplicationService;
        this.mailService = mailService;
        this.smsService = smsService;
        this.modelOptions = {
            getManyResponse: newsletter_dto_1.GetNewslettersResponse,
            getOneResponse: newsletter_dto_1.GetNewsletterResponse,
            getManyResponseField: 'newsletters',
            getOneResponseField: 'newsletter',
            getManyRelations: ['newsletterStatus'],
            getOneRelations: [
                'newsletterStatus',
                'newslettersJobOffer',
                'newslettersJobOffer.jobOffer',
                'newsLettersCandidateStatus',
                'newsLettersCandidateJobs',
            ],
            repository: this.repository,
            entity: newsletter_entity_1.Newsletter,
            archiveField: 'disabled',
            archiveFieldValue: true,
        };
    }
    archiveNewslettersStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new newsletter_dto_1.GetNewsletterResponse();
            try {
                const getNewsletter = yield this.findOne({
                    where: { id: id },
                    relations: ['newsletterStatus'],
                });
                const getAppType = yield this.referentialService.getTypeValues({
                    appTypeCode: shared_constants_1.AppTypes.NewsletterStateCode,
                });
                if (!getNewsletter.success) {
                    throw new app_error_1.AppErrorWithMessage('Impossible to find newsletter with this id');
                }
                if (!getAppType.success) {
                    throw new app_error_1.AppErrorWithMessage('Impossible to get apptype');
                }
                const appType = getAppType.appType;
                const newsletter = getNewsletter.newsletter;
                newsletter.newsletterStatus = null;
                newsletter.newsletterStatusId = appType.appValues.find((x) => x.code === shared_constants_1.NewsletterState.Archived).id;
                const saveResponse = yield this.createOrUpdate(newsletter);
                if (!saveResponse.success) {
                    throw new app_error_1.AppErrorWithMessage(response.message);
                }
                response.newsletter = saveResponse.newsletter;
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    sendNewsletter(id, consultantEmail) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                const getNewletter = yield this.repository.findOne({
                    where: { id: id },
                    relations: this.modelOptions.getOneRelations,
                });
                if (!getNewletter) {
                    throw new app_error_1.AppErrorWithMessage('Unable to find newsletter with this id');
                }
                const newsletterDto = getNewletter.toDto();
                if (!((_a = newsletterDto.newsLettersCandidateStatus) === null || _a === void 0 ? void 0 : _a.length)) {
                    throw new app_error_1.AppErrorWithMessage('Vous devez préciser le statuts des candidats');
                }
                const sendNewsletterSmsOrMailResponse = yield this.sendNewsLetterMailOrSms(newsletterDto, false, consultantEmail);
                if ((sendNewsletterSmsOrMailResponse === null || sendNewsletterSmsOrMailResponse === void 0 ? void 0 : sendNewsletterSmsOrMailResponse.newsletterId) ||
                    (sendNewsletterSmsOrMailResponse === null || sendNewsletterSmsOrMailResponse === void 0 ? void 0 : sendNewsletterSmsOrMailResponse.listId)) {
                    yield this.getRepository().update({ id: newsletterDto.id }, {
                        newsletterSibId: sendNewsletterSmsOrMailResponse.newsletterId,
                        newsletterListSibId: sendNewsletterSmsOrMailResponse.listId,
                    });
                }
                console.log('sendNewsletterSmsOrMailResponse line 191 => ', sendNewsletterSmsOrMailResponse);
                if (!(sendNewsletterSmsOrMailResponse === null || sendNewsletterSmsOrMailResponse === void 0 ? void 0 : sendNewsletterSmsOrMailResponse.success)) {
                    throw new app_error_1.AppErrorWithMessage("Une erreur s'est produite lors de l'envoi du mail");
                }
                const getAppType = yield this.referentialService.getTypeValues({
                    appTypeCode: shared_constants_1.AppTypes.NewsletterStateCode,
                });
                yield this.getRepository().update({ id: newsletterDto.id }, {
                    sendDate: new Date(),
                    newsletterStatusId: (_d = (_c = (_b = getAppType === null || getAppType === void 0 ? void 0 : getAppType.appType) === null || _b === void 0 ? void 0 : _b.appValues) === null || _c === void 0 ? void 0 : _c.find((x) => x.code === shared_constants_1.NewsletterState.Pending)) === null || _d === void 0 ? void 0 : _d.id,
                    candidatesCount: ((_e = sendNewsletterSmsOrMailResponse.contactsList) === null || _e === void 0 ? void 0 : _e.length) ||
                        0,
                    newsletterSibId: sendNewsletterSmsOrMailResponse.newsletterId,
                    newsletterListSibId: sendNewsletterSmsOrMailResponse.listId,
                });
                response.success = true;
            }
            catch (error) {
                response.handleError(error);
            }
            return response;
        });
    }
    duplicateNewsletter(id) {
        const _super = Object.create(null, {
            createOrUpdate: { get: () => super.createOrUpdate }
        });
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new newsletter_dto_1.GetNewsletterResponse();
            try {
                let newNewsletter = new newsletter_dto_1.NewsletterDto();
                const getNewsletterToDuplicate = yield this.findOne({
                    where: { id: id },
                    relations: [
                        'newsletterStatus',
                        'newslettersJobOffer',
                        'newslettersJobOffer.jobOffer',
                        'newsLettersCandidateStatus',
                    ],
                });
                const getAppType = yield this.referentialService.getTypeValues({
                    appTypeCode: shared_constants_1.AppTypes.NewsletterStateCode,
                });
                if (!getNewsletterToDuplicate.success) {
                    throw new app_error_1.AppErrorWithMessage(getNewsletterToDuplicate.message);
                }
                const oldNewsletter = getNewsletterToDuplicate.newsletter;
                const appType = getAppType.appType;
                newNewsletter = {
                    title: oldNewsletter.title,
                    content: oldNewsletter.content,
                    subject: oldNewsletter.subject,
                    language: oldNewsletter.language,
                    cityFilter: oldNewsletter.cityFilter,
                    countriesFilter: oldNewsletter.countriesFilter,
                    newsletterStatusId: appType.appValues.find((x) => x.code === shared_constants_1.NewsletterState.Draft).id,
                    sender: oldNewsletter.sender,
                    includeCandidateApplications: oldNewsletter.includeCandidateApplications,
                };
                if ((_a = oldNewsletter.newsLettersCandidateStatus) === null || _a === void 0 ? void 0 : _a.length) {
                    newNewsletter.newsLettersCandidateStatus =
                        (_b = oldNewsletter.newsLettersCandidateStatus) === null || _b === void 0 ? void 0 : _b.map((x) => ({
                            candidateStatusId: x.candidateStatusId,
                        }));
                }
                if ((_c = oldNewsletter.newsLettersJob) === null || _c === void 0 ? void 0 : _c.length) {
                    newNewsletter.newsLettersJob =
                        (_d = oldNewsletter.newsLettersJob) === null || _d === void 0 ? void 0 : _d.map((x) => ({
                            jobTypeId: x.jobTypeId,
                        }));
                }
                if ((_e = oldNewsletter.newslettersJobOffer) === null || _e === void 0 ? void 0 : _e.length) {
                    newNewsletter.newslettersJobOffer =
                        (_f = oldNewsletter.newslettersJobOffer) === null || _f === void 0 ? void 0 : _f.map((x) => ({
                            jobofferId: x.jobofferId,
                        }));
                }
                const createNewNewsletterResponse = yield _super.createOrUpdate.call(this, newNewsletter);
                if (!createNewNewsletterResponse.success) {
                    throw new app_error_1.AppErrorWithMessage(createNewNewsletterResponse.message);
                }
                response.newsletter = createNewNewsletterResponse.newsletter;
                response.success = true;
            }
            catch (error) {
                response.handleError(error);
            }
            return response;
        });
    }
    createCandidateSubquery(alias, candidateIdSubQueries) {
        if (!(candidateIdSubQueries === null || candidateIdSubQueries === void 0 ? void 0 : candidateIdSubQueries.length)) {
            return null;
        }
        let query = ``;
        for (const candidateIdSubQuery of candidateIdSubQueries) {
            if (!!query) {
                query += ' AND ';
            }
            query += `(${alias} IN (${candidateIdSubQuery}))`;
        }
        return query;
    }
    getNewsletterCandidateApplications(request, returnCandidateApplications) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new newsletter_dto_1.GetNewsletterCandidateApplicationsResponse();
            try {
                const findOptions = base_search_requests_1.BaseSearchRequest.getDefaultFindOptions({});
                const where = {};
                const IdSubQueries = [];
                where.linkedToCandidate = false;
                where.candidateId = null;
                where.disabled = false;
                if (request.newsletterType === shared_constants_1.NewsletterType.SMS) {
                    where.phone = (0, typeorm_2.Raw)((alias) => `${alias} IS NOT NULL AND LENGTH(${alias}) > 0`);
                }
                else {
                    where.email = (0, typeorm_2.Raw)((alias) => `${alias} IS NOT NULL AND LENGTH(${alias}) > 0`);
                    where.newsletterUnsubscribed = false;
                    where.newsletterUnsubscribedGuid = (0, typeorm_2.Not)((0, typeorm_2.IsNull)());
                }
                const addressTableName = (0, typeorm_2.getManager)().getRepository(address_entity_1.Address).metadata.tableName;
                if (request.isNewsletterFrench === 'true') {
                    IdSubQueries.push(`SELECT DISTINCT(candidateApplicationId) FROM \`${addressTableName}\` WHERE country='FR'`);
                }
                else {
                    IdSubQueries.push(`SELECT DISTINCT(candidateApplicationId) FROM \`${addressTableName}\` WHERE (country IS NULL OR country<>'FR' )`);
                }
                if ((_a = request.jobIds) === null || _a === void 0 ? void 0 : _a.length) {
                    const jobIds = request.jobIds.split(',');
                    if (jobIds === null || jobIds === void 0 ? void 0 : jobIds.length) {
                        where.professionId = (0, typeorm_2.In)(jobIds);
                    }
                }
                if (IdSubQueries.length) {
                    where.id = (0, typeorm_2.Raw)((alias) => {
                        const query = this.createCandidateSubquery(alias, IdSubQueries);
                        return query;
                    });
                }
                findOptions.where = where;
                delete findOptions.take;
                delete findOptions.skip;
                if (returnCandidateApplications) {
                    findOptions.select = [
                        'id',
                        'email',
                        'phone',
                        'firstName',
                        'lastName',
                        'phoneSecondary',
                        'newsletterUnsubscribedGuid',
                    ];
                    response.candidateApplications = [];
                    const groupCount = 20000;
                    findOptions.take = groupCount;
                    let continueLoop = true;
                    let index = 0;
                    while (continueLoop) {
                        findOptions.skip = index * groupCount;
                        const candidateApplicationsFromDb = yield this.candidateApplicationService
                            .getRepository()
                            .find(findOptions);
                        if (candidateApplicationsFromDb === null || candidateApplicationsFromDb === void 0 ? void 0 : candidateApplicationsFromDb.length) {
                            response.candidateApplications =
                                response.candidateApplications.concat(candidateApplicationsFromDb.map((x) => x.toDto()));
                            continueLoop =
                                (candidateApplicationsFromDb === null || candidateApplicationsFromDb === void 0 ? void 0 : candidateApplicationsFromDb.length) >= groupCount;
                        }
                        else {
                            continueLoop = false;
                        }
                        index++;
                    }
                    if ((_b = request.candidateAdressesAlreadyLoaded) === null || _b === void 0 ? void 0 : _b.length) {
                        request.candidateAdressesAlreadyLoaded =
                            request.candidateAdressesAlreadyLoaded
                                .filter((x) => !!x)
                                .map((x) => x.trim().toLowerCase());
                        response.candidateApplications =
                            response.candidateApplications.filter((x) => !request.candidateAdressesAlreadyLoaded.some((y) => y === x.email.toLowerCase().trim()));
                        response.candidateApplications =
                            response.candidateApplications.filter((x) => shared_service_1.SharedService.isValidEmail(x.email));
                    }
                }
                else {
                    response.candidateApplicationsCount =
                        yield this.candidateApplicationService.repository.count(findOptions);
                }
                response.success = true;
            }
            catch (error) {
                response.handleError(error);
            }
            return response;
        });
    }
    getNewsletterCandidates(request, returnCandidates) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new newsletter_dto_1.GetCandidatesCountResponse();
            try {
                const findOptions = base_search_requests_1.BaseSearchRequest.getDefaultFindOptions({});
                const where = {};
                if (request.newsletterType === shared_constants_1.NewsletterType.SMS) {
                    where.phone = (0, typeorm_2.Raw)((alias) => `${alias} IS NOT NULL AND LENGTH(${alias}) > 0`);
                }
                else {
                    where.email = (0, typeorm_2.Raw)((alias) => `${alias} IS NOT NULL AND LENGTH(${alias}) > 0`);
                    where.newsletterUnsubscribed = false;
                    where.newsletterUnsubscribedGuid = (0, typeorm_2.Not)((0, typeorm_2.IsNull)());
                }
                where.disabled = false;
                if ((_a = request.statusIds) === null || _a === void 0 ? void 0 : _a.length) {
                    const statusIds = request.statusIds.split(',');
                    if (statusIds === null || statusIds === void 0 ? void 0 : statusIds.length) {
                        where.candidateStatusId = (0, typeorm_2.In)(statusIds);
                    }
                }
                const candidateIdSubQueries = [];
                const addressTableName = (0, typeorm_2.getManager)().getRepository(address_entity_1.Address).metadata.tableName;
                if ((_b = request.jobIds) === null || _b === void 0 ? void 0 : _b.length) {
                    const jobIds = request.jobIds.split(',');
                    if (jobIds === null || jobIds === void 0 ? void 0 : jobIds.length) {
                        const candidateJobsTableName = (0, typeorm_2.getManager)().getRepository(candidate_current_jobs_entity_1.CandidateCurrentJob).metadata
                            .tableName;
                        candidateIdSubQueries.push(`SELECT candidateId FROM \`${candidateJobsTableName}\` WHERE \`${candidateJobsTableName}\`.currentJobId IN("${jobIds.join('","')}") `);
                    }
                }
                if (request.cityFilter) {
                    console.log('request.cityFilter => ', typeof request.cityFilter);
                    let cityArray;
                    if (Array.isArray(request.cityFilter)) {
                        cityArray = request.cityFilter;
                    }
                    else if (typeof request.cityFilter === 'string') {
                        cityArray = request.cityFilter
                            .split(',')
                            .filter((city) => city.trim());
                    }
                    else {
                        cityArray = [];
                    }
                    if (cityArray.length > 0) {
                        const cityConditions = cityArray
                            .map((city) => `city LIKE '%${city.trim()}%'`)
                            .join(' OR ');
                        candidateIdSubQueries.push(`SELECT candidateId FROM \`${addressTableName}\` WHERE (${cityConditions})`);
                    }
                }
                if (request.countriesFilter) {
                    const countries = request.countriesFilter.split(',');
                    if (countries === null || countries === void 0 ? void 0 : countries.length) {
                        candidateIdSubQueries.push(`SELECT candidateId FROM \`${addressTableName}\` WHERE country IN ("${countries.join('","')}")`);
                    }
                }
                const subquery = this.createCandidateSubquery('id', candidateIdSubQueries);
                if (subquery) {
                    where.id = (0, typeorm_2.Raw)((alias) => subquery);
                }
                findOptions.where = where;
                delete findOptions.take;
                delete findOptions.skip;
                if (returnCandidates) {
                    findOptions.select = [
                        'id',
                        'email',
                        'phone',
                        'firstName',
                        'lastName',
                        'newsletterUnsubscribedGuid',
                        'phoneSecondary',
                    ];
                    let candidatesFromDb = yield this.candidateService
                        .getRepository()
                        .find(findOptions);
                    candidatesFromDb = candidatesFromDb.filter((x) => shared_service_1.SharedService.isValidEmail(x.email));
                    response.candidates = candidatesFromDb.map((x) => x.toDto());
                }
                else {
                    response.candidatesCount =
                        yield this.candidateService.repository.count(findOptions);
                }
                response.success = true;
            }
            catch (error) {
                response.handleError(error);
            }
            return response;
        });
    }
    previewNewsletter(newsletterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.findOne({ where: { id: newsletterId } });
            if (!response.newsletter ||
                response.newsletter.type !== shared_constants_1.NewsletterType.Email) {
                return new generic_response_1.GenericResponse(false);
            }
            return yield this.sendNewsLetterMailOrSms(response === null || response === void 0 ? void 0 : response.newsletter, true, undefined);
        });
    }
    getContactsListFromNewsletterRequest(candidates, candidateApplications) {
        let adresses = candidates.map((x) => {
            return {
                address: x.email,
                name: x.email,
                unsubscribeGuid: x.newsletterUnsubscribedGuid,
                contactFirstName: x.firstName,
                contactLastName: x.lastName,
                contactPhone: x.phone || x.phoneSecondary,
            };
        });
        if (candidateApplications === null || candidateApplications === void 0 ? void 0 : candidateApplications.length) {
            const addressMailsList = adresses.map((y) => y.address);
            const candidateApplicationsFiltered = candidateApplications.filter((x) => !addressMailsList.some((z) => z === x.email));
            const emailAddressesToAdd = candidateApplicationsFiltered.map((x) => {
                return {
                    address: x.email,
                    name: x.email,
                    contactFirstName: x.firstName,
                    contactLastName: x.lastName,
                    contactPhone: x.phone || x.phoneSecondary,
                    unsubscribeGuid: x.newsletterUnsubscribedGuid,
                };
            });
            adresses = adresses.concat(emailAddressesToAdd);
        }
        return adresses;
    }
    getDataNewsletterFromNewsletterDto(newsletterDto, loadCandidates, consultantEmail) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            let contactsList = [];
            if (loadCandidates) {
                let candidates = [];
                let jobIdsJoined = null;
                if ((_a = newsletterDto.newsLettersJob) === null || _a === void 0 ? void 0 : _a.length) {
                    jobIdsJoined = (_b = newsletterDto.newsLettersJob
                        .map((x) => x.jobTypeId)) === null || _b === void 0 ? void 0 : _b.join(',');
                }
                const statusIdsJoined = (_c = newsletterDto.newsLettersCandidateStatus
                    .map((x) => x.candidateStatusId)) === null || _c === void 0 ? void 0 : _c.join(',');
                const getCandidates = yield this.getNewsletterCandidates({
                    jobIds: jobIdsJoined,
                    statusIds: statusIdsJoined,
                    isNewsletterFrench: newsletterDto.language === shared_constants_1.NewsletterLanguage.FR
                        ? 'true'
                        : 'false',
                    newsletterType: newsletterDto.type,
                    cityFilter: newsletterDto.cityFilter,
                    countriesFilter: newsletterDto.countriesFilter,
                }, true);
                if (!getCandidates.success) {
                    throw new app_error_1.AppErrorWithMessage(getCandidates.message);
                }
                candidates = getCandidates.candidates;
                newsletterDto.candidatesCount = candidates.length;
                let candidateApplications = [];
                if (newsletterDto.includeCandidateApplications) {
                    const getCandidateApplications = yield this.getNewsletterCandidateApplications({
                        candidateAdressesAlreadyLoaded: (_d = getCandidates.candidates) === null || _d === void 0 ? void 0 : _d.map((x) => x.email),
                        isNewsletterFrench: newsletterDto.language === shared_constants_1.NewsletterLanguage.FR
                            ? 'true'
                            : 'false',
                        newsletterType: newsletterDto.type,
                        jobIds: jobIdsJoined,
                    }, true);
                    if (!getCandidateApplications.success) {
                        throw new app_error_1.AppErrorWithMessage(getCandidateApplications.message);
                    }
                    candidateApplications =
                        getCandidateApplications.candidateApplications;
                    newsletterDto.candidateApplicationsCount =
                        candidateApplications.length;
                }
                if (!(candidates === null || candidates === void 0 ? void 0 : candidates.length) && !(candidateApplications === null || candidateApplications === void 0 ? void 0 : candidateApplications.length)) {
                    throw new app_error_1.AppErrorWithMessage('Aucun destinataire ne peut recevoir cette newsletter');
                }
                contactsList = this.getContactsListFromNewsletterRequest(candidates, candidateApplications);
            }
            if (newsletterDto.type === shared_constants_1.NewsletterType.Email) {
                let mailContent = newsletterDto.content || '';
                mailContent = nextalys_js_helpers_1.MainHelpers.escapeHTML(mailContent);
                mailContent = nextalys_js_helpers_1.MainHelpers.replaceAll(mailContent, '\n', '<br/>');
                const sendNoReply = [
                    'morgan@morganmallet.agency',
                    'laurine@morganmallet.agency',
                ];
                const mailSender = consultantEmail && !sendNoReply.includes(consultantEmail)
                    ? consultantEmail
                    : 'no-reply@morganmallet.agency';
                if (!newsletterDto.language) {
                    newsletterDto.language = shared_constants_1.NewsletterLanguage.EN;
                }
                const jobOffersTitle = yield translation_service_1.TranslationService.getTranslation(newsletterDto.language, 'Newsletter.JobOffersYouMightWant');
                const jobOfferContentTitle = yield translation_service_1.TranslationService.getTranslation(newsletterDto.language, 'Global.Title');
                const newsletterFrench = newsletterDto.language === shared_constants_1.NewsletterLanguage.FR;
                const languageCode = newsletterFrench ? 'fr' : 'en';
                const jobOffersByCountry = this.groupJobOffersByCountry(newsletterDto.newslettersJobOffer.map((x) => x.joboffer), languageCode);
                const templateValues = {
                    language: languageCode,
                    mailContent: mailContent,
                    jobOffersTitle: jobOffersTitle,
                    jobOffersByCountry: jobOffersByCountry,
                    jobOfferContentTitle: jobOfferContentTitle,
                    isFrench: newsletterFrench,
                    jobOfferSeeMoreLink: newsletterFrench
                        ? 'https://www.personneldemaison.agency/offres-d-emplois'
                        : 'https://www.householdstaff.agency/jobs',
                    unsubcribeLink: environment_1.Environment.BaseURL +
                        '/' +
                        routes_1.RoutesList.UnsubscribeNewsletter +
                        '/{{contact.UNSUBSCRIBEGUID}}',
                };
                const fromObj = {
                    address: mailSender,
                    name: 'Morgan & Mallet International',
                };
                return {
                    from: fromObj,
                    replyTo: mailSender,
                    subject: newsletterDto.subject,
                    to: contactsList,
                    templateName: 'new_mail_newsletter.mjml',
                    templateValues: templateValues,
                    useHandleBars: true,
                    compileMjmlTemplate: true,
                    sendOnCreate: true,
                    newsLetterName: newsletterDto.title || null,
                    sendWithFileUrl: true,
                };
            }
            else if (newsletterDto.type === shared_constants_1.NewsletterType.SMS) {
                const fromObj = {
                    address: '',
                    name: '',
                };
                fromObj.name = 'Morgan & Mallet International';
                fromObj.address = 'no-reply@morganmallet.agency';
                return {
                    to: contactsList,
                    sendOnCreate: false,
                    newsLetterName: newsletterDto.title || null,
                    content: newsletterDto.content,
                    sender: 'Morgan & Mallet International',
                    sendWithFileUrl: true,
                };
            }
            return null;
        });
    }
    sendNewsLetterMailOrSms(newsletterDto, preview, consultantEmail) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __awaiter(this, void 0, void 0, function* () {
            const testMode = environment_1.Environment.EnvName !== 'production';
            let sendMailResponse = new newsletter_dto_1.SendNewsletterWithContactsResponse();
            if (!newsletterDto) {
                return sendMailResponse;
            }
            const newsletterData = yield this.getDataNewsletterFromNewsletterDto(newsletterDto, !preview, consultantEmail);
            console.log('newsletterData => ', newsletterData);
            console.log('newsletterData.to.length => ', newsletterData.to.length);
            if (newsletterDto.type === shared_constants_1.NewsletterType.Email) {
                if (preview) {
                    sendMailResponse = yield this.mailService.prepareMail(newsletterData);
                    return sendMailResponse;
                }
            }
            if (!testMode) {
                const sibAccountData = yield this.mailService.getSibAccountData();
                if (sibAccountData.success) {
                    const sibType = newsletterDto.type === shared_constants_1.NewsletterType.SMS
                        ? 'sms'
                        : 'subscription';
                    let credits;
                    if (sibType === 'subscription') {
                        const subscriptionCredits = ((_c = (_b = (_a = sibAccountData.data) === null || _a === void 0 ? void 0 : _a.plan) === null || _b === void 0 ? void 0 : _b.find((x) => x.type === 'subscription')) === null || _c === void 0 ? void 0 : _c.credits) || 0;
                        const payAsYouGoCredits = ((_f = (_e = (_d = sibAccountData.data) === null || _d === void 0 ? void 0 : _d.plan) === null || _e === void 0 ? void 0 : _e.find((x) => x.type === 'payAsYouGo')) === null || _f === void 0 ? void 0 : _f.credits) || 0;
                        credits = subscriptionCredits + payAsYouGoCredits;
                    }
                    else {
                        credits = (_j = (_h = (_g = sibAccountData.data) === null || _g === void 0 ? void 0 : _g.plan) === null || _h === void 0 ? void 0 : _h.find((x) => x.type === sibType)) === null || _j === void 0 ? void 0 : _j.credits;
                    }
                    if (credits != null) {
                        const delta = newsletterDto.type === shared_constants_1.NewsletterType.SMS ? 0 : 2000;
                        const coeff = newsletterDto.type === shared_constants_1.NewsletterType.SMS ? 4.5 : 1;
                        credits = credits / coeff;
                        const initialCredits = credits;
                        let smsCount = 0;
                        if (newsletterDto.type === shared_constants_1.NewsletterType.SMS) {
                            smsCount = shared_service_1.SharedService.getSMSCountFromText(newsletterDto.content);
                            credits = Math.floor(credits / smsCount);
                        }
                        if (newsletterData.to.length >= credits - delta) {
                            console.log('newsletter service line 907');
                            console.log('newsletterData.to.length => ', newsletterData.to.length);
                            console.log('credits => ', credits);
                            console.log('delta => ', delta);
                            console.log('initialCredits => ', initialCredits);
                            console.log('newsletter service line end of line 907');
                            throw new app_error_1.AppErrorWithMessage('Crédits ' +
                                (newsletterDto.type === shared_constants_1.NewsletterType.SMS
                                    ? 'SMS'
                                    : 'e-mails') +
                                ' insuffisant - crédits restants : ' +
                                (newsletterDto.type === shared_constants_1.NewsletterType.SMS
                                    ? initialCredits +
                                        '/' +
                                        smsCount +
                                        '=' +
                                        credits
                                    : credits));
                        }
                    }
                }
            }
            if (testMode) {
                sendMailResponse = yield this.mailService.sendMail(newsletterData);
                if (sendMailResponse.success) {
                    sendMailResponse.newsletterId =
                        'test_newsletter_local_' + nextalys_js_helpers_1.MainHelpers.generateGuid();
                    sendMailResponse.listId =
                        'test_newsletter_local_' + nextalys_js_helpers_1.MainHelpers.generateGuid();
                }
            }
            else {
                if (newsletterDto.type === shared_constants_1.NewsletterType.Email) {
                    sendMailResponse = yield this.mailService.createNewsletterList(newsletterData);
                }
                else if (newsletterDto.type === shared_constants_1.NewsletterType.SMS) {
                    sendMailResponse = yield this.smsService.createNewsletterList(newsletterData);
                }
            }
            newsletterDto.newsletterSibId = sendMailResponse.newsletterId;
            newsletterDto.newsletterListSibId = sendMailResponse.listId;
            sendMailResponse.contactsList = newsletterData.to;
            return sendMailResponse;
        });
    }
    groupJobOffersByCountry(jobOffers, language) {
        if (!(jobOffers === null || jobOffers === void 0 ? void 0 : jobOffers.length)) {
            return [];
        }
        const otherLabel = language === 'fr' ? 'Autres' : 'Other';
        const countryMap = new Map();
        for (const job of jobOffers) {
            const countryName = job.country
                ? (0, country_names_helper_1.normalizeCountryName)(job.country, language)
                : otherLabel;
            if (!countryMap.has(countryName)) {
                countryMap.set(countryName, []);
            }
            countryMap.get(countryName).push(job);
        }
        const sortedCountries = Array.from(countryMap.entries())
            .map(([countryName, jobs]) => ({
            countryName,
            jobs: jobs.sort((a, b) => (a.title || '').localeCompare(b.title || '')),
        }))
            .sort((a, b) => {
            if (a.countryName === otherLabel)
                return 1;
            if (b.countryName === otherLabel)
                return -1;
            return a.countryName.localeCompare(b.countryName);
        });
        const pairs = [];
        for (let i = 0; i < sortedCountries.length; i += 2) {
            pairs.push({
                left: sortedCountries[i],
                right: sortedCountries[i + 1] || null,
            });
        }
        return pairs;
    }
    createOrUpdate(newsletterDto, consultantEmail) {
        const _super = Object.create(null, {
            createOrUpdate: { get: () => super.createOrUpdate }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (!newsletterDto.id) {
                const getNewsletterStatusResponse = yield this.referentialService.getTypeValues({
                    appTypeCode: shared_constants_1.AppTypes.NewsletterStateCode,
                });
                newsletterDto.newsletterStatusId =
                    getNewsletterStatusResponse.appType.appValues.find((x) => x.code === shared_constants_1.NewsletterState.Draft).id;
            }
            return yield _super.createOrUpdate.call(this, newsletterDto);
        });
    }
    unsubscribeFromNewsletter(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                const getCandidateResponse = yield this.candidateService.findOne({
                    where: { newsletterUnsubscribedGuid: request.guid },
                    select: ['id'],
                });
                if (getCandidateResponse === null || getCandidateResponse === void 0 ? void 0 : getCandidateResponse.candidate) {
                    yield this.candidateService
                        .getRepository()
                        .update({ id: getCandidateResponse.candidate.id }, { newsletterUnsubscribed: true });
                }
                else {
                    const getCandidateApplicationResponse = yield this.candidateApplicationService.findOne({
                        where: { newsletterUnsubscribedGuid: request.guid },
                        select: ['id'],
                    });
                    if (getCandidateApplicationResponse.candidateApplication) {
                        yield this.candidateApplicationService
                            .getRepository()
                            .update({
                            id: getCandidateApplicationResponse
                                .candidateApplication.id,
                        }, { newsletterUnsubscribed: true });
                    }
                    else {
                        throw new app_error_1.AppErrorWithMessage('Lien invalide');
                    }
                }
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    refreshNewsletterLoop() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse(true);
            try {
                if (environment_1.Environment.EnvName !== 'production') {
                    return response;
                }
                const getAppType = yield this.referentialService.getTypeValues({
                    appTypeCode: shared_constants_1.AppTypes.NewsletterStateCode,
                });
                const pendingStatus = (_c = (_b = (_a = getAppType === null || getAppType === void 0 ? void 0 : getAppType.appType) === null || _a === void 0 ? void 0 : _a.appValues) === null || _b === void 0 ? void 0 : _b.find((x) => x.code === shared_constants_1.NewsletterState.Pending)) === null || _c === void 0 ? void 0 : _c.id;
                const sentStatus = (_f = (_e = (_d = getAppType === null || getAppType === void 0 ? void 0 : getAppType.appType) === null || _d === void 0 ? void 0 : _d.appValues) === null || _e === void 0 ? void 0 : _e.find((x) => x.code === shared_constants_1.NewsletterState.Sent)) === null || _f === void 0 ? void 0 : _f.id;
                const sentSibStatus = (_j = (_h = (_g = getAppType === null || getAppType === void 0 ? void 0 : getAppType.appType) === null || _g === void 0 ? void 0 : _g.appValues) === null || _h === void 0 ? void 0 : _h.find((x) => x.code === shared_constants_1.NewsletterState.Sent_SendInBlue)) === null || _j === void 0 ? void 0 : _j.id;
                if (!sentStatus || !sentSibStatus || !pendingStatus) {
                    return;
                }
                const statusIds = [pendingStatus, sentStatus];
                const newsletterResponse = yield this.findAll({
                    where: {
                        newsletterStatusId: (0, typeorm_2.In)(statusIds),
                        disabled: false,
                        newsletterListSibId: (0, typeorm_2.Not)((0, typeorm_2.IsNull)()),
                    },
                    select: ['id'],
                });
                if ((_k = newsletterResponse.newsletters) === null || _k === void 0 ? void 0 : _k.length) {
                    logger_service_1.AppLogger.log('refresh newsletter loop  - ' +
                        newsletterResponse.newsletters.length +
                        ' to treat');
                    for (const newsletterIdWrapper of newsletterResponse.newsletters) {
                        const newsletterEntity = yield this.getRepository().findOne({
                            where: { id: newsletterIdWrapper.id },
                            relations: this.modelOptions.getOneRelations,
                        });
                        const newsletter = newsletterEntity.toDto();
                        if (newsletter.newsletterStatusId === sentStatus) {
                            if (!newsletter.newsletterSibId) {
                                logger_service_1.AppLogger.log('ignoring update newsletter : no newsletterSibId');
                                continue;
                            }
                            logger_service_1.AppLogger.log('refresh newsletter loop  - getting stat from sib');
                            yield this.syncSibNewsletter(newsletter, sentSibStatus);
                            continue;
                        }
                        if (newsletter.newsletterStatusId === pendingStatus) {
                            if (!newsletter.newsletterListSibId) {
                                logger_service_1.AppLogger.log('ignoring send newsletter : no newsletterListSibId');
                                continue;
                            }
                            if (!!newsletter.newsletterSibId) {
                                logger_service_1.AppLogger.error('unable to send newsletter => sib id already set');
                                continue;
                            }
                            const now = nextalys_js_helpers_1.DateHelpers.convertUTCDateToLocalDate(new Date());
                            const diffMinutes = nextalys_js_helpers_1.DateHelpers.diffMinutes(now, newsletter.modifDate);
                            if (diffMinutes >= 10) {
                                let sendNewsletterResponse;
                                let testMode = true;
                                if (environment_1.Environment.EnvName === 'production') {
                                    testMode = false;
                                }
                                const newsletterData = yield this.getDataNewsletterFromNewsletterDto(newsletter, false);
                                if (!newsletterData) {
                                    logger_service_1.AppLogger.error('unable to send newsletter => no newsletterData');
                                    continue;
                                }
                                if (testMode) {
                                    sendNewsletterResponse = new generic_response_1.GenericResponse(true);
                                }
                                else {
                                    if (newsletter.type === shared_constants_1.NewsletterType.Email) {
                                        sendNewsletterResponse =
                                            yield this.mailService.sendNewsletterWithListId(newsletterData, newsletter.newsletterListSibId);
                                    }
                                    else if (newsletter.type === shared_constants_1.NewsletterType.SMS) {
                                        sendNewsletterResponse =
                                            yield this.smsService.sendNewsletterWithListId(newsletterData, newsletter.newsletterListSibId);
                                    }
                                }
                                if (!sendNewsletterResponse) {
                                    logger_service_1.AppLogger.error('unable to send newsletter => no sendNewsletterResponse');
                                    continue;
                                }
                                const newsletterPartial = {};
                                newsletterPartial.newsletterSibId =
                                    sendNewsletterResponse.newsletterId;
                                let mustUpdate = false;
                                if (newsletterPartial.newsletterSibId) {
                                    newsletterPartial.sendDate = new Date();
                                    newsletterPartial.newsletterStatusId =
                                        sentStatus;
                                    newsletterPartial.htmlFullContent = newsletterData.htmlBody;
                                    mustUpdate = true;
                                    logger_service_1.AppLogger.log('refresh newsletter loop  - ' +
                                        newsletter.id +
                                        ' sent to SIB');
                                }
                                else {
                                    logger_service_1.AppLogger.error('unable to send newsletter => ', sendNewsletterResponse.error);
                                }
                                if (mustUpdate) {
                                    yield this.getRepository().update({ id: newsletter.id }, newsletterPartial);
                                }
                            }
                        }
                    }
                }
                response.success = true;
            }
            catch (error) {
                response.handleError(error);
            }
            return response;
        });
    }
    syncSibNewsletter(newsletter, sentSibStatusId) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                if (environment_1.Environment.EnvName !== 'production') {
                    return response;
                }
                if (!newsletter.newsletterSibId) {
                    throw new Error('syncSibNewsletter : no newsletterSibId !');
                }
                let sibResponse;
                if (newsletter.type === shared_constants_1.NewsletterType.SMS) {
                    sibResponse = yield this.smsService.getNewsletter(newsletter.newsletterSibId);
                }
                else if (newsletter.type === shared_constants_1.NewsletterType.Email) {
                    sibResponse = yield this.mailService.getNewsletter(newsletter.newsletterSibId);
                }
                if (sibResponse.success && (sibResponse === null || sibResponse === void 0 ? void 0 : sibResponse.data.statistics)) {
                    const status = sibResponse.data.status;
                    if (status === 'sent') {
                        let sentCount = 0;
                        let deliveredCount = 0;
                        let answeredCount = 0;
                        let unsubscriptionsCount = 0;
                        let openedCount = 0;
                        let clickedCount = 0;
                        if (newsletter.type === shared_constants_1.NewsletterType.SMS) {
                            const sibResponseTyped = sibResponse.data;
                            sentCount = ((_a = sibResponseTyped.statistics) === null || _a === void 0 ? void 0 : _a.sent) || 0;
                            answeredCount =
                                ((_b = sibResponseTyped.statistics) === null || _b === void 0 ? void 0 : _b.answered) || 0;
                            unsubscriptionsCount =
                                ((_c = sibResponseTyped.statistics) === null || _c === void 0 ? void 0 : _c.unsubscriptions) || 0;
                            deliveredCount =
                                ((_d = sibResponseTyped.statistics) === null || _d === void 0 ? void 0 : _d.delivered) || 0;
                        }
                        else if (newsletter.type === shared_constants_1.NewsletterType.Email) {
                            const sibResponseTyped = sibResponse.data;
                            sentCount =
                                ((_f = (_e = sibResponseTyped.statistics) === null || _e === void 0 ? void 0 : _e.globalStats) === null || _f === void 0 ? void 0 : _f.sent) || 0;
                            unsubscriptionsCount =
                                ((_h = (_g = sibResponseTyped.statistics) === null || _g === void 0 ? void 0 : _g.globalStats) === null || _h === void 0 ? void 0 : _h.unsubscriptions) || 0;
                            deliveredCount =
                                ((_k = (_j = sibResponseTyped.statistics) === null || _j === void 0 ? void 0 : _j.globalStats) === null || _k === void 0 ? void 0 : _k.delivered) || 0;
                            openedCount =
                                ((_m = (_l = sibResponseTyped.statistics) === null || _l === void 0 ? void 0 : _l.globalStats) === null || _m === void 0 ? void 0 : _m.viewed) ||
                                    0;
                            clickedCount =
                                ((_p = (_o = sibResponseTyped.statistics) === null || _o === void 0 ? void 0 : _o.globalStats) === null || _p === void 0 ? void 0 : _p.clickers) || 0;
                        }
                        yield this.getRepository().update({ id: newsletter.id }, {
                            newsletterStatusId: sentSibStatusId,
                            sentCount: sentCount,
                            answeredCount: answeredCount,
                            unsubscriptionsCount: unsubscriptionsCount,
                            deliveredCount: deliveredCount,
                            openedCount: openedCount,
                            clickedCount: clickedCount,
                        });
                        logger_service_1.AppLogger.log('syncSibNewsletter  - Success');
                    }
                    response.success = true;
                }
            }
            catch (error) {
                response.handleError(error);
            }
            return response;
        });
    }
    cleanNewsletterRecipients() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                const candidatesFilter = {};
                const updateData = true;
                const candidatesCleaned = [];
                const candidatesApplicationsCleaned = [];
                candidatesFilter.newsletterUnsubscribed = false;
                candidatesFilter.email = (0, typeorm_2.Not)((0, typeorm_2.IsNull)());
                const candidates = yield this.candidateService
                    .getRepository()
                    .find({ select: ['id', 'email'], where: candidatesFilter });
                for (const candidate of candidates) {
                    if (!shared_service_1.SharedService.emailCanBeSent(candidate.email)) {
                        if (updateData) {
                            yield this.candidateService
                                .getRepository()
                                .update({ id: candidate.id }, { newsletterUnsubscribed: true });
                        }
                        candidatesCleaned.push(candidate.email);
                    }
                }
                const candidatesApplicationFilter = {};
                candidatesApplicationFilter.newsletterUnsubscribed = false;
                candidatesApplicationFilter.email = (0, typeorm_2.Not)((0, typeorm_2.IsNull)());
                const candidateApplications = yield this.candidateApplicationService
                    .getRepository()
                    .find({
                    select: ['id', 'email'],
                    where: candidatesApplicationFilter,
                });
                for (const candidateApplication of candidateApplications) {
                    if (!shared_service_1.SharedService.emailCanBeSent(candidateApplication.email)) {
                        if (updateData) {
                            yield this.candidateApplicationService
                                .getRepository()
                                .update({ id: candidateApplication.id }, { newsletterUnsubscribed: true });
                        }
                        candidatesApplicationsCleaned.push(candidateApplication.email);
                    }
                }
                response.message =
                    'Candidates cleaned : ' +
                        candidatesCleaned.length +
                        ' - CandidateApplications cleaned : ' +
                        candidatesApplicationsCleaned.length;
                response.success = true;
            }
            catch (error) {
                response.handleError(error);
            }
            return response;
        });
    }
};
NewsletterService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(newsletter_entity_1.Newsletter)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        referential_service_1.ReferentialService,
        candidates_service_1.CandidateService,
        candidate_applications_service_1.CandidateApplicationService,
        mail_service_1.MailService,
        sms_service_1.SmsService])
], NewsletterService);
exports.NewsletterService = NewsletterService;
//# sourceMappingURL=newsletter.service.js.map