import { Injectable } from '@nestjs/common';
import { SlackManager } from 'nextalys-node-helpers/dist/slack-helpers';
import { Environment } from '../../environment/environment';
import { GenericResponse } from '../../models/responses/generic-response';
import { ApplicationBaseService } from '../../services/base-service';
import { AppLogger } from '../../services/tools/logger.service';

@Injectable()
export class SlackService extends ApplicationBaseService {
    constructor() {
        super();
    }

    public async sendSlackNotification(to: string, message: string) {
        const response = new GenericResponse();
        try {
            if (!Environment.SlackToken) {
                return new GenericResponse(false, 'slack token not provided');
            }

            SlackManager.init(Environment.SlackToken);

            await SlackManager.sendMessage(message, to);
            await AppLogger.loggerInstance.log(
                "Envoi d'un message sur Slack : " + message,
            );

            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }
}
