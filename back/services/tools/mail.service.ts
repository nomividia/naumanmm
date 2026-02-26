import { Injectable } from '@nestjs/common';
import { MainHelpers } from 'nextalys-js-helpers';
import {
    BaseMailProvider,
    EmailData,
    EmailDataNewsletter,
    FileHelpers,
    GetDataResponse,
    NextalysNodeHttpClient,
    SendInBlueMailProvider,
    SmtpMailProvider,
} from 'nextalys-node-helpers';
import { SendInBlueNewsletterReportMail } from 'nextalys-node-helpers/dist/helpers/sendinblue/sendinblue-shared-types';
import {
    HandleBarsHelperType,
    HtmlHelpers,
} from 'nextalys-node-helpers/dist/html-helpers';
import { MailTemplateHelpers } from 'nextalys-node-helpers/dist/mail-template-helpers';
import * as path from 'path';
import {
    AppDirectories,
    defaultAppLanguage,
} from '../../../shared/shared-constants';
import { Environment } from '../../environment/environment';
import { AppError } from '../../models/app-error';
import {
    GenericResponse,
    GenericResponseWithData,
} from '../../models/responses/generic-response';
import { SendNewsletterResponse } from '../../shared/types';
import { ApplicationBaseService } from '../base-service';
import { ApiMainHelpers } from './helpers.service';
import { AppLogger } from './logger.service';

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
    /**
     * template to use (optional)
     */
    templateName?: string;
    /**
     * template values (optional)
     */
    templateValues?: any;

    useHandleBars?: boolean;
    handleBarsHelpers?: HandleBarsHelperType[];
    compileMjmlTemplate?: boolean;
}

export interface EmailDataNewsletterWithTemplate extends EmailDataNewsletter {
    /**
     * template to use (optional)
     */
    templateName?: string;
    /**
     * template values (optional)
     */
    templateValues?: any;
    useHandleBars?: boolean;
    handleBarsHelpers?: HandleBarsHelperType[];
    compileMjmlTemplate?: boolean;
    folder?: string;
}

@Injectable()
export class MailService extends ApplicationBaseService {
    private isMailtrapProvider = false;
    private isMailhogProvider = false;

    constructor() {
        super();
        this.isMailtrapProvider = Environment.SmtpHost === 'smtp.mailtrap.io';
        this.isMailhogProvider =
            Environment.SmtpHost === 'localhost' &&
            Environment.SmtpPort === 1025;
    }

    private getMailProvider(): BaseMailProvider {
        if (
            Environment.SendInBlueApiKey &&
            Environment.MailProvider === 'SendInBlue'
        ) {
            this.isMailtrapProvider = false;
            return new SendInBlueMailProvider({
                sendInBlueApiKey: Environment.SendInBlueApiKey,
                debug: true,
            });
        }
        this.isMailtrapProvider = Environment.SmtpHost === 'smtp.mailtrap.io';
        this.isMailhogProvider =
            Environment.SmtpHost === 'localhost' &&
            Environment.SmtpPort === 1025;

        return new SmtpMailProvider({
            smtpServer: Environment.SmtpHost,
            smtpPort: Environment.SmtpPort,
            smtpUser: Environment.SmtpUser,
            smtpPassword: Environment.SmtpPassword,
            secure: Environment.SmtpSecure,
        });
    }

    private async prepareEmailData(emailData: EmailDataWithTemplate) {
        if (!emailData.templateName) return;
        if (emailData.templateName === 'mail_auto') {
            emailData.useHandleBars = true;
        }
        const htmlTemplatePathBase = path.join(
            Environment.ApiBasePath,
            Environment.HtmlTemplatesFolderName,
        );
        const fullPath = path.join(
            htmlTemplatePathBase,
            emailData.templateName + '.html',
        );
        const templateContent = (await FileHelpers.readFile(
            fullPath,
            true,
        )) as string;
        if (!templateContent) {
            throw new Error(
                'Cannot find template ' + fullPath + ' or template is empty !',
            );
        }
        if (!emailData.templateValues) {
            emailData.templateValues = {};
        }
        // if (!emailData.templateValues) {
        //     emailData.templateValues = {};
        //     emailData.htmlBody = MainHelpers.replaceAll(templateContent, '{{MAIL_BODY}}', emailData.htmlBody);
        //     emailData.htmlBody = MainHelpers.replaceAll(emailData.htmlBody, '{{SITE_BASE_URL}}', Environment.BaseURL);
        // }
        if (!emailData.htmlBody) {
            emailData.htmlBody = '';
        }
        if (emailData.templateValues.MAIL_BODY == null) {
            emailData.templateValues.MAIL_BODY = emailData.htmlBody;
        }
        if (emailData.templateValues.SITE_BASE_URL == null) {
            emailData.templateValues.SITE_BASE_URL = Environment.BaseURL;
        }
        if (emailData.templateValues.language == null) {
            emailData.templateValues.language = defaultAppLanguage;
        }
        if (emailData.useHandleBars) {
            if (!emailData.handleBarsHelpers) emailData.handleBarsHelpers = [];
            if (!emailData.handleBarsHelpers?.some((x) => x === 'ifEquals')) {
                emailData.handleBarsHelpers.push('ifEquals');
            }
            if (emailData.handleBarsHelpers?.length) {
                HtmlHelpers.registerHandleBarsHelpers(
                    emailData.handleBarsHelpers,
                );
            }
            emailData.htmlBody =
                await HtmlHelpers.fillHtmlFromHtmlTemplateString(
                    templateContent,
                    emailData.templateValues,
                    null,
                    true,
                );
        } else {
            let htmlBody = templateContent;
            for (const key in emailData.templateValues) {
                if (
                    Object.prototype.hasOwnProperty.call(
                        emailData.templateValues,
                        key,
                    )
                ) {
                    const templateValue = emailData.templateValues[key];
                    htmlBody = MainHelpers.replaceAll(
                        htmlBody,
                        '{{' + key + '}}',
                        templateValue,
                    );
                }
            }
            emailData.htmlBody = htmlBody;
        }

        if (emailData.compileMjmlTemplate) {
            const compileResult = await MailTemplateHelpers.compileMjmlToHtml({
                inputString: emailData.htmlBody,
                // beautify: true,
            });
            if (!compileResult.errors?.length) {
                emailData.htmlBody = compileResult.html;
            }
        }
    }

    public async sendMailWithGenericTemplate(
        emailData: EmailDataWithTemplate,
    ): Promise<GenericResponse> {
        const emailDataClone = MainHelpers.cloneObject(emailData);
        emailDataClone.templateName = 'generic-mail.mjml';
        emailDataClone.useHandleBars = true;
        emailDataClone.compileMjmlTemplate = true;
        return await this.sendMail(emailDataClone);
    }

    public async prepareMail(emailData: EmailDataWithTemplate) {
        const response = new GenericResponse();
        try {
            await this.prepareEmailData(emailData);
            response.message = emailData.htmlBody;
            response.success = true;
        } catch (err) {
            response.handleError(err);
        }
        return response;
    }

    private canSendMail() {
        if (this.isMailhogProvider) return true;
        if (Environment.IgnoreAllMailSending) return false;
        if (!this.isMailtrapProvider && Environment.EnvName !== 'production') {
            return false;
        }
        return true;
    }

    public async sendMail(
        emailData: EmailDataWithTemplate,
    ): Promise<GenericResponse> {
        const response = new GenericResponse();
        try {
            if (!this.canSendMail()) return new GenericResponse(true);
            await this.prepareEmailData(emailData);
            const sendMailResponse = await this.getMailProvider().sendMail(
                emailData,
            );
            response.success = sendMailResponse.success;
            if (!response.success) {
                const errorDetails = {
                    error: sendMailResponse.error,
                    to: emailData.to?.map((t) => t.address),
                    from: emailData.from?.address,
                    subject: emailData.subject,
                    templateName: emailData.templateName,
                };
                await AppLogger.error(
                    'Unable to send mail',
                    errorDetails,
                );
                // Propagate error details to caller
                response.message = sendMailResponse.error?.message
                    || sendMailResponse.error?.toString()
                    || 'Unknown mail sending error';
            }
        } catch (err) {
            response.handleError(err);
        }
        return response;
    }

    public async sendNewsletter(
        emailData: EmailDataNewsletterWithTemplate,
    ): Promise<SendNewsletterResponse> {
        const response = new SendNewsletterResponse();
        try {
            if (!this.canSendMail()) return new SendNewsletterResponse(true);
            await this.prepareEmailData(emailData);
            const sendNewsletterResponse =
                await this.getMailProvider().sendNewsletter(emailData);
            response.success = sendNewsletterResponse.success;
            await AppLogger.log(
                'sendNewsletter response - success = ' +
                    sendNewsletterResponse.success,
                sendNewsletterResponse.data,
            );
            response.newsletterId = sendNewsletterResponse?.data?.newsletterId;
            response.listId = sendNewsletterResponse?.data?.listId;
            if (!response.success) {
                await AppLogger.loggerInstance.error(
                    'Unable to send newsletter',
                    sendNewsletterResponse.error,
                );
            }
        } catch (err) {
            response.handleError(err);
        }
        return response;
    }

    public async sendExistingNewsletter(
        newsletterId: string,
    ): Promise<GenericResponse> {
        const response = new GenericResponse();
        try {
            if (!this.canSendMail()) return new GenericResponse(true);
            const sendNewsletterResponse =
                await this.getMailProvider().sendExistingNewsletter(
                    newsletterId,
                );
            response.success = sendNewsletterResponse.success;
            await AppLogger.log(
                'sendExistingNewsletter response - success = ' +
                    sendNewsletterResponse.success,
            );
            if (!response.success) {
                await AppLogger.loggerInstance.error(
                    'Unable to send existing newsletter',
                    sendNewsletterResponse.error,
                );
            }
        } catch (err) {
            response.handleError(err);
        }
        return response;
    }

    public async createNewsletterList(
        emailData: EmailDataNewsletterWithTemplate,
    ): Promise<SendNewsletterResponse> {
        const response = new SendNewsletterResponse();
        try {
            if (!this.canSendMail()) return new SendNewsletterResponse(true);
            if (emailData?.sendWithFileUrl) {
                emailData.format = 'json';
                const contactsFileName = MainHelpers.generateGuid() + '.json';
                const contactsFileUrl =
                    Environment.BaseURL +
                    '/' +
                    AppDirectories.Uploads +
                    '/' +
                    AppDirectories.Temp +
                    '/' +
                    contactsFileName;
                const importContactsBody =
                    this.getMailProvider().createImportContactBody({
                        to: emailData.to,
                        fileUrl: contactsFileUrl,
                        folder: 631 as unknown as string, // emailData.newsLetterListFolder,
                        format: emailData.format,
                        name: emailData.newsLetterName,
                    });
                await ApiMainHelpers.saveFileInPublicTempFolder(
                    contactsFileName,
                    importContactsBody,
                );
                emailData.fileUrl = contactsFileUrl;
            }

            emailData.newsLetterListFolder = 631 as unknown as string; // emailData.newsLetterListFolder,
            const newsletterResponse =
                await this.getMailProvider().createNewsletterList(emailData);
            response.success = newsletterResponse.success;
            response.listId = newsletterResponse?.data?.listId;
            await AppLogger.log(
                'mail service - createNewsletterList response - success = ' +
                    newsletterResponse.success,
            );
            if (!response.success) {
                await AppLogger.loggerInstance.error(
                    'mail service - Unable to create newsletter list',
                    newsletterResponse.error,
                );
            }
        } catch (err) {
            response.handleError(err);
        }
        return response;
    }

    public async sendNewsletterWithListId(
        emailData: EmailDataNewsletterWithTemplate,
        listId: string,
    ): Promise<SendNewsletterResponse> {
        const response = new SendNewsletterResponse();
        try {
            if (!this.canSendMail()) return new SendNewsletterResponse(true);
            await this.prepareEmailData(emailData);
            const newsletterResponse =
                await this.getMailProvider().sendNewsletterWithListId(
                    emailData,
                    listId,
                );
            response.success = newsletterResponse.success;
            response.listId = newsletterResponse.data?.listId;
            response.newsletterId = newsletterResponse.data?.newsletterId;

            await AppLogger.log(
                'mail service - sendNewsletterWithListId response - success = ' +
                    newsletterResponse.success,
            );
            if (!response.success) {
                await AppLogger.loggerInstance.error(
                    'mail service - Unable to send newsletter',
                    newsletterResponse.error,
                );
            }
        } catch (err) {
            response.handleError(err);
        }
        return response;
    }

    public async getNewsletter(
        newsletterId: string,
    ): Promise<GenericResponseWithData<SendInBlueNewsletterReportMail>> {
        const response =
            new GenericResponseWithData<SendInBlueNewsletterReportMail>();
        try {
            const newsletterResponse: GetDataResponse<SendInBlueNewsletterReportMail> =
                await this.getMailProvider().getNewsletter(newsletterId);
            // await AppLogger.log('mail service - newsletterResponse response', newsletterResponse);
            response.success = newsletterResponse.success;
            response.data = newsletterResponse.data;
            response.error = newsletterResponse.error;
        } catch (err) {
            response.handleError(err);
        }
        return response;
    }

    public async getSibAccountData() {
        const response = new GenericResponseWithData<SibAccountData>();
        try {
            if (!Environment.SendInBlueApiKey) {
                throw new AppError('No SIB Api key !');
            }
            const client = new NextalysNodeHttpClient();
            const httpResponse = await client.request<any, SibAccountData>(
                'https://api.sendinblue.com/v3/account',
                'get',
                null,
                true,
                { 'api-key': Environment.SendInBlueApiKey },
            );
            response.data = httpResponse.data;
            response.success = true;
        } catch (err) {
            response.handleError(err);
        }
        return response;
    }

    /**
     * Delete a contact from Brevo (SendInBlue) by email address.
     * This is useful for GDPR compliance when deleting candidate records.
     * @param email The email address of the contact to delete
     * @returns GenericResponse indicating success or failure
     */
    public async deleteBrevoContact(email: string): Promise<GenericResponse> {
        const response = new GenericResponse();
        try {
            if (!Environment.SendInBlueApiKey) {
                // No API key configured, skip silently
                response.success = true;
                return response;
            }
            if (!email) {
                response.success = true;
                return response;
            }
            const client = new NextalysNodeHttpClient();
            const encodedEmail = encodeURIComponent(email);
            await client.request<any, void>(
                `https://api.brevo.com/v3/contacts/${encodedEmail}`,
                'delete',
                null,
                true,
                { 'api-key': Environment.SendInBlueApiKey },
            );
            response.success = true;
            await AppLogger.log(
                `Brevo contact deleted successfully: ${email}`,
            );
        } catch (err: any) {
            // If the contact doesn't exist in Brevo (404), treat as success
            if (err?.response?.status === 404 || err?.statusCode === 404) {
                response.success = true;
                await AppLogger.log(
                    `Brevo contact not found (already deleted or never existed): ${email}`,
                );
            } else {
                // Log the error but don't fail the entire delete operation
                await AppLogger.error(
                    `Failed to delete Brevo contact: ${email}`,
                    err,
                );
                response.success = false;
                response.message = err?.message || 'Failed to delete Brevo contact';
            }
        }
        return response;
    }
}
