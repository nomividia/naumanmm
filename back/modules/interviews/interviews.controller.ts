import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { DateHelpers } from 'nextalys-js-helpers';
import { EmailData } from 'nextalys-node-helpers';
import { FindConditions, Like, Raw } from 'typeorm';
import { SharedCandidatesHelpers } from '../../../shared/candidates-helpers';
import { InterviewHelpers } from '../../../shared/interview-helpers';
import {
    AppTypes,
    CandidateStatus,
    InterviewConfirmationStatus,
    RolesList,
} from '../../../shared/shared-constants';
import { Environment } from '../../environment/environment';
import { AppErrorWithMessage } from '../../models/app-error';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { GenericResponse } from '../../models/responses/generic-response';
import { AuthToolsService } from '../../services/auth-tools.service';
import { RolesGuard } from '../../services/guards/roles-guard';
import { ReferentialService } from '../../services/referential.service';
import { Roles } from '../../services/roles.decorator';
import { MailService } from '../../services/tools/mail.service';
import { BaseController } from '../../shared/base.controller';
import { CandidateService } from '../candidates/candidates.service';
import {
    CheckCandidatesInterviewEligibilityRequest,
    CheckCandidatesInterviewEligibilityResponse,
    GetInterviewResponse,
    GetInterviewsRequest,
    GetInterviewsResponse,
    InterviewDto,
    SaveInterviewResponseResponse,
} from './interview-dto';
import { Interview } from './interview.entity';
import { InterviewsService } from './interviews.service';

@Controller('interviews')
@ApiTags('interviews')
export class InterviewsController extends BaseController {
    constructor(
        private readonly interviewsService: InterviewsService,
        private authToolsService: AuthToolsService,
        private mailService: MailService,
        private referentialService: ReferentialService,
        private candidatesService: CandidateService,
    ) {
        super();
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Get('getAll')
    @ApiOperation({
        summary: 'Get all interviews',
        operationId: 'getAllInterviews',
    })
    @ApiResponse({
        status: 200,
        description: 'Get all interviews',
        type: GetInterviewsResponse,
    })
    @HttpCode(200)
    async getAll(
        @Query() request: GetInterviewsRequest,
    ): Promise<GetInterviewsResponse> {
        const findOptions =
            BaseSearchRequest.getDefaultFindOptions<Interview>(request);
        findOptions.where = [{}];

        if (request.search) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            findOptions.where = [
                {
                    ref: Like('%' + request.search + '%'),
                },
            ];
        }

        if (request.candidateId) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            for (const whereFilter of findOptions.where as FindConditions<Interview>[]) {
                whereFilter.candidateId = request.candidateId;
            }
        }

        if (request.interviewFilterMonth) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            for (const whereFilter of findOptions.where as FindConditions<Interview>[]) {
                whereFilter.date = Raw(
                    (alias) =>
                        `(MONTH(${alias}) = '${request.interviewFilterMonth}')`,
                );
            }
        }

        if (request.interviewFilterYear) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            for (const whereFilter of findOptions.where as FindConditions<Interview>[]) {
                whereFilter.date = Raw(
                    (alias) =>
                        `(YEAR(${alias}) = '${request.interviewFilterYear}' )`,
                );
            }
        }

        // TO REMAKE
        if (request.interviewFilterMonth && request.interviewFilterYear) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            for (const whereFilter of findOptions.where as FindConditions<Interview>[]) {
                whereFilter.date = Raw(
                    (alias) =>
                        `(YEAR(${alias}) = '${request.interviewFilterYear}' ) && (MONTH(${alias}) = '${request.interviewFilterMonth}')`,
                );
            }
        }

        if (request.interviewCurrentDate) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            const currentDate = new Date();

            if (request.interviewCurrentDate === 'past') {
                for (const whereFilter of findOptions.where as FindConditions<Interview>[]) {
                    whereFilter.date = Raw(
                        (alias) =>
                            `(${alias} < '${DateHelpers.formatDateISO8601(
                                currentDate,
                                false,
                            )} ')`,
                    );
                }
            }

            if (request.interviewCurrentDate === 'coming') {
                for (const whereFilter of findOptions.where as FindConditions<Interview>[]) {
                    whereFilter.date = Raw(
                        (alias) =>
                            `(${alias} >= '${DateHelpers.formatDateISO8601(
                                currentDate,
                                false,
                            )}')`,
                    );
                }
            }
        }

        return await this.interviewsService.findAll(findOptions);
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Candidate)
    @ApiBearerAuth()
    @Get('getMyInterviews')
    @ApiOperation({
        summary: 'Get my interviews',
        operationId: 'getMyInterviews',
    })
    @ApiResponse({
        status: 200,
        description: 'Get my interviews',
        type: GetInterviewsResponse,
    })
    @HttpCode(200)
    async getMyInterviews(): Promise<GetInterviewsResponse> {
        const payload = this.authToolsService.getCurrentPayload(false);

        if (!payload?.candidateId) {
            throw new AppErrorWithMessage('Invalid input');
        }

        const response = new GetInterviewsResponse();

        try {
            const interviewResponse = await this.interviewsService.findAll({
                where: { candidateId: payload.candidateId },
                order: { date: 'DESC' },
            });

            if (!interviewResponse.success) {
                throw new AppErrorWithMessage('Error when load interview');
            }

            response.interviews = interviewResponse.interviews;
            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Get('get/:id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get interview', operationId: 'getInterview' })
    @ApiResponse({
        status: 200,
        description: 'Get interview',
        type: GetInterviewResponse,
    })
    @HttpCode(200)
    async get(@Param('id') id: string): Promise<GetInterviewResponse> {
        return await this.interviewsService.findOne({ where: { id: id } });
    }

    // @UseGuards(RolesGuard)
    // @Roles(RolesList.Admin, RolesList.Consultant, RolesList.AdminTech, RolesList.Candidate, RolesList.RH)
    @Get('saveInterviewResponse/:guid/:response')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'saveInterviewResponse',
        operationId: 'saveInterviewResponse',
    })
    @ApiResponse({
        status: 200,
        description: 'saveInterviewResponse',
        type: SaveInterviewResponseResponse,
    })
    @HttpCode(200)
    async saveInterviewResponse(
        @Param('guid') guid: string,
        @Param('response') response: string,
    ): Promise<SaveInterviewResponseResponse> {
        const saveInterviewResponse = new SaveInterviewResponseResponse();

        try {
            if (
                response !== InterviewConfirmationStatus.ACCEPTED &&
                response !== InterviewConfirmationStatus.REFUSED
            ) {
                throw new Error(
                    'saveInterviewResponse : invalid arg - response',
                );
            }

            const getInterviewResponse = await this.interviewsService.findOne({
                where: { guid: guid },
                relations: ['consultant', 'candidate'],
            });

            if (
                !getInterviewResponse.success ||
                !getInterviewResponse.interview
            ) {
                throw new Error('saveInterviewResponse : invalid args');
            }

            const interview = getInterviewResponse.interview;

            if (interview.candidateResponse === response) {
                if (response === InterviewConfirmationStatus.ACCEPTED) {
                    saveInterviewResponse.alreadyAccepted = true;
                } else if (response === InterviewConfirmationStatus.REFUSED) {
                    saveInterviewResponse.alreadyRefused = true;
                }

                saveInterviewResponse.success = true;
                saveInterviewResponse.interview = interview;

                return saveInterviewResponse;
            }

            await this.interviewsService
                .getRepository()
                .update({ id: interview.id }, { candidateResponse: response });

            interview.candidateResponse = response;
            saveInterviewResponse.interview = interview;

            let languageResponse =
                await this.referentialService.appLanguagesRepository.findOne({
                    where: { id: interview.consultant.languageId },
                });

            if (
                !languageResponse?.code ||
                (languageResponse.code !== 'fr' &&
                    languageResponse.code !== 'en')
            ) {
                languageResponse = { code: 'en' } as any;
            }

            const candidateResponseFormate =
                interview.candidateResponse ===
                InterviewConfirmationStatus.ACCEPTED
                    ? 'accepté'
                    : 'refusé';

            const candidateName =
                (interview.candidate.firstName || '') +
                ' ' +
                (interview.candidate.lastName || '');

            let interviewLocationAddress =
                InterviewHelpers.getInterviewPlaceAddress(
                    interview.agencyPlace,
                    languageResponse?.code as 'fr' | 'en',
                );

            if (interview.agencyPlace === 'visio') {
                interviewLocationAddress = 'VISIO';
            }

            const emailData: EmailData = {
                to: [
                    {
                        address: interview.consultant.mail,
                        name: interview.consultant.lastName,
                    },
                ],
                subject:
                    'Réponse du candidat ' + candidateName + " à l'entretien",
                from: {
                    name: 'MMI',
                    address: SharedCandidatesHelpers.getMailSender(
                        AppTypes.JobCategoryCode,
                        languageResponse?.code as 'fr' | 'en',
                        undefined,
                        undefined, // No consultant email available in candidate response
                    ),
                },
                htmlBody: `Bonjour, le candidat <a href="${
                    Environment.BaseURL
                }/candidats/${
                    interview.candidateId
                }">${candidateName}</a> a ${candidateResponseFormate}
                la demande d'entretien : ${interview.title}. <br/>
                - Heure du rendez-vous : ${DateHelpers.formatDate(
                    interview.date,
                    true,
                )} <br/> - Lieu du rendez-vous : ${interviewLocationAddress}.`,
            };

            const sendMailResponse =
                await this.mailService.sendMailWithGenericTemplate(emailData);

            saveInterviewResponse.success = true;
        } catch (error) {
            saveInterviewResponse.handleError(error);
        }

        return saveInterviewResponse;
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Post('createOrUpdate')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Create or update interview',
        operationId: 'createOrUpdateInterview',
    })
    @ApiResponse({
        status: 200,
        description: 'Create or update interview',
        type: GetInterviewResponse,
    })
    @HttpCode(200)
    async createOrUpdate(
        @Body() interviewDto: InterviewDto,
    ): Promise<GetInterviewResponse> {
        if (!interviewDto) {
            throw new AppErrorWithMessage('Invalid Request');
        }

        const response = await this.interviewsService.createOrUpdate(
            interviewDto,
        );

        if (!response.success) {
            throw new AppErrorWithMessage(
                'Error when create or update interview',
            );
        }

        // If the interview is created we need to update the candidate current status to "Interview Scheduled"
        const currentFullCandidate = await this.candidatesService
            .getRepository()
            .findOne({
                where: {
                    id: response.interview.candidateId,
                },
                relations: ['candidateStatus'],
            });

        if (
            response.interview.id &&
            currentFullCandidate.candidateStatus?.code ===
                CandidateStatus.ToBeReferenced
        ) {
            const candidateStatusId =
                await this.referentialService.getAppValues({
                    where: {
                        code: CandidateStatus.BeingReferenced,
                    },
                });

            await this.candidatesService
                .getRepository()
                .update(
                    { id: response.interview.candidateId },
                    { candidateStatusId: candidateStatusId.appValues[0].id },
                );

            response.interview.candidate.candidateStatusId =
                candidateStatusId.appValues[0].id;
        }

        return response;
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Delete('delete/:ids')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Delete interviews',
        operationId: 'deleteInterviews',
    })
    @ApiResponse({
        status: 200,
        description: 'Delete interviews',
        type: GenericResponse,
    })
    @HttpCode(200)
    async delete(@Param('ids') ids: string): Promise<GenericResponse> {
        return await this.interviewsService.delete(ids.split(','));
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @ApiBearerAuth()
    @Post('archiveInterviews')
    @ApiOperation({
        summary: 'Archive interviews',
        operationId: 'archiveInterviews',
    })
    @ApiResponse({
        status: 200,
        description: 'Archive interviews',
        type: GenericResponse,
    })
    @HttpCode(200)
    async archive(@Body() ids: string[]): Promise<GenericResponse> {
        return await this.interviewsService.archive(ids);
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @ApiBearerAuth()
    @Post('sendInterviewMailToCandidate/:id')
    @ApiOperation({
        summary: 'send interview mail to candidate',
        operationId: 'sendInterviewMailToCandidate',
    })
    @ApiResponse({
        status: 200,
        description: 'send interview mail to candidate',
        type: GenericResponse,
    })
    @HttpCode(200)
    async sendInterviewMailToCandidate(@Param('id') id: string) {
        const payload = this.authToolsService.getCurrentPayload(false);
        return await this.interviewsService.sendInterviewMailToCandidate(
            id,
            payload?.mail,
        );
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @ApiBearerAuth()
    @Get('getConsultantInterviews')
    @ApiOperation({
        summary: 'get interviews consultant',
        operationId: 'getConsultantInterviews',
    })
    @ApiResponse({
        status: 200,
        description: 'consultant Interviews',
        type: GetInterviewsResponse,
    })
    @HttpCode(200)
    async getConsultantInterviews(
        @Query() request: GetInterviewsRequest,
    ): Promise<GetInterviewsResponse> {
        return await this.interviewsService.findAllInterviewsConsultant(
            request,
            this.authToolsService,
        );
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @ApiBearerAuth()
    @Post('send-placed-candidate-review-email/:candidateId')
    @ApiOperation({
        summary: 'Send review request email to placed candidate',
        description:
            'Send a review request email to a candidate who has been placed in a job',
    })
    @ApiResponse({
        status: 200,
        description: 'Review request email sent successfully',
        type: GenericResponse,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request or candidate not found',
    })
    @HttpCode(200)
    async sendPlacedCandidateReviewEmail(
        @Param('candidateId') candidateId: string,
    ): Promise<GenericResponse> {
        const payload = this.authToolsService.getCurrentPayload(false);
        return await this.interviewsService.sendPlacedCandidateReviewEmail(
            candidateId,
            payload?.mail,
        );
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @ApiBearerAuth()
    @Post('checkCandidatesInterviewEligibility')
    @ApiOperation({
        summary: 'Check if candidates have had recent interviews with current consultant',
        description:
            'Verifies if each candidate has had an interview with the current consultant in the last 14 days. Required before sending resumes to customers.',
        operationId: 'checkCandidatesInterviewEligibility',
    })
    @ApiResponse({
        status: 200,
        description: 'Interview eligibility check results',
        type: CheckCandidatesInterviewEligibilityResponse,
    })
    @HttpCode(200)
    async checkCandidatesInterviewEligibility(
        @Body() request: CheckCandidatesInterviewEligibilityRequest,
    ): Promise<CheckCandidatesInterviewEligibilityResponse> {
        const response = new CheckCandidatesInterviewEligibilityResponse();

        try {
            const payload = this.authToolsService.getCurrentPayload(false);

            if (!payload?.id) {
                throw new AppErrorWithMessage('User not authenticated');
            }

            if (!request.candidateIds?.length) {
                response.eligibilities = [];
                response.success = true;
                return response;
            }

            const eligibilities =
                await this.interviewsService.checkCandidatesInterviewEligibility(
                    request.candidateIds,
                    payload.id,
                );

            response.eligibilities = eligibilities;
            response.success = true;
        } catch (error) {
            response.handleError(error);
        }

        return response;
    }
}
