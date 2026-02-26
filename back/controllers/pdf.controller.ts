import {
    Controller,
    Get,
    Header,
    HttpCode,
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
import { RolesList } from '../../shared/shared-constants';
import { GenericResponse } from '../models/responses/generic-response';
import { RolesGuard } from '../services/guards/roles-guard';
import { Roles } from '../services/roles.decorator';
import { PdfService } from '../services/tools/pdf.service';
import { BaseController } from '../shared/base.controller';

@Controller('pdf')
@ApiTags('pdf')
export class PdfController extends BaseController {
    constructor(private readonly pdfService: PdfService) {
        super();
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin)
    @Post('generate-pdf')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'generate pdf', operationId: 'generate-pdf' })
    @ApiResponse({
        status: 200,
        description: 'generate pdf',
        type: GenericResponse,
    })
    @HttpCode(200)
    async generatePdfTest(): Promise<GenericResponse> {
        const services = [
            { name: 'service1', qty: 3, price: 10 },
            { name: 'service2', qty: 5, price: 20 },
            { name: 'service3', qty: 7, price: 15 },
        ];
        const pdfResponse = await this.pdfService.generatePdf(
            'devis.html',
            'test.pdf',
            { firstName: 'prénom', lastName: 'nom', services: services },
        );

        delete pdfResponse.fullLocalPath;

        return pdfResponse;
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin)
    @Get('pdf')
    @ApiBearerAuth()
    @Header('Content-Type', 'application/pdf')
    @ApiOperation({ summary: 'get pdf', operationId: 'getPdf' })
    @ApiResponse({ status: 200, description: 'get pdf', type: Object })
    @HttpCode(200)
    async servePdfFile(
        @Res() res: FastifyReply,
        @Query('pdfFile') pdfFile: string,
        @Query('fileName') fileName?: string,
    ) {
        await this.pdfService.servePdfFile(pdfFile, res, fileName);
    }
}
