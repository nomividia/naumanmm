import { SendInBlueNewsletterReportSms } from 'nextalys-node-helpers/dist/helpers/sendinblue/sendinblue-shared-types';
import { SMSData, SMSDataNewsletter } from 'nextalys-node-helpers/dist/sms-helpers';
import { GenericResponse, GenericResponseWithData } from '../../models/responses/generic-response';
import { ApplicationBaseService } from '../../services/base-service';
import { SendNewsletterResponse } from '../../shared/types';
export declare class SmsService extends ApplicationBaseService {
    constructor();
    private canSendSms;
    private prepareData;
    private getProvider;
    sendSms(data: SMSData): Promise<GenericResponse>;
    sendNewsletter(data: SMSDataNewsletter): Promise<GenericResponse>;
    sendNewsletterWithListId(data: SMSDataNewsletter, listId: string): Promise<SendNewsletterResponse>;
    createNewsletterList(data: SMSDataNewsletter): Promise<SendNewsletterResponse>;
    getNewsletter(newsletterId: string): Promise<GenericResponseWithData<SendInBlueNewsletterReportSms>>;
}
