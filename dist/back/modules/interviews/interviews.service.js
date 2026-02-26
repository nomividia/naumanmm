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
var InterviewsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ical_generator_1 = require("ical-generator");
const nextalys_js_helpers_1 = require("nextalys-js-helpers");
const nextalys_node_helpers_1 = require("nextalys-node-helpers");
const typeorm_2 = require("typeorm");
const candidates_helpers_1 = require("../../../shared/candidates-helpers");
const interview_helpers_1 = require("../../../shared/interview-helpers");
const shared_constants_1 = require("../../../shared/shared-constants");
const user_entity_1 = require("../../entities/user.entity");
const environment_1 = require("../../environment/environment");
const app_error_1 = require("../../models/app-error");
const base_search_requests_1 = require("../../models/requests/base-search-requests");
const generic_response_1 = require("../../models/responses/generic-response");
const base_model_service_1 = require("../../services/base-model.service");
const referential_service_1 = require("../../services/referential.service");
const logger_service_1 = require("../../services/tools/logger.service");
const mail_service_1 = require("../../services/tools/mail.service");
const translation_service_1 = require("../../services/translation.service");
const candidates_service_1 = require("../candidates/candidates.service");
const consultant_google_links_constants_1 = require("./consultant-google-links.constants");
const interview_dto_1 = require("./interview-dto");
const interview_entity_1 = require("./interview.entity");
const review_request_email_templates_1 = require("./review-request-email-templates");
let InterviewsService = InterviewsService_1 = class InterviewsService extends base_model_service_1.ApplicationBaseModelService {
    constructor(repository, mailService, referentialService, candidateService) {
        super();
        this.repository = repository;
        this.mailService = mailService;
        this.referentialService = referentialService;
        this.candidateService = candidateService;
        this.modelOptions = {
            getManyResponse: interview_dto_1.GetInterviewsResponse,
            getOneResponse: interview_dto_1.GetInterviewResponse,
            getManyResponseField: 'interviews',
            getOneResponseField: 'interview',
            getManyRelations: ['candidate', 'consultant', 'consultant.image'],
            getOneRelations: ['candidate', 'consultant'],
            repository: this.repository,
            entity: interview_entity_1.Interview,
            archiveField: 'disabled',
            archiveFieldValue: true,
        };
    }
    sendInterviewMailToCandidate(id, consultantEmail) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                const interviewResponse = yield this.findOne({
                    where: { id: id },
                    relations: ['candidate'],
                });
                const interviewDto = interviewResponse.interview;
                if (!interviewDto) {
                    throw new app_error_1.AppErrorWithMessage('cannot send mail : Unable to find interview ! ');
                }
                const mailSender = yield candidates_helpers_1.SharedCandidatesHelpers.getMailSenderFromCandidate(null, null, null, consultantEmail);
                if (!interviewDto.guid) {
                    interviewDto.guid = nextalys_js_helpers_1.MainHelpers.generateGuid();
                    yield this.getRepository().update({ id: interviewDto.id }, { guid: interviewDto.guid });
                }
                const getCandidateResponse = yield this.candidateService.findOne({
                    where: { id: interviewDto.candidateId },
                    relations: ['candidateLanguages', 'addresses'],
                });
                if (!getCandidateResponse.success ||
                    !getCandidateResponse.candidate) {
                    throw new app_error_1.AppErrorWithMessage('Error');
                }
                const candidateLanguage = yield candidates_helpers_1.SharedCandidatesHelpers.getLanguageFromCandidate(getCandidateResponse.candidate, this.referentialService);
                const candidateLanguageCode = (candidateLanguage === null || candidateLanguage === void 0 ? void 0 : candidateLanguage.code) || shared_constants_1.defaultAppLanguage;
                const interviewLocationAddress = interview_helpers_1.InterviewHelpers.getInterviewPlaceAddress(interviewDto.agencyPlace, candidateLanguageCode);
                const calendar = (0, ical_generator_1.default)({
                    name: 'Calendrier ' + (((_a = interviewDto.candidate) === null || _a === void 0 ? void 0 : _a.firstName) || ''),
                });
                const icsData = {
                    start: nextalys_js_helpers_1.DateHelpers.formatDateISO8601(interviewDto.date, true),
                    end: nextalys_js_helpers_1.DateHelpers.formatDateISO8601(nextalys_js_helpers_1.DateHelpers.addHoursToDate(interviewDto.date, 1), true),
                    description: 'Entretien MMI',
                    summary: 'Entretien MMI',
                    timezone: 'Europe/Paris',
                };
                if (interviewLocationAddress) {
                    icsData.location = interviewLocationAddress;
                }
                calendar.createEvent(icsData);
                const icalBase64 = nextalys_node_helpers_1.NodeHelpers.base64Encode(calendar.toString());
                const mailData = {
                    from: { address: mailSender },
                    subject: yield translation_service_1.TranslationService.getTranslation(candidateLanguageCode, 'Interview.InterviewMailSubject'),
                    to: [{ address: interviewDto.candidate.email }],
                    templateName: 'mail_interview.mjml',
                    attachments: [
                        {
                            name: 'votre-rendez-vous.ics',
                            base64Content: icalBase64,
                        },
                    ],
                    templateValues: {
                        interviewDate: nextalys_js_helpers_1.DateHelpers.formatDate(interviewDto.date),
                        interviewTime: nextalys_js_helpers_1.DateHelpers.formatTime(interviewDto.date),
                        comment: interviewDto.comment,
                        guid: interviewDto.guid,
                        isFrench: true,
                        interviewLocationName: interview_helpers_1.InterviewHelpers.getInterviewPlaceName(interviewDto.agencyPlace),
                        interviewLocationCode: interviewDto.agencyPlace,
                        interviewLocationAddress: nextalys_js_helpers_1.MainHelpers.replaceAll(interviewLocationAddress, '\n', '<br/>'),
                        title: interviewDto.title,
                        language: candidateLanguageCode,
                    },
                    useHandleBars: true,
                    compileMjmlTemplate: true,
                };
                const sendMailResponse = yield this.mailService.sendMail(mailData);
                if (!sendMailResponse.success) {
                    const errorContext = {
                        interviewId: id,
                        candidateId: interviewDto.candidateId,
                        candidateEmail: (_b = interviewDto.candidate) === null || _b === void 0 ? void 0 : _b.email,
                        mailError: sendMailResponse.message,
                    };
                    console.error('Failed to send interview mail to candidate:', errorContext);
                    throw new app_error_1.AppErrorWithMessage(`Une erreur s'est produite lors de l'envoi du mail: ${sendMailResponse.message || 'Erreur inconnue'}`);
                }
                response.success = true;
            }
            catch (error) {
                response.handleError(error);
            }
            return response;
        });
    }
    findAllInterviewsConsultant(request, authToolsService) {
        const _super = Object.create(null, {
            findAll: { get: () => super.findAll }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const getInterviewsResponse = new interview_dto_1.GetInterviewsResponse();
            try {
                const findOptions = base_search_requests_1.BaseSearchRequest.getDefaultFindOptions(request);
                const currentPayload = authToolsService.getCurrentPayload(false);
                const currentConsultantId = currentPayload.id;
                const userRoles = currentPayload.roles || [];
                const isAdminOrRH = userRoles.includes(shared_constants_1.RolesList.Admin) ||
                    userRoles.includes(shared_constants_1.RolesList.RH);
                if (!isAdminOrRH) {
                    findOptions.where = [
                        {
                            consultantId: currentConsultantId,
                        },
                    ];
                }
                const doSearch = this.setInterviewsConsultantFilters(request, findOptions);
                if (!request.order && !request.orderby) {
                    findOptions.order = { date: 'DESC' };
                }
                if (doSearch) {
                    const getConsultantInterviews = yield _super.findAll.call(this, findOptions);
                    if (!getConsultantInterviews) {
                        throw new app_error_1.AppErrorWithMessage('Error');
                    }
                    getInterviewsResponse.interviews =
                        getConsultantInterviews.interviews;
                    getInterviewsResponse.filteredResults =
                        getConsultantInterviews.filteredResults;
                }
                else {
                    getInterviewsResponse.interviews = [];
                }
                getInterviewsResponse.success = true;
            }
            catch (error) {
                getInterviewsResponse.handleError(error);
            }
            return getInterviewsResponse;
        });
    }
    setInterviewsConsultantFilters(request, findOptions) {
        if (!findOptions.where) {
            findOptions.where = [{}];
        }
        const where = findOptions.where;
        if (request.interviewFilterYear) {
            for (const item of where) {
                item.date = (0, typeorm_2.Raw)((alias) => `YEAR(${alias}) = ${request.interviewFilterYear}`);
            }
        }
        if (request.interviewFilterMonth) {
            for (const item of where) {
                item.date = (0, typeorm_2.Raw)((alias) => `MONTH(${alias}) = ${request.interviewFilterMonth}`);
            }
        }
        if (request.interviewCurrentDate) {
            const currentDate = new Date();
            const formatDate = nextalys_js_helpers_1.DateHelpers.formatDateISO8601(currentDate, true);
            for (const item of where) {
                if (request.interviewCurrentDate === 'past') {
                    item.date = (0, typeorm_2.LessThan)(formatDate);
                }
                if (request.interviewCurrentDate === 'coming') {
                    item.date = (0, typeorm_2.MoreThan)(formatDate);
                }
            }
        }
        if (request.interviewPlace) {
            for (const item of where) {
                item.agencyPlace = request.interviewPlace;
            }
        }
        if (request.interviewConfirmationStatus) {
            for (const item of where) {
                item.candidateResponse = request.interviewConfirmationStatus;
            }
        }
        if (request.noShow !== undefined && request.noShow !== null) {
            for (const item of where) {
                item.noShow = request.noShow;
            }
        }
        return true;
    }
    updateInterviewedCandidatesStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                const twentyFourHoursAgo = new Date();
                twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
                const candidates = yield this.candidateService.repository
                    .createQueryBuilder('candidate')
                    .innerJoin('candidate.interviews', 'interview')
                    .innerJoin('candidate.candidateStatus', 'candidateStatus')
                    .where('candidateStatus.code = :status', {
                    status: shared_constants_1.CandidateStatus.BeingReferenced,
                })
                    .andWhere('interview.date < :date', {
                    date: twentyFourHoursAgo,
                })
                    .andWhere('interview.noShow = :noShow', {
                    noShow: false,
                })
                    .getMany();
                const candidateStatusId = yield this.referentialService.getAppValues({
                    where: {
                        code: shared_constants_1.CandidateStatus.Referenced,
                    },
                });
                for (const candidate of candidates) {
                    yield this.updateCandidateStatusAndSendEmail(candidate.id, candidateStatusId.appValues[0].id, undefined);
                }
                response.success = true;
            }
            catch (error) {
                response.handleError(error);
            }
            return response;
        });
    }
    sendReviewRequestEmail(candidateId, consultantId, consultantEmail) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidateResponse = yield this.candidateService.findOne({
                    where: { id: candidateId },
                    relations: ['candidateLanguages', 'addresses'],
                });
                if (!candidateResponse.success || !candidateResponse.candidate) {
                    console.warn(`Could not find candidate ${candidateId} for review request email`);
                    return;
                }
                const candidate = candidateResponse.candidate;
                const interviewResponse = yield this.findOne({
                    where: { candidateId: candidateId },
                    relations: ['consultant'],
                });
                if (!interviewResponse.success ||
                    !((_a = interviewResponse.interview) === null || _a === void 0 ? void 0 : _a.consultant)) {
                    console.warn(`Could not find consultant for candidate ${candidateId}`);
                    return;
                }
                const consultant = interviewResponse.interview.consultant;
                let googleReviewUrl = consultant_google_links_constants_1.ConsultantGoogleLinkHelper.getGoogleReviewUrlByConsultant(consultant.id);
                if (!googleReviewUrl) {
                    if (candidate.addresses && candidate.addresses.length > 0) {
                        for (const address of candidate.addresses) {
                            if (address.country &&
                                address.country.toLowerCase().includes('swiss')) {
                                googleReviewUrl =
                                    consultant_google_links_constants_1.ConsultantGoogleLinkHelper.getGoogleReviewUrlByLocation('swiss');
                                break;
                            }
                        }
                    }
                }
                if (!googleReviewUrl) {
                    googleReviewUrl = 'https://g.page/r/CXVw4LTxczwEEBM/review';
                }
                const candidateLanguage = yield candidates_helpers_1.SharedCandidatesHelpers.getLanguageFromCandidate(candidate, this.referentialService);
                const candidateLanguageCode = (candidateLanguage === null || candidateLanguage === void 0 ? void 0 : candidateLanguage.code) || shared_constants_1.defaultAppLanguage;
                const emailContent = candidateLanguageCode === 'fr'
                    ? review_request_email_templates_1.ReviewRequestEmailTemplates.getFrenchTemplate(candidate.firstName, googleReviewUrl)
                    : review_request_email_templates_1.ReviewRequestEmailTemplates.getEnglishTemplate(candidate.firstName, googleReviewUrl);
                const mailSender = yield candidates_helpers_1.SharedCandidatesHelpers.getMailSenderFromCandidate(null, null, null, consultantEmail);
                const mailData = {
                    from: { address: mailSender },
                    subject: emailContent.subject,
                    to: [{ address: candidate.email }],
                    templateName: 'mail_review_request.mjml',
                    templateValues: {
                        candidateFirstName: candidate.firstName,
                        googleReviewUrl: googleReviewUrl,
                        language: candidateLanguageCode,
                        isFrench: candidateLanguageCode === 'fr',
                    },
                    useHandleBars: true,
                    compileMjmlTemplate: true,
                };
                const sendMailResponse = yield this.mailService.sendMail(mailData);
                if (!sendMailResponse.success) {
                    console.error(`Failed to send review request email to candidate ${candidateId}:`, sendMailResponse.message);
                }
            }
            catch (error) {
                console.error(`Error sending review request email to candidate ${candidateId}:`, error);
            }
        });
    }
    updateCandidateStatusAndSendEmail(candidateId, newStatusId, consultantEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.candidateService.repository.update({ id: candidateId }, { candidateStatusId: newStatusId });
                yield this.sendReviewRequestEmail(candidateId, null, consultantEmail);
            }
            catch (error) {
                console.error(`Error updating candidate status and sending email for ${candidateId}:`, error);
                throw error;
            }
        });
    }
    sendPlacedCandidateReviewEmail(candidateId, consultantEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                const candidateResponse = yield this.candidateService.findOne({
                    where: { id: candidateId },
                    relations: ['candidateLanguages', 'addresses'],
                });
                if (!candidateResponse.success || !candidateResponse.candidate) {
                    throw new app_error_1.AppErrorWithMessage(`Could not find candidate ${candidateId} for review request email`);
                }
                const candidate = candidateResponse.candidate;
                let consultantId = candidate.consultantId;
                let googleReviewUrl = null;
                if (consultantId) {
                    googleReviewUrl =
                        consultant_google_links_constants_1.ConsultantGoogleLinkHelper.getGoogleReviewUrlByConsultant(consultantId);
                }
                if (!googleReviewUrl &&
                    candidate.addresses &&
                    candidate.addresses.length > 0) {
                    for (const address of candidate.addresses) {
                        if (address.country &&
                            address.country.toLowerCase().includes('swiss')) {
                            googleReviewUrl =
                                consultant_google_links_constants_1.ConsultantGoogleLinkHelper.getGoogleReviewUrlByLocation('swiss');
                            break;
                        }
                    }
                }
                if (!googleReviewUrl) {
                    googleReviewUrl = 'https://g.page/r/CXVw4LTxczwEEBM/review';
                }
                const candidateLanguage = yield candidates_helpers_1.SharedCandidatesHelpers.getLanguageFromCandidate(candidate, this.referentialService);
                const candidateLanguageCode = (candidateLanguage === null || candidateLanguage === void 0 ? void 0 : candidateLanguage.code) || shared_constants_1.defaultAppLanguage;
                const mailSender = yield candidates_helpers_1.SharedCandidatesHelpers.getMailSenderFromCandidate(null, null, null, consultantEmail);
                const mailData = {
                    from: { address: mailSender },
                    subject: candidateLanguageCode === 'fr'
                        ? 'Votre avis compte pour nous !'
                        : 'Your opinion matters to us!',
                    to: [{ address: candidate.email }],
                    templateName: 'mail_placed_candidate_review.mjml',
                    templateValues: {
                        candidateFirstName: candidate.firstName,
                        googleReviewUrl: googleReviewUrl,
                        language: candidateLanguageCode,
                        isFrench: candidateLanguageCode === 'fr',
                    },
                    useHandleBars: true,
                    compileMjmlTemplate: true,
                };
                const sendMailResponse = yield this.mailService.sendMail(mailData);
                if (!sendMailResponse.success) {
                    throw new app_error_1.AppErrorWithMessage(`Failed to send review request email to candidate ${candidateId}: ${sendMailResponse.message}`);
                }
                response.success = true;
                response.message = 'Review request email sent successfully';
            }
            catch (error) {
                response.handleError(error);
            }
            return response;
        });
    }
    sendDailyInterviewReportWorld() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sendDailyInterviewReport('world');
        });
    }
    sendDailyInterviewReportUS() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sendDailyInterviewReport('us');
        });
    }
    sendDailyInterviewReport(region) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                const timezone = region === 'us' ? 'America/Los_Angeles' : 'Europe/Paris';
                const now = new Date();
                const yesterdayStart = this.getYesterdayStartInTimezone(timezone);
                const yesterdayEnd = this.getYesterdayEndInTimezone(timezone);
                const yesterdayDayOfWeek = this.getDayOfWeekInTimezone(yesterdayStart, timezone);
                if (yesterdayDayOfWeek === 0 || yesterdayDayOfWeek === 6) {
                    yield logger_service_1.AppLogger.log(`Skipping daily interview report for ${region} - yesterday was a weekend`);
                    response.success = true;
                    response.message = 'Skipped - weekend';
                    return response;
                }
                const userRepository = (0, typeorm_2.getRepository)(user_entity_1.User);
                const allConsultants = yield userRepository
                    .createQueryBuilder('user')
                    .innerJoin('user.roles', 'role')
                    .where('role.role = :roleCode', {
                    roleCode: shared_constants_1.RolesList.Consultant,
                })
                    .andWhere('user.disabled = :disabled', { disabled: false })
                    .getMany();
                const consultants = allConsultants.filter((consultant) => {
                    if (InterviewsService_1.EXCLUDED_EMAILS.includes(consultant.mail)) {
                        return false;
                    }
                    const isUSConsultant = InterviewsService_1.US_CONSULTANT_USERNAMES.includes(consultant.userName);
                    return region === 'us' ? isUSConsultant : !isUSConsultant;
                });
                if (consultants.length === 0) {
                    yield logger_service_1.AppLogger.log(`No consultants found for region ${region}`);
                    response.success = true;
                    response.message = 'No consultants to report';
                    return response;
                }
                const interviews = yield this.repository.find({
                    where: {
                        date: (0, typeorm_2.Between)(yesterdayStart, yesterdayEnd),
                        consultantId: (0, typeorm_2.In)(consultants.map((c) => c.id)),
                    },
                    relations: ['consultant'],
                });
                const interviewCountByConsultant = new Map();
                for (const interview of interviews) {
                    const count = interviewCountByConsultant.get(interview.consultantId) || 0;
                    interviewCountByConsultant.set(interview.consultantId, count + 1);
                }
                const consultantReports = consultants
                    .map((consultant) => {
                    const interviewCount = interviewCountByConsultant.get(consultant.id) || 0;
                    const name = `${consultant.firstName || ''} ${consultant.lastName || ''}`.trim() || consultant.userName;
                    return {
                        name,
                        interviewCount,
                        metGoal: interviewCount >=
                            InterviewsService_1.DAILY_INTERVIEW_GOAL,
                    };
                })
                    .sort((a, b) => b.interviewCount - a.interviewCount);
                const successCount = consultantReports.filter((c) => c.metGoal).length;
                const noInterviewConsultants = consultantReports
                    .filter((c) => c.interviewCount === 0)
                    .map((c) => c.name);
                const reportDate = this.formatDateForReport(yesterdayStart);
                const mailData = {
                    from: {
                        address: environment_1.Environment.MailSender || 'noreply@morganmallet.agency',
                    },
                    subject: `Rapport quotidien des entretiens - Equipe ${region === 'us' ? 'US' : 'Monde'} - ${reportDate}`,
                    to: [{ address: InterviewsService_1.REPORT_RECIPIENT_EMAIL }],
                    templateName: 'mail_daily_interview_report.mjml',
                    templateValues: {
                        reportDate,
                        regionName: region === 'us' ? 'US' : 'Monde (hors US)',
                        goal: InterviewsService_1.DAILY_INTERVIEW_GOAL,
                        consultants: consultantReports,
                        successCount,
                        totalConsultants: consultants.length,
                        noInterviewConsultants,
                        SITE_BASE_URL: environment_1.Environment.BaseURL,
                    },
                    useHandleBars: true,
                    compileMjmlTemplate: true,
                };
                const sendMailResponse = yield this.mailService.sendMail(mailData);
                if (!sendMailResponse.success) {
                    yield logger_service_1.AppLogger.error(`Failed to send daily interview report for ${region}`, sendMailResponse.message);
                    throw new app_error_1.AppErrorWithMessage(`Failed to send email: ${sendMailResponse.message}`);
                }
                yield logger_service_1.AppLogger.log(`Daily interview report sent for ${region} - ${successCount}/${consultants.length} met goal`);
                response.success = true;
                response.message = `Report sent: ${successCount}/${consultants.length} met goal`;
            }
            catch (error) {
                response.handleError(error);
                yield logger_service_1.AppLogger.error('Error in sendDailyInterviewReport', error);
            }
            return response;
        });
    }
    getYesterdayStartInTimezone(timezone) {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-CA', {
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
        const todayStr = formatter.format(now);
        const [year, month, day] = todayStr.split('-').map(Number);
        const yesterday = new Date(Date.UTC(year, month - 1, day - 1, 0, 0, 0, 0));
        const offsetMs = this.getTimezoneOffsetMs(timezone, yesterday);
        return new Date(yesterday.getTime() + offsetMs);
    }
    getYesterdayEndInTimezone(timezone) {
        const start = this.getYesterdayStartInTimezone(timezone);
        return new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
    }
    getDayOfWeekInTimezone(date, timezone) {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            weekday: 'short',
        });
        const dayStr = formatter.format(date);
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days.indexOf(dayStr);
    }
    getTimezoneOffsetMs(timezone, date) {
        const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
        const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
        return utcDate.getTime() - tzDate.getTime();
    }
    formatDateForReport(date) {
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${day}/${month}/${year}`;
    }
    sendWeeklyInterviewReport() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                const timezone = 'Europe/Paris';
                const { weekStart, weekEnd } = this.getLastWeekDateRange(timezone);
                const weekStartFormatted = this.formatDateForReport(weekStart);
                const weekEndFormatted = this.formatDateForReport(weekEnd);
                const userRepository = (0, typeorm_2.getRepository)(user_entity_1.User);
                const adminUserIds = userRepository
                    .createQueryBuilder('adminUser')
                    .select('adminUser.id')
                    .innerJoin('adminUser.roles', 'adminRole')
                    .where('adminRole.role IN (:...adminRoles)', {
                    adminRoles: [shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.AdminTech],
                });
                const allRecruiters = yield userRepository
                    .createQueryBuilder('user')
                    .innerJoin('user.roles', 'role')
                    .where('role.role IN (:...roles)', {
                    roles: [shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.RH],
                })
                    .andWhere('user.disabled = :disabled', { disabled: false })
                    .andWhere(`user.id NOT IN (${adminUserIds.getQuery()})`)
                    .setParameters(adminUserIds.getParameters())
                    .getMany();
                const filteredRecruiters = allRecruiters.filter((r) => !InterviewsService_1.EXCLUDED_EMAILS.includes(r.mail));
                if (filteredRecruiters.length === 0) {
                    yield logger_service_1.AppLogger.log('Weekly interview report: No active consultants/RH found');
                    response.success = true;
                    response.message = 'No consultants to report';
                    return response;
                }
                const interviews = yield this.repository.find({
                    where: {
                        date: (0, typeorm_2.Between)(weekStart, weekEnd),
                        consultantId: (0, typeorm_2.In)(filteredRecruiters.map((c) => c.id)),
                    },
                    relations: ['consultant'],
                });
                const interviewCountByConsultant = new Map();
                for (const interview of interviews) {
                    const count = interviewCountByConsultant.get(interview.consultantId) || 0;
                    interviewCountByConsultant.set(interview.consultantId, count + 1);
                }
                let belowTargetCount = 0;
                for (const recruiter of filteredRecruiters) {
                    const interviewCount = interviewCountByConsultant.get(recruiter.id) || 0;
                    if (interviewCount >= InterviewsService_1.WEEKLY_INTERVIEW_GOAL) {
                        continue;
                    }
                    belowTargetCount++;
                    const name = `${recruiter.firstName || ''} ${recruiter.lastName || ''}`.trim() || recruiter.userName;
                    const deficit = InterviewsService_1.WEEKLY_INTERVIEW_GOAL - interviewCount;
                    const recipients = [
                        ...InterviewsService_1.REPORT_RECIPIENT_EMAILS.map((email) => ({ address: email })),
                    ];
                    if (recruiter.mail) {
                        recipients.push({ address: recruiter.mail });
                    }
                    const mailData = {
                        from: {
                            address: environment_1.Environment.MailSender ||
                                'noreply@morganmallet.agency',
                        },
                        subject: `Rapport hebdomadaire entretiens / Weekly Interview Report - ${name} - ${weekStartFormatted}`,
                        to: recipients,
                        templateName: 'mail_weekly_interview_report.mjml',
                        templateValues: {
                            weekStartDate: weekStartFormatted,
                            weekEndDate: weekEndFormatted,
                            weeklyGoal: InterviewsService_1.WEEKLY_INTERVIEW_GOAL,
                            dailyGoal: InterviewsService_1.DAILY_INTERVIEW_GOAL,
                            consultantName: name,
                            consultantInterviewCount: interviewCount,
                            deficit,
                            SITE_BASE_URL: environment_1.Environment.BaseURL,
                        },
                        useHandleBars: true,
                        compileMjmlTemplate: true,
                    };
                    const sendMailResponse = yield this.mailService.sendMail(mailData);
                    if (!sendMailResponse.success) {
                        yield logger_service_1.AppLogger.error(`Failed to send weekly interview report for ${name}`, sendMailResponse.message);
                    }
                }
                yield logger_service_1.AppLogger.log(`Weekly interview report sent - ${belowTargetCount} consultant(s) below target out of ${filteredRecruiters.length}`);
                response.success = true;
                response.message = `Report sent: ${belowTargetCount}/${filteredRecruiters.length} below target`;
            }
            catch (error) {
                response.handleError(error);
                yield logger_service_1.AppLogger.error('Error in sendWeeklyInterviewReport', error);
            }
            return response;
        });
    }
    getLastWeekDateRange(timezone) {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-CA', {
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
        const todayStr = formatter.format(now);
        const [year, month, day] = todayStr.split('-').map(Number);
        const dayOfWeekFormatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            weekday: 'short',
        });
        const dayStr = dayOfWeekFormatter.format(now);
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const currentDayOfWeek = days.indexOf(dayStr);
        const daysSinceLastMonday = currentDayOfWeek === 0
            ? 6 + 7
            : currentDayOfWeek - 1 + 7;
        const lastMondayUTC = new Date(Date.UTC(year, month - 1, day - daysSinceLastMonday, 0, 0, 0, 0));
        const lastFridayUTC = new Date(Date.UTC(year, month - 1, day - daysSinceLastMonday + 4, 23, 59, 59, 999));
        const offsetMs = this.getTimezoneOffsetMs(timezone, lastMondayUTC);
        const weekStart = new Date(lastMondayUTC.getTime() + offsetMs);
        const weekEnd = new Date(lastFridayUTC.getTime() + offsetMs);
        return { weekStart, weekEnd };
    }
    checkCandidatesInterviewEligibility(candidateIds, consultantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            const fourteenDaysAgo = new Date();
            fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
            fourteenDaysAgo.setHours(0, 0, 0, 0);
            for (const candidateId of candidateIds) {
                const interview = yield this.repository.findOne({
                    where: {
                        candidateId: candidateId,
                        consultantId: consultantId,
                    },
                    order: { date: 'DESC' },
                });
                if (interview && interview.date >= fourteenDaysAgo) {
                    results.push({
                        candidateId,
                        isEligible: true,
                        lastInterviewDate: interview.date,
                    });
                }
                else {
                    results.push({
                        candidateId,
                        isEligible: false,
                        lastInterviewDate: interview === null || interview === void 0 ? void 0 : interview.date,
                    });
                }
            }
            return results;
        });
    }
};
InterviewsService.DAILY_INTERVIEW_GOAL = 3;
InterviewsService.WEEKLY_INTERVIEW_GOAL = 15;
InterviewsService.REPORT_RECIPIENT_EMAILS = [
    'laurine@morganmallet.agency',
    'morgan@morganmallet.agency',
];
InterviewsService.REPORT_RECIPIENT_EMAIL = 'laurine@morganmallet.agency';
InterviewsService.EXCLUDED_EMAILS = [
    'eric@morganmallet.agency',
];
InterviewsService.US_CONSULTANT_USERNAMES = [
    'Eric',
    'Daniele',
    'Jonathan',
    'Cara-Leahy',
];
InterviewsService = InterviewsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(interview_entity_1.Interview)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        mail_service_1.MailService,
        referential_service_1.ReferentialService,
        candidates_service_1.CandidateService])
], InterviewsService);
exports.InterviewsService = InterviewsService;
//# sourceMappingURL=interviews.service.js.map