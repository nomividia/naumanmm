import { EmailData, EmailDataNewsletter } from 'nextalys-node-helpers';
import { SendInBlueNewsletterReportMail } from 'nextalys-node-helpers/dist/helpers/sendinblue/sendinblue-shared-types';
import { HandleBarsHelperType } from 'nextalys-node-helpers/dist/html-helpers';
import { GenericResponse, GenericResponseWithData } from '../../models/responses/generic-response';
import { SendNewsletterResponse } from '../../shared/types';
import { ApplicationBaseService } from '../base-service';
export interface SibAccountData {
    plan: {
        type: 'subscription' | 'payAsYouGo' | 'sms';
        credits: number;
        startDate?: string;
        endDate?: string;
    }[];
    email: string;
    relay?: any;
}
export interface EmailDataWithTemplate extends EmailData {
    templateName?: string;
    templateValues?: any;
    useHandleBars?: boolean;
    handleBarsHelpers?: HandleBarsHelperType[];
    compileMjmlTemplate?: boolean;
}
export interface EmailDataNewsletterWithTemplate extends EmailDataNewsletter {
    templateName?: string;
    templateValues?: any;
    useHandleBars?: boolean;
    handleBarsHelpers?: HandleBarsHelperType[];
    compileMjmlTemplate?: boolean;
    folder?: string;
}
export declare class MailService extends ApplicationBaseService {
    private isMailtrapProvider;
    private isMailhogProvider;
    constructor();
    private getMailProvider;
    private prepareEmailData;
    sendMailWithGenericTemplate(emailData: EmailDataWithTemplate): Promise<GenericResponse>;
    prepareMail(emailData: EmailDataWithTemplate): Promise<GenericResponse>;
    private canSendMail;
    sendMail(emailData: EmailDataWithTemplate): Promise<GenericResponse>;
    sendNewsletter(emailData: EmailDataNewsletterWithTemplate): Promise<SendNewsletterResponse>;
    sendExistingNewsletter(newsletterId: string): Promise<GenericResponse>;
    createNewsletterList(emailData: EmailDataNewsletterWithTemplate): Promise<SendNewsletterResponse>;
    sendNewsletterWithListId(emailData: EmailDataNewsletterWithTemplate, listId: string): Promise<SendNewsletterResponse>;
    getNewsletter(newsletterId: string): Promise<GenericResponseWithData<SendInBlueNewsletterReportMail>>;
    getSibAccountData(): Promise<GenericResponseWithData<SibAccountData>>;
    deleteBrevoContact(email: string): Promise<GenericResponse>;
}
