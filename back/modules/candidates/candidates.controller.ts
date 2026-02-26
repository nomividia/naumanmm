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
import { JwtService } from '@nestjs/jwt';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { RolesList } from '../../../shared/shared-constants';
import { AppErrorWithMessage } from '../../models/app-error';
import { GetUserResponse } from '../../models/dto/user-dto';
import { GenericResponse } from '../../models/responses/generic-response';
import { UserRelationsForLogin } from '../../services/auth-custom-rules';
import { AuthToolsService } from '../../services/auth-tools.service';
import { RolesGuard } from '../../services/guards/roles-guard';
import { Roles } from '../../services/roles.decorator';
import { UsersService } from '../../services/users.service';
import { BaseController } from '../../shared/base.controller';
import { NoteItemFileDto } from '../../models/dto/note-item-file.dto';
import {
    GetCandidateImageResponse,
    GetCandidateJobsConditionResponse,
    GetCandidateLanguageResponse,
    GetCandidateRequest,
    GetCandidateResponse,
    GetCandidatesRequest,
    GetCandidatesResponse,
    SaveCandidateRequest,
    SendCandidateByEmailRequest,
    UpdateCandidateJobsStatusRequest,
} from './candidate-dto';
import { CandidateService } from './candidates.service';

@Controller('candidates')
@ApiTags('candidates')
export class CandidatesController extends BaseController {
    constructor(
        private readonly candidateService: CandidateService,
        private readonly authToolsService: AuthToolsService,
        private userService: UsersService,
        private jwtService: JwtService,
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
    @Post('getAll')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get all candidates',
        operationId: 'getAllCandidates',
    })
    @ApiResponse({
        status: 200,
        description: 'Get all candidates',
        type: GetCandidatesResponse,
    })
    @HttpCode(200)
    async getAll(
        @Body() request: GetCandidatesRequest,
    ): Promise<GetCandidatesResponse> {
        return await this.candidateService.findAllForList(request);
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
    @ApiOperation({ summary: 'Get candidate', operationId: 'getCandidate' })
    @ApiResponse({
        status: 200,
        description: 'Get candidate',
        type: GetCandidateResponse,
    })
    @HttpCode(200)
    async get(
        @Param('id') id: string,
        @Query() request: GetCandidateRequest,
    ): Promise<GetCandidateResponse> {
        return await this.candidateService.findOneWithRequest(request, id);
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
        summary: 'Create or update candidate',
        operationId: 'createOrUpdateCandidate',
    })
    @ApiResponse({
        status: 200,
        description: 'Create or update candidate',
        type: GetCandidateResponse,
    })
    @HttpCode(200)
    async createOrUpdate(
        @Body() request: SaveCandidateRequest,
    ): Promise<GetCandidateResponse> {
        if (!request?.candidate) {
            throw new AppErrorWithMessage('Invalid Request');
        }

        const payload = this.authToolsService.getCurrentPayload(false);

        return await this.candidateService.createOrUpdate(
            request.candidate,
            true,
            request,
            payload,
        );
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin, RolesList.AdminTech)
    @Delete('delete/:ids')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Delete candidates',
        operationId: 'deleteCandidates',
    })
    @ApiResponse({
        status: 200,
        description: 'Delete candidates',
        type: GenericResponse,
    })
    @HttpCode(200)
    async delete(@Param('ids') ids: string): Promise<GenericResponse> {
        return await this.candidateService.delete(ids.split(','));
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin, RolesList.AdminTech)
    @ApiBearerAuth()
    @Post('archiveCandidate')
    @ApiOperation({
        summary: 'Archive candidates',
        operationId: 'archiveCandidates',
    })
    @ApiResponse({
        status: 200,
        description: 'Archive candidates',
        type: GenericResponse,
    })
    @HttpCode(200)
    async archive(@Body() ids: string[]): Promise<GenericResponse> {
        return await this.candidateService.archive(ids);
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Candidate)
    @Get('getMyDossier')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get current candidate dossier',
        operationId: 'getMyDossier',
    })
    @ApiResponse({
        status: 200,
        description: 'Get current candidate dossier',
        type: GetCandidateResponse,
    })
    @HttpCode(200)
    async getMyDossier(
        @Query() request: GetCandidateRequest,
    ): Promise<GetCandidateResponse> {
        const payload = this.authToolsService.getCurrentPayload(false);

        if (!payload?.candidateId) {
            throw new AppErrorWithMessage('Impossible de récupérer le dossier');
        }

        const response = await this.candidateService.findOneWithRequest(
            request,
            payload.candidateId,
        );
        const candidateDossier = response.candidate;

        if (candidateDossier) {
            candidateDossier.candidateAdvancementPercent =
                this.candidateService.getPercentageOfAdvancement(
                    response.candidate,
                )?.percentage;
            candidateDossier.candidateApplicationsLength = (
                await this.candidateService.getCandidateApplicationsLength(
                    response.candidate.id,
                )
            )?.applications;
        }

        return response;
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Candidate)
    @Post('saveMyDossier')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Save dossier of the current candidate',
        operationId: 'saveMyDossier',
    })
    @ApiResponse({
        status: 200,
        description: 'Save dossier of the current candidate',
        type: GetCandidateResponse,
    })
    @HttpCode(200)
    async saveMyDossier(
        @Body() request: SaveCandidateRequest,
    ): Promise<GetCandidateResponse> {
        const payload = this.authToolsService.getCurrentPayload(false);

        if (!payload?.candidateId) {
            throw new AppErrorWithMessage('Invalid input');
        }

        if (
            !request?.candidate?.id ||
            request.candidate.id !== payload.candidateId
        ) {
            throw new AppErrorWithMessage('Invalid Request');
        }

        const saveResponse = await this.createOrUpdate(request);

        //regenerate token
        if (saveResponse.candidate?.id) {
            const getUserResponse = await this.userService.findOne({
                where: { candidateId: saveResponse.candidate.id },
                relations: UserRelationsForLogin,
            });

            if (!getUserResponse.success) {
                saveResponse.message = getUserResponse.message;
                saveResponse.success = false;
                return saveResponse;
            }

            saveResponse.token = AuthToolsService.createUserToken(
                this.jwtService,
                getUserResponse.user,
            );
        }

        return saveResponse;
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Post('createUserFromCandidate/:candidateId')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Create user from candidate',
        operationId: 'createUserFromCandidate',
    })
    @ApiResponse({
        status: 200,
        description: 'Create user from candidate',
        type: GetUserResponse,
    })
    @HttpCode(200)
    async createUserFromCandidate(
        @Param('candidateId') candidateId: string,
    ): Promise<GetUserResponse> {
        const getCandidateResponse = await this.candidateService.findOne({
            where: { id: candidateId },
            relations: [
                'candidateLanguages',
                'candidateLanguages.levelLanguage',
                'candidateJobs',
                'candidateJobs.job',
                'candidateJobs.job.appType',
            ],
        });
        const payload = this.authToolsService.getCurrentPayload(false);

        return await this.candidateService.createUserFromCandidate(
            getCandidateResponse.candidate,
            payload,
            true,
            false,
        );
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Post('sendMailAccessToCandidate/:candidateId')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'send email access to candidate',
        operationId: 'sendMailAccessToCandidate',
    })
    @ApiResponse({
        status: 200,
        description: 'send email access to candidate',
        type: GetUserResponse,
    })
    @HttpCode(200)
    async sendMailAccessToCandidate(
        @Param('candidateId') candidateId: string,
    ): Promise<GetUserResponse> {
        const userResponse = await this.userService.findOne({
            where: { candidateId: candidateId },
        });
        const candidateResponse = await this.candidateService.findOne({
            where: { id: candidateId },
            relations: [
                'candidateLanguages',
                'candidateLanguages.levelLanguage',
            ],
        });

        const payload = this.authToolsService.getCurrentPayload(false);
        return await this.candidateService.sendEmailAccessToCandidate(
            userResponse?.user,
            candidateResponse?.candidate,
            'NewCandidateAccount',
            payload?.mail,
        );
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Candidate)
    @Get('getCandidateJobsConditions')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get current candidate jobs conditions',
        operationId: 'getCandidateJobsConditions',
    })
    @ApiResponse({
        status: 200,
        description: 'Get current candidate jobs conditions',
        type: GetCandidateJobsConditionResponse,
    })
    @HttpCode(200)
    async getCandidateJobsConditions(): Promise<GetCandidateJobsConditionResponse> {
        const payload = this.authToolsService.getCurrentPayload(false);

        if (!payload?.candidateId) {
            throw new AppErrorWithMessage(
                'Impossible de récupérer les informations',
            );
        }

        const candidateJobsConditionResponse =
            new GetCandidateJobsConditionResponse();

        try {
            const candidateResponse =
                await this.candidateService.repository.findOne(
                    payload.candidateId,
                    {
                        relations: [
                            'candidateJobs',
                            'contractType',
                            'addresses',
                        ],
                    },
                );

            if (candidateResponse) {
                const jobsResponse = candidateResponse.toDto().candidateJobs;

                if (jobsResponse) {
                    candidateJobsConditionResponse.candidateJobIds =
                        jobsResponse
                            .filter((x) => x.inActivity)
                            .map((x) => x.jobId);
                }

                candidateJobsConditionResponse.applyInCouple =
                    candidateResponse.inCouple;
                candidateJobsConditionResponse.contractTypeId =
                    candidateResponse.contractTypeId;
                candidateJobsConditionResponse.city =
                    candidateResponse?.addresses?.[0]?.city || null;
            }

            candidateJobsConditionResponse.success = true;
        } catch (err) {
            candidateJobsConditionResponse.handleError(err);
        }

        return candidateJobsConditionResponse;
    }

    @UseGuards(RolesGuard)
    @Roles()
    @Get('getCandidateHasImageProfile/:id')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get get candidate image',
        operationId: 'getCandidateHasImageProfile',
    })
    @ApiResponse({
        status: 200,
        description: 'Get get candidate image',
        type: GetCandidateImageResponse,
    })
    @HttpCode(200)
    async getCandidateHasImageProfile(
        @Param('id') id: string,
    ): Promise<GetCandidateImageResponse> {
        return await this.candidateService.getCandidateHasImageProfile(id);
    }

    @Roles(RolesList.Consultant, RolesList.RH)
    @Post('sendCandidateFolderByMail')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'send candidate folder by email',
        operationId: 'sendCandidateFolderByMail',
    })
    @ApiResponse({
        status: 200,
        description: 'send candidate folder by email',
        type: GenericResponse,
    })
    @HttpCode(200)
    async sendCandidateFolderByMail(
        @Body() request: SendCandidateByEmailRequest,
    ): Promise<GenericResponse> {
        const payload = this.authToolsService.getCurrentPayload(false);
        return await this.candidateService.sendCandidateFolderByMail(
            request,
            payload?.mail,
        );
    }

    @UseGuards(RolesGuard)
    @Roles()
    @Get('getCandidateMainLanguage/:id')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get get candidate main language',
        operationId: 'getCandidateMainLanguage',
    })
    @ApiResponse({
        status: 200,
        description: 'Get get candidate main language',
        type: GetCandidateLanguageResponse,
    })
    @HttpCode(200)
    async getCandidateMainLanguage(
        @Param('id') id: string,
    ): Promise<GetCandidateLanguageResponse> {
        return await this.candidateService.getCandidateMainLanguage(id);
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Post('updateCandidateJobsStatus')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Update candidate jobs status in bulk',
        operationId: 'updateCandidateJobsStatus',
    })
    @ApiResponse({
        status: 200,
        description: 'Update candidate jobs status',
        type: GetCandidateResponse,
    })
    @HttpCode(200)
    async updateCandidateJobsStatus(
        @Body() request: UpdateCandidateJobsStatusRequest,
    ): Promise<GetCandidateResponse> {
        if (!request?.candidateId || !request?.candidateJobUpdates) {
            throw new AppErrorWithMessage('Invalid Request');
        }

        const payload = this.authToolsService.getCurrentPayload(false);

        return await this.candidateService.updateCandidateJobsStatus(
            request.candidateId,
            request.candidateJobUpdates,
            payload,
        );
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Post('saveNoteItemFile/:noteItemId')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Save a file attached to a note item',
        operationId: 'saveNoteItemFile',
    })
    @ApiResponse({
        status: 200,
        description: 'Save note item file',
        type: GenericResponse,
    })
    @HttpCode(200)
    async saveNoteItemFile(
        @Param('noteItemId') noteItemId: string,
        @Body() fileDto: NoteItemFileDto,
    ): Promise<GenericResponse> {
        return await this.candidateService.saveNoteItemFile(noteItemId, fileDto);
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Delete('deleteNoteItemFile/:noteItemFileId')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Delete a file attached to a note item',
        operationId: 'deleteNoteItemFile',
    })
    @ApiResponse({
        status: 200,
        description: 'Delete note item file',
        type: GenericResponse,
    })
    @HttpCode(200)
    async deleteNoteItemFile(
        @Param('noteItemFileId') noteItemFileId: string,
    ): Promise<GenericResponse> {
        return await this.candidateService.deleteNoteItemFile(noteItemFileId);
    }
}
