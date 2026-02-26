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
import { FindConditions, Like } from 'typeorm';
import {
    CandidateMessageSenderType,
    CustomSocketEventType,
    RolesList,
} from '../../../shared/shared-constants';
import { SharedService } from '../../../shared/shared-service';
import { AppErrorWithMessage } from '../../models/app-error';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { GenericResponse } from '../../models/responses/generic-response';
import { AuthToolsService } from '../../services/auth-tools.service';
import { RolesGuard } from '../../services/guards/roles-guard';
import { Roles } from '../../services/roles.decorator';
import { BaseController } from '../../shared/base.controller';
import { SocketGateway } from '../../sockets/socket-gateway';
import {
    GetCandidatesForMessageResponse,
    GetUnseenMessagesCountResponse,
} from '../candidates/candidate-dto';
import {
    CandidateMessageDto,
    GetCandidateMessageResponse,
    GetCandidateMessagesRequest,
    GetCandidateMessagesResponse,
    GetConsultantMessagesRequest,
} from './candidate-message-dto';
import { CandidateMessage } from './candidate-message.entity';
import { CandidateMessagesService } from './candidate-messages.service';

@Controller('candidate-messages')
@ApiTags('candidate-messages')
export class CandidateMessagesController extends BaseController {
    constructor(
        private readonly candidateMessagesService: CandidateMessagesService,
        private authToolsService: AuthToolsService,
        private socketGateway: SocketGateway,
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
        summary: 'Get all candidate messages',
        operationId: 'getAllCandidateMessages',
    })
    @ApiResponse({
        status: 200,
        description: 'Get all candidate messages',
        type: GetCandidateMessagesResponse,
    })
    @HttpCode(200)
    async getAll(
        @Query() request: GetCandidateMessagesRequest,
    ): Promise<GetCandidateMessagesResponse> {
        const payload = this.authToolsService.getCurrentPayload(false);

        if (!payload) {
            throw new AppErrorWithMessage('Invalid input');
        }

        const findOptions =
            BaseSearchRequest.getDefaultFindOptions<CandidateMessage>(request);

        if (request.search) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            findOptions.where = [
                {
                    content: Like('%' + request.search + '%'),
                },
            ];
        }

        if (request.candidateId) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            if (request.candidateId) {
                for (const whereFilter of findOptions.where as FindConditions<CandidateMessage>[]) {
                    whereFilter.candidateId = request.candidateId;
                }
            }
        }

        if (!findOptions.order) {
            findOptions.order = { creationDate: 'ASC' };
        }

        const response = await this.candidateMessagesService.findAll(
            findOptions,
        );

        const unSeenCandidateMessages = response.candidateMessages.filter(
            (x) => !x.seen && x.senderId !== payload.id,
        );

        await this.p_setCandidatesMessagesToSeen(unSeenCandidateMessages);

        const unseenMessagesResponse = await this.getUnSeenMessagesCount();

        if (unseenMessagesResponse.success) {
            response.unSeenMessagesCount =
                unseenMessagesResponse.unSeenMessagesCount;
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
    @ApiOperation({
        summary: 'Get candidate message',
        operationId: 'getCandidateMessage',
    })
    @ApiResponse({
        status: 200,
        description: 'Get candidate message',
        type: GetCandidateMessageResponse,
    })
    @HttpCode(200)
    async get(@Param('id') id: string): Promise<GetCandidateMessageResponse> {
        return await this.candidateMessagesService.findOne({
            where: { id: id },
        });
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
        summary: 'Create or update candidate message',
        operationId: 'createOrUpdateCandidateMessage',
    })
    @ApiResponse({
        status: 200,
        description: 'Create or update candidate message',
        type: GetCandidateMessageResponse,
    })
    @HttpCode(200)
    async createOrUpdate(
        @Body() candidateMessageDto: CandidateMessageDto,
    ): Promise<GetCandidateMessageResponse> {
        if (!candidateMessageDto) {
            throw new AppErrorWithMessage('Invalid Request');
        }

        const response = await this.candidateMessagesService.createOrUpdate(
            candidateMessageDto,
        );

        if (response.success) {
            await this.socketGateway.sendEventToClient(
                CustomSocketEventType.NewCandidateMessage,
                { data: candidateMessageDto.candidateId },
            );
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
        summary: 'Delete candidate messages',
        operationId: 'deleteCandidateMessages',
    })
    @ApiResponse({
        status: 200,
        description: 'Delete candidate messages',
        type: GenericResponse,
    })
    @HttpCode(200)
    async delete(@Param('ids') ids: string): Promise<GenericResponse> {
        return await this.candidateMessagesService.delete(ids.split(','));
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @ApiBearerAuth()
    @Post('archive')
    @ApiOperation({
        summary: 'Archive candidate messages',
        operationId: 'archiveCandidateMessages',
    })
    @ApiResponse({
        status: 200,
        description: 'Archive candidate messages',
        type: GenericResponse,
    })
    @HttpCode(200)
    async archive(@Body() ids: string[]): Promise<GenericResponse> {
        return await this.candidateMessagesService.archive(ids);
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Candidate)
    @ApiBearerAuth()
    @Get('getMyCandidateMessages')
    @ApiOperation({
        summary: 'Get candidate messages of the current candidate',
        operationId: 'getMyCandidateMessages',
    })
    @ApiResponse({
        status: 200,
        description: 'Get candidate messages of the current candidate',
        type: GetCandidateMessagesResponse,
    })
    @HttpCode(200)
    async getMyCandidateMessages(): Promise<GetCandidateMessagesResponse> {
        const payload = this.authToolsService.getCurrentPayload(false);

        if (!payload?.candidateId) {
            throw new AppErrorWithMessage('Invalid input');
        }

        const response = await this.getAll({
            candidateId: payload.candidateId,
        });
        const unSeenCandidateMessages = response.candidateMessages.filter(
            (x) => !x.seen && x.senderId !== payload.id,
        );

        await this.p_setCandidatesMessagesToSeen(unSeenCandidateMessages);

        return response;
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Candidate,
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Post('sendNewCandidateMessage')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Send new candidate message',
        operationId: 'sendNewCandidateMessage',
    })
    @ApiResponse({
        status: 200,
        description: 'Send new candidate message',
        type: GetCandidateMessageResponse,
    })
    @HttpCode(200)
    async sendNewCandidateMessage(
        @Body() candidateMessageDto: CandidateMessageDto,
    ): Promise<GetCandidateMessageResponse> {
        const payload = this.authToolsService.getCurrentPayload(false);

        if (!payload) {
            throw new AppErrorWithMessage('Invalid input');
        }

        if (!candidateMessageDto) {
            throw new AppErrorWithMessage('Invalid Request');
        }

        return await this.createOrUpdate(candidateMessageDto);
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin, RolesList.Consultant, RolesList.AdminTech)
    @Post('setCandidatesMessagesToSeen/:candidateId')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'setCandidatesMessagesToSeen',
        operationId: 'setCandidatesMessagesToSeen',
    })
    @ApiResponse({
        status: 200,
        description: 'setCandidatesMessagesToSeen',
        type: GetUnseenMessagesCountResponse,
    })
    @HttpCode(200)
    async setCandidatesMessagesToSeen(
        @Param('candidateId') candidateId: string,
    ): Promise<GetUnseenMessagesCountResponse> {
        let response = new GetUnseenMessagesCountResponse();

        try {
            if (!candidateId) {
                throw new AppErrorWithMessage('Invalid request');
            }

            await this.candidateMessagesService
                .getRepository()
                .update({ id: candidateId, seen: false }, { seen: true });

            response = await this.getUnSeenMessagesCount();
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    private async p_setCandidatesMessagesToSeen(
        unSeenCandidateMessages: CandidateMessageDto[],
    ) {
        for (const item of unSeenCandidateMessages) {
            item.seen = true;
        }

        await this.candidateMessagesService.repository.save(
            unSeenCandidateMessages,
        );
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Get('getCandidatesForMessaging')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get candidates for messaging',
        operationId: 'getCandidatesForMessaging',
    })
    @ApiResponse({
        status: 200,
        description: 'Get candidates for messaging',
        type: GetCandidatesForMessageResponse,
    })
    @HttpCode(200)
    async getCandidatesForMessaging(
        @Query() request: GetConsultantMessagesRequest,
    ): Promise<GetCandidatesForMessageResponse> {
        return await this.candidateMessagesService.getCandidateForMessaging(
            request.consultantId,
        );
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Candidate,
        RolesList.Consultant,
        RolesList.Admin,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Get('getUnSeenMessagesCount')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get unseen candidate message count',
        operationId: 'getUnSeenMessagesCount',
    })
    @ApiResponse({
        status: 200,
        description: 'Get candidates for messaging',
        type: GetUnseenMessagesCountResponse,
    })
    @HttpCode(200)
    async getUnSeenMessagesCount(): Promise<GetUnseenMessagesCountResponse> {
        const response = new GetUnseenMessagesCountResponse();

        try {
            const payload = this.authToolsService.getCurrentPayload(false);
            const where: FindConditions<CandidateMessage> = { seen: false };

            if (
                SharedService.userIsConsultant(payload) ||
                SharedService.userIsAdmin(payload) ||
                SharedService.userIsAdminTech(payload)
            ) {
                where.senderType = CandidateMessageSenderType.Candidate;
            } else if (SharedService.userIsCandidate(payload)) {
                where.senderType = CandidateMessageSenderType.Consultant;
                where.candidateId = payload.candidateId;
            } else {
                throw new AppErrorWithMessage('Forbidden');
            }

            response.unSeenMessagesCount =
                await this.candidateMessagesService.repository.count({
                    where: where,
                });

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
    @Post('archiveAllCandidateMessages/:candidateId')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'archive candidate messages',
        operationId: 'archiveAllCandidateMessages',
    })
    @ApiResponse({
        status: 200,
        description: 'archive candidate messages',
        type: GenericResponse,
    })
    @HttpCode(200)
    async archiveAllCandidateMessages(
        @Param('candidateId') candidateId: string,
    ): Promise<GenericResponse> {
        const response = new GenericResponse();

        try {
            const archiveMessagesResponse =
                await this.candidateMessagesService.archiveOrRemoveAllCandidateMessage(
                    candidateId,
                    false,
                );

            if (archiveMessagesResponse.success) {
                response.success = true;
            }
        } catch (err) {
            throw new AppErrorWithMessage(err);
        }

        return response;
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.AdminTech)
    @Post('deleteAllCandidateMessages/:candidateId')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'delete candidate messages',
        operationId: 'deleteAllCandidateMessages',
    })
    @ApiResponse({
        status: 200,
        description: 'delete candidate messages',
        type: GenericResponse,
    })
    @HttpCode(200)
    async deleteAllCandidateMessages(
        @Param('candidateId') candidateId: string,
    ): Promise<GenericResponse> {
        const response = new GenericResponse();

        try {
            const deleteMessagesResponse =
                await this.candidateMessagesService.archiveOrRemoveAllCandidateMessage(
                    candidateId,
                    true,
                );
            if (deleteMessagesResponse.success) {
                response.success = true;
            }
        } catch (err) {
            throw new AppErrorWithMessage(err);
        }

        return response;
    }
}
