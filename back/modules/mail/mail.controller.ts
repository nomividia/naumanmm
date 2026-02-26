import {
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { RolesList } from '../../../shared/shared-constants';
import { Environment } from '../../environment/environment';
import { GenericResponse } from '../../models/responses/generic-response';
import { RolesGuard } from '../../services/guards/roles-guard';
import { Roles } from '../../services/roles.decorator';
import { MailService } from '../../services/tools/mail.service';
import { BaseController } from '../../shared/base.controller';
import { MailRequest } from './mail-requests';
import { GetMailConfigResponse, SendTestEmailRequest } from './mail.dto';

@Controller('mail')
@ApiTags('mail')
export class MailController extends BaseController {
    constructor(private mailService: MailService) {
        super();
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.AdminTech)
    @Post('sendTestEmail')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'sendTestEmail', operationId: 'sendTestEmail' })
    @ApiResponse({
        status: 200,
        description: 'sendTestEmail',
        type: GenericResponse,
    })
    @HttpCode(200)
    async sendTestEmail(
        @Body() req: SendTestEmailRequest,
    ): Promise<GenericResponse> {
        if (!req?.recipients) {
            return new GenericResponse(
                false,
                'Vous devez renseigner une adresse e-mail (destinataire)',
            );
        }

        if (!req?.from) {
            return new GenericResponse(
                false,
                'Vous devez renseigner une adresse e-mail (expéditeur)',
            );
        }

        return await this.mailService.sendMailWithGenericTemplate({
            to: req?.recipients
                ?.split(',')
                .filter((x) => !!x)
                .map((x) => ({ address: x })),
            from: { address: req.from },
            subject: 'Email de test',
            htmlBody: 'Ceci est un e-mail de test',
        });
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.AdminTech)
    @ApiBearerAuth()
    @Get('getMailConfig')
    @ApiOperation({ summary: 'getMailConfig', operationId: 'getMailConfig' })
    @ApiResponse({
        status: 200,
        description: 'getMailConfig',
        type: GetMailConfigResponse,
    })
    @HttpCode(200)
    getMailConfig(): GetMailConfigResponse {
        const response = new GetMailConfigResponse();

        try {
            response.mailProvider = Environment.MailProvider;
            response.host = Environment.SmtpHost;
            response.username = Environment.SmtpUser;
            response.password = Environment.SmtpPassword;
            response.secure = Environment.SmtpSecure;
            response.port = Environment.SmtpPort;
            response.mailSender = Environment.MailSender;
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
    @ApiBearerAuth()
    @Post('sendMail')
    @ApiOperation({ summary: 'Send email', operationId: 'sendMail' })
    @ApiResponse({
        status: 200,
        description: 'Send by email',
        type: GenericResponse,
    })
    @HttpCode(200)
    async sendJobOfferByMail(
        @Body() request: MailRequest,
    ): Promise<GenericResponse> {
        return this.mailService.sendMail({
            to: [{ address: request.email }],
            htmlBody: request.content,
            subject: request.object,
            from: { address: request.sender },
        });
    }
}
