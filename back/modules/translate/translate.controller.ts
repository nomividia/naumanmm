import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { RolesList } from '../../../shared/shared-constants';
import { GenericResponse } from '../../models/responses/generic-response';
import { RolesGuard } from '../../services/guards/roles-guard';
import { Roles } from '../../services/roles.decorator';
import { TranslateService } from '../../services/translate-service';
import { BaseController } from '../../shared/base.controller';

@Controller('translate')
@ApiTags('translate')
export class TranslateController extends BaseController {
    constructor() {
        super();
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @ApiBearerAuth()
    @Post('getTranslation')
    @ApiOperation({ summary: 'Get Translation', operationId: 'getTranslation' })
    @ApiResponse({
        status: 200,
        description: 'Get Translation',
        type: GenericResponse,
    })
    @HttpCode(200)
    async getTranslation(@Body() request: string): Promise<any> {
        try {
            const translatedText = await TranslateService.getTranslation(
                request,
            );

            return translatedText.data;
        } catch (error) {
            console.error(error);
            return new GenericResponse(false, error.message);
        }
    }
}
