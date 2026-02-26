import { GenericResponse } from '../../models/responses/generic-response';
import { MailService } from '../../services/tools/mail.service';
import { BaseController } from '../../shared/base.controller';
import { MailRequest } from './mail-requests';
import { GetMailConfigResponse, SendTestEmailRequest } from './mail.dto';
export declare class MailController extends BaseController {
    private mailService;
    constructor(mailService: MailService);
    sendTestEmail(req: SendTestEmailRequest): Promise<GenericResponse>;
    getMailConfig(): GetMailConfigResponse;
    sendJobOfferByMail(request: MailRequest): Promise<GenericResponse>;
}
