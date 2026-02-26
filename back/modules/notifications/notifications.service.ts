import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateHelpers, MainHelpers } from 'nextalys-js-helpers';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { SharedCandidatesHelpers } from '../../../shared/candidates-helpers';
import {
    AppLocalNotificationsEnabled,
    CustomSocketEventType,
    FirebaseNotificationsEnabled,
} from '../../../shared/shared-constants';
import { AppNotification } from '../../entities/notification.entity';
import { AppError } from '../../models/app-error';
import {
    GetNotificationResponse,
    GetNotificationsResponse,
    NotificationDto,
} from '../../models/dto/notification-dto';
import { GenericResponse } from '../../models/responses/generic-response';
import { FirebaseService } from '../../modules/firebase/firebase-service';
import { ApplicationBaseModelService } from '../../services/base-model.service';
import { MailService } from '../../services/tools/mail.service';
import { PushService } from '../../services/tools/push.service';
import { UsersService } from '../../services/users.service';
import { SocketGateway } from '../../sockets/socket-gateway';
import { KeyValueService } from '../key-value-db/key-value.service';

@Injectable()
export class NotificationsService extends ApplicationBaseModelService<
    AppNotification,
    NotificationDto,
    GetNotificationResponse,
    GetNotificationsResponse
> {
    constructor(
        @InjectRepository(AppNotification)
        private readonly notificationsRepository: Repository<AppNotification>,
        private pushService: PushService,
        private mailService: MailService,
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService,
        private keyValueService: KeyValueService,
        private socketGateway: SocketGateway,
    ) {
        super();

        this.modelOptions = {
            getManyResponse: GetNotificationsResponse,
            getOneResponse: GetNotificationResponse,
            getManyResponseField: 'notifications',
            getOneResponseField: 'notification',
            repository: this.notificationsRepository,
            // getManyRelations: [],
            entity: AppNotification,
        };
    }

    public async sendNotification(
        data: string,
        userIds: string[],
        transports: ('Push' | 'Mail' | 'SMS')[],
        sendSocketToAllUsers: boolean,
        notifUrl: string,
    ): Promise<GenericResponse> {
        const response = new GenericResponse();

        try {
            if (transports?.length) {
                for (const transport of transports) {
                    switch (transport) {
                        case 'Mail':
                            if (userIds) {
                                const mailSender =
                                    await SharedCandidatesHelpers.getMailSenderFromCandidate(
                                        null,
                                        null,
                                        null,
                                        undefined, // No consultant email available in notifications
                                    );

                                for (const userId of userIds) {
                                    const userResponse =
                                        await this.usersService.findOne({
                                            where: { id: userId },
                                        });

                                    if (
                                        userResponse.success &&
                                        userResponse.user &&
                                        userResponse.user.mail
                                    ) {
                                        this.mailService.sendMail({
                                            subject: 'Notification',
                                            to: [
                                                {
                                                    address:
                                                        userResponse.user.mail,
                                                },
                                            ],
                                            from: { address: mailSender },
                                            htmlBody: data,
                                            templateName: 'mail_auto',
                                        });
                                        MainHelpers.sleep(1000);
                                    }
                                }
                            }
                            break;
                        case 'Push':
                            if (userIds) {
                                await this.pushService.sendNotification(
                                    data,
                                    userIds,
                                );
                            }

                            break;
                        case 'SMS':
                            break;
                    }
                }
            }

            if (AppLocalNotificationsEnabled) {
                const dateNow = new Date();

                if (sendSocketToAllUsers) {
                    await this.socketGateway.sendEventToClient(
                        CustomSocketEventType.AppNotification,
                        {
                            data: { title: data, userIds: userIds },
                            date: dateNow,
                        },
                    );
                } else {
                    await this.socketGateway.sendEventToClient(
                        CustomSocketEventType.AppNotification,
                        {
                            data: { title: data, userIds: userIds },
                            date: dateNow,
                        },
                        userIds,
                    );
                }

                if (userIds?.length) {
                    for (const userId of userIds) {
                        const newNotification = new AppNotification();
                        newNotification.userId = userId;
                        newNotification.title = data;
                        newNotification.seen = false;
                        newNotification.url = notifUrl;

                        await this.notificationsRepository.save(
                            newNotification,
                        );
                    }
                }
            } else if (FirebaseNotificationsEnabled) {
                await FirebaseService.sendNotification(userIds, {
                    title: data,
                    userIds: userIds,
                });
            }

            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    async getUserNotifications(
        userId: string,
        untilDate: Date,
    ): Promise<GetNotificationsResponse> {
        let response = new GetNotificationsResponse();

        try {
            if (!userId) {
                throw AppError.getForbiddenError(
                    'Unable to get user notifications : no payload',
                );
            }

            response = await this.findAll({
                where: { userId: userId, creationDate: MoreThan(untilDate) },
            });
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    async setNotificationsSeen(userId: string): Promise<GenericResponse> {
        const response = new GenericResponse();

        try {
            if (!userId) {
                throw AppError.getBadRequestError();
            }

            const notifications = await this.notificationsRepository.find({
                where: { userId: userId, seen: false },
            });

            if (notifications) {
                for (const notification of notifications) {
                    notification.seen = true;
                    await this.notificationsRepository.save(notification);
                }
            }

            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    public async sendEvent(
        data: string,
        userIds: string[],
    ): Promise<GenericResponse> {
        const response = new GenericResponse();

        try {
            await FirebaseService.sendEvent(userIds, data);
            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    async cleanOldNotifications() {
        const response = new GenericResponse();

        try {
            const dateNow = new Date();
            const daysToKeepDefault = 35;
            let daysToKeep = daysToKeepDefault;
            const daysToKeepStr = await this.keyValueService.getKeyValue(
                'DaysToKeepNotifications',
            );

            if (!daysToKeepStr) {
                await this.keyValueService.saveKeyValue(
                    'DaysToKeepNotifications',
                    daysToKeep,
                );
            } else {
                daysToKeep = parseInt(daysToKeepStr, 10);
                if (!daysToKeep || isNaN(daysToKeep)) {
                    daysToKeep = daysToKeepDefault;
                }
            }

            const fiveWeeksPast = DateHelpers.addDaysToDate(
                dateNow,
                -daysToKeep,
            );
            const notificationsList = await this.notificationsRepository.find({
                where: { creationDate: LessThan(fiveWeeksPast) },
                select: ['id'],
            });

            if (notificationsList.length) {
                await this.delete(notificationsList.map((x) => x.id));
            }

            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }
}
