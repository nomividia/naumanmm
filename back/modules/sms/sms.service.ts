import { Injectable } from '@nestjs/common';
import { SendInBlueNewsletterReportSms } from 'nextalys-node-helpers/dist/helpers/sendinblue/sendinblue-shared-types';
import {
    BaseSmsProvider,
    GetDataResponse,
    SendInBlueSmsProvider,
    SMSData,
    SMSDataNewsletter,
} from 'nextalys-node-helpers/dist/sms-helpers';
import { Environment } from '../../environment/environment';
import {
    GenericResponse,
    GenericResponseWithData,
} from '../../models/responses/generic-response';
import { ApplicationBaseService } from '../../services/base-service';
import { AppLogger } from '../../services/tools/logger.service';
import { SendNewsletterResponse } from '../../shared/types';

@Injectable()
export class SmsService extends ApplicationBaseService {
    constructor() {
        super();
    }

    private canSendSms() {
        if (Environment.IgnoreAllSmsSending) {
            return false;
        }

        if (Environment.EnvName !== 'production') {
            return false;
        }

        return true;
    }

    private prepareData(data: SMSData) {
        if (data?.to?.length) {
            data.to = data.to.filter((x) => !!x.contactPhone);
        }
    }

    private getProvider(): BaseSmsProvider {
        if (
            Environment.SendInBlueApiKey &&
            Environment.SmsProvider === 'SendInBlue'
        ) {
            return new SendInBlueSmsProvider({
                sendInBlueApiKey: Environment.SendInBlueApiKey,
            });
        }

        return null;
    }

    public async sendSms(data: SMSData): Promise<GenericResponse> {
        const response = new GenericResponse();

        try {
            if (!this.canSendSms()) {
                return new GenericResponse(true);
            }

            this.prepareData(data);
            const sendResponse = await this.getProvider()?.sendSMS(data);

            response.success = !!sendResponse?.success;

            if (!response.success) {
                await AppLogger.error('Unable to send sms', sendResponse.error);
            }
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    public async sendNewsletter(
        data: SMSDataNewsletter,
    ): Promise<GenericResponse> {
        const response = new GenericResponse();

        try {
            if (!this.canSendSms()) {
                return new GenericResponse(true);
            }
            this.prepareData(data);
            const sendResponse = await this.getProvider()?.sendNewsletter(data);

            response.success = !!sendResponse?.success;

            await AppLogger.log(
                'sendNewsletter response - success = ' + sendResponse.success,
                sendResponse.data,
            );

            if (!response.success) {
                await AppLogger.loggerInstance.error(
                    'Unable to send newsletter',
                    sendResponse.error,
                );
            } else {
                response.message = sendResponse?.data?.newsletterId;
            }
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    public async sendNewsletterWithListId(
        data: SMSDataNewsletter,
        listId: string,
    ): Promise<SendNewsletterResponse> {
        const response = new SendNewsletterResponse();

        try {
            if (!this.canSendSms()) {
                return new SendNewsletterResponse(true);
            }

            const newsletterResponse =
                await this.getProvider().sendNewsletterWithListId(data, listId);

            response.success = newsletterResponse.success;
            response.listId = newsletterResponse.data?.listId;
            response.newsletterId = newsletterResponse.data?.newsletterId;

            await AppLogger.log(
                'SMS service - sendNewsletterWithListId response - success = ' +
                    newsletterResponse.success,
            );

            if (!response.success) {
                await AppLogger.loggerInstance.error(
                    'SMS service - Unable to send newsletter',
                    newsletterResponse.error,
                );
            }
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    public async createNewsletterList(
        data: SMSDataNewsletter,
    ): Promise<SendNewsletterResponse> {
        const response = new SendNewsletterResponse();

        try {
            if (!this.canSendSms()) {
                return new SendNewsletterResponse(true);
            }

            const newsletterResponse =
                await this.getProvider().createNewsletterList(data);

            response.success = newsletterResponse.success;
            response.listId = newsletterResponse?.data?.listId;

            await AppLogger.log(
                'sms service - createNewsletterList response - success = ' +
                    newsletterResponse.success,
            );

            if (!response.success) {
                await AppLogger.loggerInstance.error(
                    'sms service - Unable to create newsletter list',
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
    ): Promise<GenericResponseWithData<SendInBlueNewsletterReportSms>> {
        const response =
            new GenericResponseWithData<SendInBlueNewsletterReportSms>();

        try {
            const newsletterResponse: GetDataResponse<SendInBlueNewsletterReportSms> =
                await this.getProvider().getNewsletter(newsletterId);

            // await AppLogger.log('sms service - newsletterResponse response', newsletterResponse);
            response.success = newsletterResponse.success;
            response.data = newsletterResponse.data;
            response.error = newsletterResponse.error;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }
}
