import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Query,
    Res,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { DateHelpers } from 'nextalys-js-helpers';
import { Like } from 'typeorm';
import { RolesList } from '../../shared/shared-constants';
import { AppType } from '../entities/app-type.entity';
import {
    AppTypeDto,
    FindAppTypesRequest,
    GetAppTypeRequest,
    GetAppTypeResponse,
    GetAppTypesResponse,
    GetTypeValuesRequest,
} from '../models/dto/app-type-dto';
import {
    AppValueDto,
    GetAppValueResponse,
    MultipleAppValuesRequest,
} from '../models/dto/app-value-dto';
import { BaseSearchRequest } from '../models/requests/base-search-requests';
import { GenericResponse } from '../models/responses/generic-response';
import { GetLanguagesResponse } from '../models/responses/languages-responses';
import { GetLogFileContentResponse } from '../models/responses/log-file.responses';
import { AuthToolsService } from '../services/auth-tools.service';
import { RolesGuard } from '../services/guards/roles-guard';
import { ReferentialService } from '../services/referential.service';
import { Roles } from '../services/roles.decorator';
import { AppLogger } from '../services/tools/logger.service';
import { BaseController } from '../shared/base.controller';

@Controller('referential')
@ApiTags('referential')
export class ReferentialController extends BaseController {
    constructor(
        private referentialService: ReferentialService,
        private appLogger: AppLogger,
        private readonly authToolsService: AuthToolsService,
    ) {
        super();
    }

    // @UseGuards(RolesGuard)
    // @ApiBearerAuth()
    @Get('getAppTypes')
    @ApiOperation({ summary: 'Get all types', operationId: 'getAppTypes' })
    @ApiResponse({
        status: 200,
        description: 'List of app types',
        type: GetAppTypesResponse,
    })
    @HttpCode(200)
    async getAppTypes(
        @Query() request: BaseSearchRequest,
    ): Promise<GetAppTypesResponse> {
        const findOptions =
            BaseSearchRequest.getDefaultFindOptions<AppType>(request);

        if (request.search) {
            findOptions.where = {
                label: Like('%' + request.search + '%'),
            };
        }

        return await this.referentialService.getAllAppTypes(findOptions);
    }

    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @Get('getOneAppType')
    @ApiOperation({ summary: 'Get App Type', operationId: 'getOneAppType' })
    @ApiResponse({
        status: 200,
        description: 'App Type',
        type: GetAppTypeResponse,
    })
    @HttpCode(200)
    async getOneAppType(
        @Query() request: GetAppTypeRequest,
    ): Promise<GetAppTypeResponse> {
        return await this.referentialService.getOneAppType(
            request.id,
            this.authToolsService.getCurrentPayload(false),
            request.includeDisabled === 'true',
        );
    }

    // @UseGuards(RolesGuard)
    // @ApiBearerAuth()
    @Get('getTypeValues')
    @ApiOperation({
        summary: 'Get values of a type',
        operationId: 'getTypeValues',
    })
    @ApiResponse({
        status: 200,
        description: 'List of type values',
        type: GetAppTypeResponse,
    })
    @HttpCode(200)
    async getTypeValues(
        @Query() request: GetTypeValuesRequest,
    ): Promise<GetAppTypeResponse> {
        return await this.referentialService.getTypeValues(request);
    }

    // @UseGuards(RolesGuard)
    // @ApiBearerAuth()
    @Get('getMultipleTypeValues')
    @ApiOperation({
        summary: 'Get values of a type',
        operationId: 'getMultipleTypeValues',
    })
    @ApiResponse({
        status: 200,
        description: 'List of type values',
        type: GetAppTypesResponse,
    })
    @HttpCode(200)
    async getMultipleTypeValues(
        @Query() request: FindAppTypesRequest,
    ): Promise<GetAppTypesResponse> {
        return await this.referentialService.getMultipleTypeValues(request);
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin)
    @ApiBearerAuth()
    @Post('insertOrUpdateAppValue')
    @ApiOperation({
        summary: 'insert or update App Value',
        operationId: 'insertOrUpdateAppValue',
    })
    @ApiResponse({
        status: 200,
        description: 'App Value',
        type: GetAppValueResponse,
    })
    @HttpCode(200)
    async insertOrUpdateAppValue(
        @Body() appValueDto: AppValueDto,
    ): Promise<GetAppValueResponse> {
        return await this.referentialService.insertOrUpdateAppValue(
            appValueDto,
        );
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin)
    @ApiBearerAuth()
    @Post('insertOrUpdateAppType')
    @ApiOperation({
        summary: 'insert or update App Type',
        operationId: 'insertOrUpdateAppType',
    })
    @ApiResponse({
        status: 200,
        description: 'App Type',
        type: GetAppTypeResponse,
    })
    @HttpCode(200)
    async insertOrUpdateAppType(
        @Body() appTypeDto: AppTypeDto,
    ): Promise<GetAppTypeResponse> {
        return await this.referentialService.insertOrUpdateAppType(
            appTypeDto,
            true,
            true,
        );
    }

    // @UseGuards(RolesGuard)
    // @ApiBearerAuth()
    @Get('getAllLanguages')
    @ApiOperation({
        summary: 'get All Languages',
        operationId: 'getAllLanguages',
    })
    @ApiResponse({
        status: 200,
        description: 'Languages',
        type: GetLanguagesResponse,
    })
    @HttpCode(200)
    async getAllLanguages(): Promise<GetLanguagesResponse> {
        return await this.referentialService.getAllLanguages();
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.AdminTech)
    @ApiBearerAuth()
    @Get('getLogFileContent')
    @ApiOperation({
        summary: 'get log file content',
        operationId: 'getLogFileContent',
    })
    @ApiResponse({
        status: 200,
        description: 'Log file content',
        type: GetLogFileContentResponse,
    })
    @HttpCode(200)
    async getLogFileContent(
        @Query('date') date: string,
        @Query('type') type: 'info' | 'warn' | 'error',
    ): Promise<GetLogFileContentResponse> {
        const response = new GetLogFileContentResponse();

        try {
            response.content = (await this.appLogger.getLogFileContent(
                date,
                type,
                true,
            )) as string;
            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.AdminTech)
    @ApiBearerAuth()
    @Get('downloadLogFile')
    @ApiOperation({
        summary: 'downloadLogFile',
        operationId: 'downloadLogFile',
    })
    @ApiResponse({ status: 200, description: 'downloadLogFile', type: Object })
    @HttpCode(200)
    async downloadLogFile(
        @Query('date') date: string,
        @Query('type') type: 'info' | 'warn' | 'error',
        @Query('dl') dl?: '0' | '1',
        @Res() res?: FastifyReply,
    ) {
        // console.log("Log ~ file: referential.controller.ts ~ line 145 ~ ReferentialController ~ date", date);
        // console.log("Log ~ file: referential.controller.ts ~ line 145 ~ ReferentialController ~ type", type);
        const response = new GenericResponse();

        try {
            if (!date || !type) {
                res.status(HttpStatus.NOT_FOUND).send('Fichier introuvable');
                return response;
            }

            const data = (await this.appLogger.getLogFileContent(
                date,
                type,
                false,
            )) as Buffer;
            const dateObj = DateHelpers.toUtcDate(
                DateHelpers.parseDateTimeFromISO8601Format(date),
            );
            const logFileName = this.appLogger.getLogFileName(
                dateObj,
                type,
                false,
            );
            // console.log("Log ~ file: referential.controller.ts ~ line 158 ~ ReferentialController ~ @Res ~ logFileName", logFileName);

            if (data) {
                res.header('Content-Type', 'text/plain');

                if (dl === '0') {
                    res.header(
                        'Content-Disposition',
                        `inline; filename="${logFileName}"`,
                    );
                } else {
                    //res.set('Content-Disposition', `attachment; filename="${pdfFileName}"`);
                    res.header(
                        'Content-Disposition',
                        `attachment; filename="${logFileName}"`,
                    );
                }

                res.status(HttpStatus.OK).send(data);
            } else {
                res.status(HttpStatus.NOT_FOUND).send('Fichier introuvable');
            }

            response.success = true;
        } catch (err) {
            response.handleError(err);
        }
        return response;
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.AdminTech)
    @ApiBearerAuth()
    @Post('removeLogFile')
    @ApiOperation({ summary: 'remove log file', operationId: 'removeLogFile' })
    @ApiResponse({
        status: 200,
        description: 'generic response',
        type: GenericResponse,
    })
    @HttpCode(200)
    async removeLogFile(
        @Query('date') date: string,
        @Query('type') type: 'info' | 'warn' | 'error',
    ): Promise<GenericResponse> {
        const response = new GenericResponse();

        try {
            await this.appLogger.removeLogFile(date, type);
            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin)
    @ApiBearerAuth()
    @Post('removeAppValues')
    @ApiOperation({
        summary: 'remove App Values',
        operationId: 'removeAppValues',
    })
    @ApiResponse({
        status: 200,
        description: 'generic response',
        type: GenericResponse,
    })
    @HttpCode(200)
    async removeAppValues(
        @Body() request: MultipleAppValuesRequest,
    ): Promise<GenericResponse> {
        let response = new GenericResponse();

        try {
            response = await this.referentialService.removeAppValues(
                request.ids,
                request.codes,
            );
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin)
    @ApiBearerAuth()
    @Post('disableAppValues')
    @ApiOperation({
        summary: 'disable App Values',
        operationId: 'disableAppValues',
    })
    @ApiResponse({
        status: 200,
        description: 'generic response',
        type: GenericResponse,
    })
    @HttpCode(200)
    async disableAppValues(
        @Body() request: MultipleAppValuesRequest,
    ): Promise<GenericResponse> {
        let response = new GenericResponse();

        try {
            response = await this.referentialService.disableAppValues(
                request.ids,
                request.codes,
            );
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.AdminTech)
    @ApiBearerAuth()
    @Post('deleteAppValues')
    @ApiOperation({
        summary: 'deleteAppValues',
        operationId: 'deleteAppValues',
    })
    @ApiResponse({
        status: 200,
        description: 'generic response',
        type: GenericResponse,
    })
    @HttpCode(200)
    async deleteAppValues(
        @Body() request: MultipleAppValuesRequest,
    ): Promise<GenericResponse> {
        let response = new GenericResponse();

        try {
            response = await this.referentialService.removeAppValues(
                request.ids,
                request.codes,
            );
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }
}
