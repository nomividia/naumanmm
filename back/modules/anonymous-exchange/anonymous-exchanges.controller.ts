import {
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    Post,
    Query,
    Res,
    UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { FindConditions } from 'typeorm';
import {
    CustomSocketEventType,
    RolesList,
} from '../../../shared/shared-constants';
import { AppErrorWithMessage } from '../../models/app-error';
import { AppFileDto } from '../../models/dto/app-file-dto';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { RolesGuard } from '../../services/guards/roles-guard';
import { Roles } from '../../services/roles.decorator';
import { BaseController } from '../../shared/base.controller';
import { SocketGateway } from '../../sockets/socket-gateway';
import {
    AnonymousExchangeDto,
    GetAnonymousExchangeForCandidateApplicationRequest,
    GetAnonymousExchangeForCandidateApplicationResponse,
    GetAnonymousExchangesForCandidateApplicationResponse,
} from './anonymous-exchange.dto';
import { AnonymousExchange } from './anonymous-exchange.entity';
import { AnonymousExchangesService } from './anonymous-exchanges.service';

@Controller('anonymous-exchanges')
@ApiTags('anonymous-exchanges')
export class AnonymousExchangesController extends BaseController {
    constructor(
        private readonly anonymousExchangeService: AnonymousExchangesService,
        private socketGateway: SocketGateway,
    ) {
        super();
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.RH,
        RolesList.AdminTech,
    )
    @Get('getAll')
    @ApiOperation({
        summary: 'Get all anonymous exchanges',
        operationId: 'getAllAnonymousExchanges',
    })
    @ApiResponse({
        status: 200,
        description: 'Get all anonymous exchanges response',
        type: GetAnonymousExchangesForCandidateApplicationResponse,
    })
    @HttpCode(200)
    async getAll(
        @Query() request: GetAnonymousExchangeForCandidateApplicationRequest,
    ): Promise<GetAnonymousExchangesForCandidateApplicationResponse> {
        const findOptions =
            BaseSearchRequest.getDefaultFindOptions<AnonymousExchange>(request);

        if (request.candidateApplicationId) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }
            if (request.candidateApplicationId) {
                for (const whereFilter of findOptions.where as FindConditions<AnonymousExchange>[]) {
                    whereFilter.candidateApplicationId =
                        request.candidateApplicationId;
                }
            }
        }

        if (!findOptions.order) {
            findOptions.order = { creationDate: 'ASC' };
        }

        return await this.anonymousExchangeService.findAll(findOptions);
    }

    @Post('createAnonymousExchange')
    @ApiOperation({
        summary: 'Create anonymous message',
        operationId: 'createAnonymousExchange',
    })
    @ApiResponse({
        status: 200,
        description: 'Create anonymous message',
        type: GetAnonymousExchangeForCandidateApplicationResponse,
    })
    @HttpCode(200)
    async createAnonymousExchange(
        @Body() anonymousExchangeDto: AnonymousExchangeDto,
    ): Promise<GetAnonymousExchangeForCandidateApplicationResponse> {
        if (!anonymousExchangeDto) {
            throw new AppErrorWithMessage('Invalid Request');
        }

        const filesToHandle: { file: AppFileDto; name: string }[] = [];

        if (anonymousExchangeDto.file) {
            filesToHandle.push({
                file: anonymousExchangeDto.file,
                name: 'shared-upload',
            });
        }

        const response = await this.anonymousExchangeService.createOrUpdate(
            anonymousExchangeDto,
        );

        if (filesToHandle?.length) {
            const handleFileResponse =
                await this.anonymousExchangeService.handleFileAndSaveExchange(
                    response.exchange,
                    filesToHandle,
                );

            if (!handleFileResponse.success) {
                throw new AppErrorWithMessage(handleFileResponse.message);
            }

            response.exchange = handleFileResponse.exchange;
        }

        if (response.success) {
            await this.socketGateway.sendEventToClient(
                CustomSocketEventType.NewAnonymousMessage,
                { data: anonymousExchangeDto.candidateApplicationId },
            );
        }

        return response;
    }

    @Get('getAnonymousExchangeFromApplicationId/:candidateApplicationId')
    @ApiOperation({
        summary: 'Get anonymous exchange from guid',
        operationId: 'getAnonymousExchangeFromApplicationId',
    })
    @ApiResponse({
        status: 200,
        description: 'Get anonymous exchange from guid',
        type: GetAnonymousExchangesForCandidateApplicationResponse,
    })
    @HttpCode(200)
    async getAnonymousExchangeFromApplicationId(
        @Param('candidateApplicationId') candidateApplicationId: string,
    ): Promise<GetAnonymousExchangesForCandidateApplicationResponse> {
        return await this.anonymousExchangeService.findAll({
            relations: ['candidateApplication'],
            where: { candidateApplicationId: candidateApplicationId },
            order: { creationDate: 'ASC' },
        });
    }

    @Post('sendNewAnonymousExchange')
    @ApiOperation({
        summary: 'Send new anonymous message',
        operationId: 'sendNewAnonymousExchange',
    })
    @ApiResponse({
        status: 200,
        description: 'Send new anonymous message',
        type: GetAnonymousExchangeForCandidateApplicationResponse,
    })
    @HttpCode(200)
    async sendNewCandidateMessage(
        @Body() anonymousExchangeDto: AnonymousExchangeDto,
    ): Promise<GetAnonymousExchangeForCandidateApplicationResponse> {
        if (!anonymousExchangeDto) {
            throw new AppErrorWithMessage('Invalid Request');
        }

        return await this.createAnonymousExchange(anonymousExchangeDto);
    }

    @Get('exchange-file')
    @ApiOperation({
        summary: 'get exchange pdf',
        operationId: 'getExchangePdf',
    })
    @ApiResponse({ status: 200, description: 'get exchange pdf', type: Object })
    @HttpCode(200)
    async servePdfFile(
        @Res() res: FastifyReply,
        @Query('fileId') fileId: string,
        @Query('exchangeGuid') exchangeGuid: string,
    ) {
        await this.anonymousExchangeService.serveFile(
            res,
            fileId,
            exchangeGuid,
        );
    }
}
