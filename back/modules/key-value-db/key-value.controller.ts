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
import { RolesList } from '../../../shared/shared-constants';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { GenericResponse } from '../../models/responses/generic-response';
import { RolesGuard } from '../../services/guards/roles-guard';
import { Roles } from '../../services/roles.decorator';
import { BaseController } from '../../shared/base.controller';
import {
    GetKeyValueResponse,
    GetKeyValuesRequest,
    GetKeyValuesResponse,
    KeyValueDto,
} from './key-value-dto';
import { KeyValue } from './key-value.entity';
import { KeyValueService } from './key-value.service';

@Controller('key-value')
@ApiTags('key-value')
export class KeyValueController extends BaseController {
    constructor(private keyValueService: KeyValueService) {
        super();
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.AdminTech)
    @Get()
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get all key values',
        operationId: 'getKeyValues',
    })
    @ApiResponse({
        status: 200,
        description: 'Get Key Values',
        type: GetKeyValuesResponse,
    })
    @HttpCode(200)
    async getAll(
        @Query() request: GetKeyValuesRequest,
    ): Promise<GetKeyValuesResponse> {
        if (request.keys) {
            const response = new GetKeyValuesResponse(true);
            response.keyValues =
                await this.keyValueService.getMultipleKeyValues(
                    request.keys.split(','),
                );
            return response;
        }

        let query = BaseSearchRequest.getDefaultFindOptionsLinq<KeyValue>(
            request,
            KeyValue,
        );

        if (request.search) {
            query = query.where((x) => x.key).contains(request.search);
        }

        if (request.onlyFrontEditable === 'true') {
            query = query.where((x) => x.frontEditable).equal(true);
        }

        return await this.keyValueService.findAll({ query });
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.AdminTech)
    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'saveKeyValue', operationId: 'saveKeyValue' })
    @ApiResponse({
        status: 200,
        description: 'GetKeyValueResponse',
        type: GetKeyValueResponse,
    })
    @HttpCode(200)
    async saveKeyValue(@Body() dto: KeyValueDto): Promise<GetKeyValueResponse> {
        return await this.keyValueService.createOrUpdate(dto);
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.AdminTech)
    @Delete(':ids')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'deleteKeyValues',
        operationId: 'deleteKeyValues',
    })
    @ApiResponse({
        status: 200,
        description: 'GenericResponse',
        type: GenericResponse,
    })
    @HttpCode(200)
    async deleteKeyValues(@Param('ids') ids: string): Promise<GenericResponse> {
        return await this.keyValueService.delete(ids.split(','));
    }
}
