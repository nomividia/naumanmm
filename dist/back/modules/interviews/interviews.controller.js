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
exports.InterviewsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nextalys_js_helpers_1 = require("nextalys-js-helpers");
const typeorm_1 = require("typeorm");
const candidates_helpers_1 = require("../../../shared/candidates-helpers");
const interview_helpers_1 = require("../../../shared/interview-helpers");
const shared_constants_1 = require("../../../shared/shared-constants");
const environment_1 = require("../../environment/environment");
const app_error_1 = require("../../models/app-error");
const base_search_requests_1 = require("../../models/requests/base-search-requests");
const generic_response_1 = require("../../models/responses/generic-response");
const auth_tools_service_1 = require("../../services/auth-tools.service");
const roles_guard_1 = require("../../services/guards/roles-guard");
const referential_service_1 = require("../../services/referential.service");
const roles_decorator_1 = require("../../services/roles.decorator");
const mail_service_1 = require("../../services/tools/mail.service");
const base_controller_1 = require("../../shared/base.controller");
const candidates_service_1 = require("../candidates/candidates.service");
const interview_dto_1 = require("./interview-dto");
const interviews_service_1 = require("./interviews.service");
let InterviewsController = class InterviewsController extends base_controller_1.BaseController {
    constructor(interviewsService, authToolsService, mailService, referentialService, candidatesService) {
        super();
        this.interviewsService = interviewsService;
        this.authToolsService = authToolsService;
        this.mailService = mailService;
        this.referentialService = referentialService;
        this.candidatesService = candidatesService;
    }
    getAll(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOptions = base_search_requests_1.BaseSearchRequest.getDefaultFindOptions(request);
            findOptions.where = [{}];
            if (request.search) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                findOptions.where = [
                    {
                        ref: (0, typeorm_1.Like)('%' + request.search + '%'),
                    },
                ];
            }
            if (request.candidateId) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                for (const whereFilter of findOptions.where) {
                    whereFilter.candidateId = request.candidateId;
                }
            }
            if (request.interviewFilterMonth) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                for (const whereFilter of findOptions.where) {
                    whereFilter.date = (0, typeorm_1.Raw)((alias) => `(MONTH(${alias}) = '${request.interviewFilterMonth}')`);
                }
            }
            if (request.interviewFilterYear) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                for (const whereFilter of findOptions.where) {
                    whereFilter.date = (0, typeorm_1.Raw)((alias) => `(YEAR(${alias}) = '${request.interviewFilterYear}' )`);
                }
            }
            if (request.interviewFilterMonth && request.interviewFilterYear) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                for (const whereFilter of findOptions.where) {
                    whereFilter.date = (0, typeorm_1.Raw)((alias) => `(YEAR(${alias}) = '${request.interviewFilterYear}' ) && (MONTH(${alias}) = '${request.interviewFilterMonth}')`);
                }
            }
            if (request.interviewCurrentDate) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                const currentDate = new Date();
                if (request.interviewCurrentDate === 'past') {
                    for (const whereFilter of findOptions.where) {
                        whereFilter.date = (0, typeorm_1.Raw)((alias) => `(${alias} < '${nextalys_js_helpers_1.DateHelpers.formatDateISO8601(currentDate, false)} ')`);
                    }
                }
                if (request.interviewCurrentDate === 'coming') {
                    for (const whereFilter of findOptions.where) {
                        whereFilter.date = (0, typeorm_1.Raw)((alias) => `(${alias} >= '${nextalys_js_helpers_1.DateHelpers.formatDateISO8601(currentDate, false)}')`);
                    }
                }
            }
            return yield this.interviewsService.findAll(findOptions);
        });
    }
    getMyInterviews() {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = this.authToolsService.getCurrentPayload(false);
            if (!(payload === null || payload === void 0 ? void 0 : payload.candidateId)) {
                throw new app_error_1.AppErrorWithMessage('Invalid input');
            }
            const response = new interview_dto_1.GetInterviewsResponse();
            try {
                const interviewResponse = yield this.interviewsService.findAll({
                    where: { candidateId: payload.candidateId },
                    order: { date: 'DESC' },
                });
                if (!interviewResponse.success) {
                    throw new app_error_1.AppErrorWithMessage('Error when load interview');
                }
                response.interviews = interviewResponse.interviews;
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.interviewsService.findOne({ where: { id: id } });
        });
    }
    saveInterviewResponse(guid, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const saveInterviewResponse = new interview_dto_1.SaveInterviewResponseResponse();
            try {
                if (response !== shared_constants_1.InterviewConfirmationStatus.ACCEPTED &&
                    response !== shared_constants_1.InterviewConfirmationStatus.REFUSED) {
                    throw new Error('saveInterviewResponse : invalid arg - response');
                }
                const getInterviewResponse = yield this.interviewsService.findOne({
                    where: { guid: guid },
                    relations: ['consultant', 'candidate'],
                });
                if (!getInterviewResponse.success ||
                    !getInterviewResponse.interview) {
                    throw new Error('saveInterviewResponse : invalid args');
                }
                const interview = getInterviewResponse.interview;
                if (interview.candidateResponse === response) {
                    if (response === shared_constants_1.InterviewConfirmationStatus.ACCEPTED) {
                        saveInterviewResponse.alreadyAccepted = true;
                    }
                    else if (response === shared_constants_1.InterviewConfirmationStatus.REFUSED) {
                        saveInterviewResponse.alreadyRefused = true;
                    }
                    saveInterviewResponse.success = true;
                    saveInterviewResponse.interview = interview;
                    return saveInterviewResponse;
                }
                yield this.interviewsService
                    .getRepository()
                    .update({ id: interview.id }, { candidateResponse: response });
                interview.candidateResponse = response;
                saveInterviewResponse.interview = interview;
                let languageResponse = yield this.referentialService.appLanguagesRepository.findOne({
                    where: { id: interview.consultant.languageId },
                });
                if (!(languageResponse === null || languageResponse === void 0 ? void 0 : languageResponse.code) ||
                    (languageResponse.code !== 'fr' &&
                        languageResponse.code !== 'en')) {
                    languageResponse = { code: 'en' };
                }
                const candidateResponseFormate = interview.candidateResponse ===
                    shared_constants_1.InterviewConfirmationStatus.ACCEPTED
                    ? 'accepté'
                    : 'refusé';
                const candidateName = (interview.candidate.firstName || '') +
                    ' ' +
                    (interview.candidate.lastName || '');
                let interviewLocationAddress = interview_helpers_1.InterviewHelpers.getInterviewPlaceAddress(interview.agencyPlace, languageResponse === null || languageResponse === void 0 ? void 0 : languageResponse.code);
                if (interview.agencyPlace === 'visio') {
                    interviewLocationAddress = 'VISIO';
                }
                const emailData = {
                    to: [
                        {
                            address: interview.consultant.mail,
                            name: interview.consultant.lastName,
                        },
                    ],
                    subject: 'Réponse du candidat ' + candidateName + " à l'entretien",
                    from: {
                        name: 'MMI',
                        address: candidates_helpers_1.SharedCandidatesHelpers.getMailSender(shared_constants_1.AppTypes.JobCategoryCode, languageResponse === null || languageResponse === void 0 ? void 0 : languageResponse.code, undefined, undefined),
                    },
                    htmlBody: `Bonjour, le candidat <a href="${environment_1.Environment.BaseURL}/candidats/${interview.candidateId}">${candidateName}</a> a ${candidateResponseFormate}
                la demande d'entretien : ${interview.title}. <br/>
                - Heure du rendez-vous : ${nextalys_js_helpers_1.DateHelpers.formatDate(interview.date, true)} <br/> - Lieu du rendez-vous : ${interviewLocationAddress}.`,
                };
                const sendMailResponse = yield this.mailService.sendMailWithGenericTemplate(emailData);
                saveInterviewResponse.success = true;
            }
            catch (error) {
                saveInterviewResponse.handleError(error);
            }
            return saveInterviewResponse;
        });
    }
    createOrUpdate(interviewDto) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!interviewDto) {
                throw new app_error_1.AppErrorWithMessage('Invalid Request');
            }
            const response = yield this.interviewsService.createOrUpdate(interviewDto);
            if (!response.success) {
                throw new app_error_1.AppErrorWithMessage('Error when create or update interview');
            }
            const currentFullCandidate = yield this.candidatesService
                .getRepository()
                .findOne({
                where: {
                    id: response.interview.candidateId,
                },
                relations: ['candidateStatus'],
            });
            if (response.interview.id &&
                ((_a = currentFullCandidate.candidateStatus) === null || _a === void 0 ? void 0 : _a.code) ===
                    shared_constants_1.CandidateStatus.ToBeReferenced) {
                const candidateStatusId = yield this.referentialService.getAppValues({
                    where: {
                        code: shared_constants_1.CandidateStatus.BeingReferenced,
                    },
                });
                yield this.candidatesService
                    .getRepository()
                    .update({ id: response.interview.candidateId }, { candidateStatusId: candidateStatusId.appValues[0].id });
                response.interview.candidate.candidateStatusId =
                    candidateStatusId.appValues[0].id;
            }
            return response;
        });
    }
    delete(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.interviewsService.delete(ids.split(','));
        });
    }
    archive(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.interviewsService.archive(ids);
        });
    }
    sendInterviewMailToCandidate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = this.authToolsService.getCurrentPayload(false);
            return yield this.interviewsService.sendInterviewMailToCandidate(id, payload === null || payload === void 0 ? void 0 : payload.mail);
        });
    }
    getConsultantInterviews(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.interviewsService.findAllInterviewsConsultant(request, this.authToolsService);
        });
    }
    sendPlacedCandidateReviewEmail(candidateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = this.authToolsService.getCurrentPayload(false);
            return yield this.interviewsService.sendPlacedCandidateReviewEmail(candidateId, payload === null || payload === void 0 ? void 0 : payload.mail);
        });
    }
    checkCandidatesInterviewEligibility(request) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new interview_dto_1.CheckCandidatesInterviewEligibilityResponse();
            try {
                const payload = this.authToolsService.getCurrentPayload(false);
                if (!(payload === null || payload === void 0 ? void 0 : payload.id)) {
                    throw new app_error_1.AppErrorWithMessage('User not authenticated');
                }
                if (!((_a = request.candidateIds) === null || _a === void 0 ? void 0 : _a.length)) {
                    response.eligibilities = [];
                    response.success = true;
                    return response;
                }
                const eligibilities = yield this.interviewsService.checkCandidatesInterviewEligibility(request.candidateIds, payload.id);
                response.eligibilities = eligibilities;
                response.success = true;
            }
            catch (error) {
                response.handleError(error);
            }
            return response;
        });
    }
};
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Get)('getAll'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all interviews',
        operationId: 'getAllInterviews',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get all interviews',
        type: interview_dto_1.GetInterviewsResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interview_dto_1.GetInterviewsRequest]),
    __metadata("design:returntype", Promise)
], InterviewsController.prototype, "getAll", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Candidate),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('getMyInterviews'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get my interviews',
        operationId: 'getMyInterviews',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get my interviews',
        type: interview_dto_1.GetInterviewsResponse,
    }),
    (0, common_1.HttpCode)(200),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InterviewsController.prototype, "getMyInterviews", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Get)('get/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get interview', operationId: 'getInterview' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get interview',
        type: interview_dto_1.GetInterviewResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InterviewsController.prototype, "get", null);
__decorate([
    (0, common_1.Get)('saveInterviewResponse/:guid/:response'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'saveInterviewResponse',
        operationId: 'saveInterviewResponse',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'saveInterviewResponse',
        type: interview_dto_1.SaveInterviewResponseResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('guid')),
    __param(1, (0, common_1.Param)('response')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InterviewsController.prototype, "saveInterviewResponse", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Post)('createOrUpdate'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create or update interview',
        operationId: 'createOrUpdateInterview',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Create or update interview',
        type: interview_dto_1.GetInterviewResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interview_dto_1.InterviewDto]),
    __metadata("design:returntype", Promise)
], InterviewsController.prototype, "createOrUpdate", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Delete)('delete/:ids'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete interviews',
        operationId: 'deleteInterviews',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Delete interviews',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InterviewsController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('archiveInterviews'),
    (0, swagger_1.ApiOperation)({
        summary: 'Archive interviews',
        operationId: 'archiveInterviews',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Archive interviews',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], InterviewsController.prototype, "archive", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('sendInterviewMailToCandidate/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'send interview mail to candidate',
        operationId: 'sendInterviewMailToCandidate',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'send interview mail to candidate',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InterviewsController.prototype, "sendInterviewMailToCandidate", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('getConsultantInterviews'),
    (0, swagger_1.ApiOperation)({
        summary: 'get interviews consultant',
        operationId: 'getConsultantInterviews',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'consultant Interviews',
        type: interview_dto_1.GetInterviewsResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interview_dto_1.GetInterviewsRequest]),
    __metadata("design:returntype", Promise)
], InterviewsController.prototype, "getConsultantInterviews", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('send-placed-candidate-review-email/:candidateId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Send review request email to placed candidate',
        description: 'Send a review request email to a candidate who has been placed in a job',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Review request email sent successfully',
        type: generic_response_1.GenericResponse,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request or candidate not found',
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('candidateId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InterviewsController.prototype, "sendPlacedCandidateReviewEmail", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('checkCandidatesInterviewEligibility'),
    (0, swagger_1.ApiOperation)({
        summary: 'Check if candidates have had recent interviews with current consultant',
        description: 'Verifies if each candidate has had an interview with the current consultant in the last 14 days. Required before sending resumes to customers.',
        operationId: 'checkCandidatesInterviewEligibility',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Interview eligibility check results',
        type: interview_dto_1.CheckCandidatesInterviewEligibilityResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interview_dto_1.CheckCandidatesInterviewEligibilityRequest]),
    __metadata("design:returntype", Promise)
], InterviewsController.prototype, "checkCandidatesInterviewEligibility", null);
InterviewsController = __decorate([
    (0, common_1.Controller)('interviews'),
    (0, swagger_1.ApiTags)('interviews'),
    __metadata("design:paramtypes", [interviews_service_1.InterviewsService,
        auth_tools_service_1.AuthToolsService,
        mail_service_1.MailService,
        referential_service_1.ReferentialService,
        candidates_service_1.CandidateService])
], InterviewsController);
exports.InterviewsController = InterviewsController;
//# sourceMappingURL=interviews.controller.js.map