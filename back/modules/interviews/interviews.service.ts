import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ical, { ICalEventData } from 'ical-generator';
import { DateHelpers, MainHelpers } from 'nextalys-js-helpers';
import { NodeHelpers } from 'nextalys-node-helpers';
import {
    Between,
    FindConditions,
    FindManyOptions,
    getRepository,
    In,
    LessThan,
    MoreThan,
    Raw,
    Repository,
} from 'typeorm';
import { SharedCandidatesHelpers } from '../../../shared/candidates-helpers';
import { InterviewHelpers } from '../../../shared/interview-helpers';
import {
    CandidateStatus,
    defaultAppLanguage,
    RolesList,
} from '../../../shared/shared-constants';
import { User } from '../../entities/user.entity';
import { Environment } from '../../environment/environment';
import { AppErrorWithMessage } from '../../models/app-error';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { GenericResponse } from '../../models/responses/generic-response';
import { AuthToolsService } from '../../services/auth-tools.service';
import { ApplicationBaseModelService } from '../../services/base-model.service';
import { ReferentialService } from '../../services/referential.service';
import { AppLogger } from '../../services/tools/logger.service';
import {
    EmailDataWithTemplate,
    MailService,
} from '../../services/tools/mail.service';
import { TranslationService } from '../../services/translation.service';
import { CandidateService } from '../candidates/candidates.service';
import { ConsultantGoogleLinkHelper } from './consultant-google-links.constants';
import {
    GetInterviewResponse,
    GetInterviewsRequest,
    GetInterviewsResponse,
    InterviewDto,
} from './interview-dto';
import { Interview } from './interview.entity';
import { ReviewRequestEmailTemplates } from './review-request-email-templates';

@Injectable()
export class InterviewsService extends ApplicationBaseModelService<
    Interview,
    InterviewDto,
    GetInterviewResponse,
    GetInterviewsResponse
> {
    constructor(
        @InjectRepository(Interview)
        private readonly repository: Repository<Interview>,
        private mailService: MailService,
        private referentialService: ReferentialService,
        private candidateService: CandidateService,
    ) {
        super();

        this.modelOptions = {
            getManyResponse: GetInterviewsResponse,
            getOneResponse: GetInterviewResponse,
            getManyResponseField: 'interviews',
            getOneResponseField: 'interview',
            getManyRelations: ['candidate', 'consultant', 'consultant.image'],
            getOneRelations: ['candidate', 'consultant'],
            repository: this.repository,
            entity: Interview,
            archiveField: 'disabled',
            archiveFieldValue: true,
        };
    }

    async sendInterviewMailToCandidate(
        id: string,
        consultantEmail?: string,
    ): Promise<GenericResponse> {
        const response = new GenericResponse();

        try {
            const interviewResponse = await this.findOne({
                where: { id: id },
                relations: ['candidate'],
            }); //, 'consultant'
            const interviewDto = interviewResponse.interview;

            if (!interviewDto) {
                throw new AppErrorWithMessage(
                    'cannot send mail : Unable to find interview ! ',
                );
            }

            const mailSender =
                await SharedCandidatesHelpers.getMailSenderFromCandidate(
                    null,
                    null,
                    null,
                    consultantEmail,
                );

            if (!interviewDto.guid) {
                interviewDto.guid = MainHelpers.generateGuid();
                await this.getRepository().update(
                    { id: interviewDto.id },
                    { guid: interviewDto.guid },
                );
                // await this.createOrUpdate(interview);
            }

            const getCandidateResponse = await this.candidateService.findOne({
                where: { id: interviewDto.candidateId },
                relations: ['candidateLanguages', 'addresses'],
            });

            if (
                !getCandidateResponse.success ||
                !getCandidateResponse.candidate
            ) {
                throw new AppErrorWithMessage('Error');
            }

            const candidateLanguage =
                await SharedCandidatesHelpers.getLanguageFromCandidate(
                    getCandidateResponse.candidate,
                    this.referentialService,
                );

            const candidateLanguageCode =
                candidateLanguage?.code || defaultAppLanguage;

            const interviewLocationAddress =
                InterviewHelpers.getInterviewPlaceAddress(
                    interviewDto.agencyPlace,
                    candidateLanguageCode as 'fr' | 'en',
                );

            const calendar = ical({
                name: 'Calendrier ' + (interviewDto.candidate?.firstName || ''),
            });

            const icsData: ICalEventData = {
                start: DateHelpers.formatDateISO8601(interviewDto.date, true),
                end: DateHelpers.formatDateISO8601(
                    DateHelpers.addHoursToDate(interviewDto.date, 1),
                    true,
                ),
                description: 'Entretien MMI',
                summary: 'Entretien MMI',
                timezone: 'Europe/Paris',
            };

            if (interviewLocationAddress) {
                icsData.location = interviewLocationAddress;
            }

            calendar.createEvent(icsData);

            const icalBase64 = NodeHelpers.base64Encode(calendar.toString());
            const mailData: EmailDataWithTemplate = {
                from: { address: mailSender },
                // todo: set language
                subject: await TranslationService.getTranslation(
                    candidateLanguageCode,
                    'Interview.InterviewMailSubject',
                ),
                to: [{ address: interviewDto.candidate.email }],
                templateName: 'mail_interview.mjml',
                attachments: [
                    {
                        name: 'votre-rendez-vous.ics',
                        base64Content: icalBase64,
                    },
                ],
                templateValues: {
                    // nomConsultant: interviewDto.consultant.lastName + ' ' + interviewDto.consultant.firstName,
                    interviewDate: DateHelpers.formatDate(interviewDto.date),
                    interviewTime: DateHelpers.formatTime(interviewDto.date),
                    comment: interviewDto.comment,
                    guid: interviewDto.guid,
                    isFrench: true,
                    interviewLocationName:
                        InterviewHelpers.getInterviewPlaceName(
                            interviewDto.agencyPlace,
                        ),
                    interviewLocationCode: interviewDto.agencyPlace,
                    interviewLocationAddress: MainHelpers.replaceAll(
                        interviewLocationAddress,
                        '\n',
                        '<br/>',
                    ),
                    title: interviewDto.title,
                    language: candidateLanguageCode,
                },
                useHandleBars: true,
                compileMjmlTemplate: true,
            };

            const sendMailResponse = await this.mailService.sendMail(mailData);

            if (!sendMailResponse.success) {
                const errorContext = {
                    interviewId: id,
                    candidateId: interviewDto.candidateId,
                    candidateEmail: interviewDto.candidate?.email,
                    mailError: sendMailResponse.message,
                };
                console.error(
                    'Failed to send interview mail to candidate:',
                    errorContext,
                );
                throw new AppErrorWithMessage(
                    `Une erreur s'est produite lors de l'envoi du mail: ${
                        sendMailResponse.message || 'Erreur inconnue'
                    }`,
                );
            }

            response.success = true;
        } catch (error) {
            response.handleError(error);
        }

        return response;
    }

    async findAllInterviewsConsultant(
        request: GetInterviewsRequest,
        authToolsService: AuthToolsService,
    ) {
        const getInterviewsResponse = new GetInterviewsResponse();

        try {
            const findOptions =
                BaseSearchRequest.getDefaultFindOptions<Interview>(request);
            const currentPayload = authToolsService.getCurrentPayload(false);
            const currentConsultantId = currentPayload.id;
            const userRoles = currentPayload.roles || [];

            const isAdminOrRH =
                userRoles.includes(RolesList.Admin) ||
                userRoles.includes(RolesList.RH);

            if (!isAdminOrRH) {
                findOptions.where = [
                    {
                        consultantId: currentConsultantId,
                    },
                ];
            }

            const doSearch = this.setInterviewsConsultantFilters(
                request,
                findOptions,
            );

            if (!request.order && !request.orderby) {
                findOptions.order = { date: 'DESC' };
            }

            if (doSearch) {
                const getConsultantInterviews = await super.findAll(
                    findOptions,
                );

                if (!getConsultantInterviews) {
                    throw new AppErrorWithMessage('Error');
                }

                getInterviewsResponse.interviews =
                    getConsultantInterviews.interviews;
                getInterviewsResponse.filteredResults =
                    getConsultantInterviews.filteredResults;
            } else {
                getInterviewsResponse.interviews = [];
            }

            getInterviewsResponse.success = true;
        } catch (error) {
            getInterviewsResponse.handleError(error);
        }

        return getInterviewsResponse;
    }

    private setInterviewsConsultantFilters(
        request: GetInterviewsRequest,
        findOptions: FindManyOptions<Interview>,
    ): boolean {
        if (!findOptions.where) {
            findOptions.where = [{}];
        }

        const where = findOptions.where as FindConditions<Interview>[];

        if (request.interviewFilterYear) {
            for (const item of where) {
                item.date = Raw(
                    (alias) =>
                        `YEAR(${alias}) = ${request.interviewFilterYear}`,
                );
            }
        }

        if (request.interviewFilterMonth) {
            for (const item of where) {
                item.date = Raw(
                    (alias) =>
                        `MONTH(${alias}) = ${request.interviewFilterMonth}`,
                );
            }
        }

        if (request.interviewCurrentDate) {
            const currentDate = new Date();
            const formatDate = DateHelpers.formatDateISO8601(currentDate, true);

            for (const item of where) {
                if (request.interviewCurrentDate === 'past') {
                    item.date = LessThan(formatDate);
                }

                if (request.interviewCurrentDate === 'coming') {
                    item.date = MoreThan(formatDate);
                }
            }
        }

        if (request.interviewPlace) {
            for (const item of where) {
                item.agencyPlace = request.interviewPlace;
            }
        }

        if (request.interviewConfirmationStatus) {
            for (const item of where) {
                item.candidateResponse = request.interviewConfirmationStatus;
            }
        }

        if (request.noShow !== undefined && request.noShow !== null) {
            for (const item of where) {
                item.noShow = request.noShow;
            }
        }

        // if (filterRequest?.length) {
        //     if (!findOptions.where)
        //         findOptions.where = [{}];
        //     for (const whereFilter of findOptions.where as FindConditions<Interview>[]) {
        //         whereFilter.id = Raw((alias) => {
        //             const concatQuery = '(' + filterRequest.join(') AND (') + ')';
        //             const finalQuery = MainHelpers.replaceAll(concatQuery, '[nxsAlias]', alias);
        //             return finalQuery;
        //         });
        //     }
        // }

        return true;
    }

    async updateInterviewedCandidatesStatus() {
        const response = new GenericResponse();

        try {
            // Calculate the date 24 hours ago
            const twentyFourHoursAgo = new Date();
            twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

            // Get candidates that have interviews older than 24h and correct status
            const candidates = await this.candidateService.repository
                .createQueryBuilder('candidate')
                .innerJoin('candidate.interviews', 'interview')
                .innerJoin('candidate.candidateStatus', 'candidateStatus')
                .where('candidateStatus.code = :status', {
                    status: CandidateStatus.BeingReferenced,
                })
                .andWhere('interview.date < :date', {
                    date: twentyFourHoursAgo,
                })
                .andWhere('interview.noShow = :noShow', {
                    noShow: false,
                })
                .getMany();

            const candidateStatusId =
                await this.referentialService.getAppValues({
                    where: {
                        code: CandidateStatus.Referenced,
                    },
                });

            // Update status to Referenced for candidates with old interviews and send review request emails
            for (const candidate of candidates) {
                await this.updateCandidateStatusAndSendEmail(
                    candidate.id,
                    candidateStatusId.appValues[0].id,
                    undefined, // No consultant email available in scheduled job
                );
            }

            response.success = true;
        } catch (error) {
            response.handleError(error);
        }

        return response;
    }

    /**
     * Send review request email to candidate after interview status update
     */
    private async sendReviewRequestEmail(
        candidateId: string,
        consultantId: string | null,
        consultantEmail?: string,
    ): Promise<void> {
        try {
            // Get candidate details with language preference
            const candidateResponse = await this.candidateService.findOne({
                where: { id: candidateId },
                relations: ['candidateLanguages', 'addresses'],
            });

            if (!candidateResponse.success || !candidateResponse.candidate) {
                console.warn(
                    `Could not find candidate ${candidateId} for review request email`,
                );
                return;
            }

            const candidate = candidateResponse.candidate;

            // Get consultant details
            const interviewResponse = await this.findOne({
                where: { candidateId: candidateId },
                relations: ['consultant'],
            });

            if (
                !interviewResponse.success ||
                !interviewResponse.interview?.consultant
            ) {
                console.warn(
                    `Could not find consultant for candidate ${candidateId}`,
                );
                return;
            }

            const consultant = interviewResponse.interview.consultant;

            // Determine Google review URL
            let googleReviewUrl =
                ConsultantGoogleLinkHelper.getGoogleReviewUrlByConsultant(
                    consultant.id,
                );

            // If no consultant mapping found, check if candidate is Swiss resident
            if (!googleReviewUrl) {
                // Check candidate addresses for Swiss location
                if (candidate.addresses && candidate.addresses.length > 0) {
                    for (const address of candidate.addresses) {
                        if (
                            address.country &&
                            address.country.toLowerCase().includes('swiss')
                        ) {
                            googleReviewUrl =
                                ConsultantGoogleLinkHelper.getGoogleReviewUrlByLocation(
                                    'swiss',
                                );
                            break;
                        }
                    }
                }
            }

            // If still no URL found, use default (could be Paris as fallback)
            if (!googleReviewUrl) {
                googleReviewUrl = 'https://g.page/r/CXVw4LTxczwEEBM/review'; // Paris as default
            }

            // Get candidate language preference
            const candidateLanguage =
                await SharedCandidatesHelpers.getLanguageFromCandidate(
                    candidate,
                    this.referentialService,
                );

            const candidateLanguageCode =
                candidateLanguage?.code || defaultAppLanguage;

            // Get email template based on language
            const emailContent =
                candidateLanguageCode === 'fr'
                    ? ReviewRequestEmailTemplates.getFrenchTemplate(
                          candidate.firstName,
                          googleReviewUrl,
                      )
                    : ReviewRequestEmailTemplates.getEnglishTemplate(
                          candidate.firstName,
                          googleReviewUrl,
                      );

            // Get mail sender
            const mailSender =
                await SharedCandidatesHelpers.getMailSenderFromCandidate(
                    null,
                    null,
                    null,
                    consultantEmail,
                );

            // Prepare email data
            const mailData: EmailDataWithTemplate = {
                from: { address: mailSender },
                subject: emailContent.subject,
                to: [{ address: candidate.email }],
                templateName: 'mail_review_request.mjml',
                templateValues: {
                    candidateFirstName: candidate.firstName,
                    googleReviewUrl: googleReviewUrl,
                    language: candidateLanguageCode,
                    isFrench: candidateLanguageCode === 'fr',
                },
                useHandleBars: true,
                compileMjmlTemplate: true,
            };

            // Send email
            const sendMailResponse = await this.mailService.sendMail(mailData);

            if (!sendMailResponse.success) {
                console.error(
                    `Failed to send review request email to candidate ${candidateId}:`,
                    sendMailResponse.message,
                );
            }
        } catch (error) {
            console.error(
                `Error sending review request email to candidate ${candidateId}:`,
                error,
            );
        }
    }

    /**
     * Update candidate status and send review request email
     */
    private async updateCandidateStatusAndSendEmail(
        candidateId: string,
        newStatusId: string,
        consultantEmail?: string,
    ): Promise<void> {
        try {
            // Update candidate status
            await this.candidateService.repository.update(
                { id: candidateId },
                { candidateStatusId: newStatusId },
            );

            // Send review request email
            await this.sendReviewRequestEmail(
                candidateId,
                null,
                consultantEmail,
            );
        } catch (error) {
            console.error(
                `Error updating candidate status and sending email for ${candidateId}:`,
                error,
            );
            throw error;
        }
    }

    /**
     * Send review request email to placed candidate
     */
    async sendPlacedCandidateReviewEmail(
        candidateId: string,
        consultantEmail?: string,
    ): Promise<GenericResponse> {
        const response = new GenericResponse();

        try {
            // Get candidate details with language preference
            const candidateResponse = await this.candidateService.findOne({
                where: { id: candidateId },
                relations: ['candidateLanguages', 'addresses'],
            });

            if (!candidateResponse.success || !candidateResponse.candidate) {
                throw new AppErrorWithMessage(
                    `Could not find candidate ${candidateId} for review request email`,
                );
            }

            const candidate = candidateResponse.candidate;

            // Get consultant details from the candidate's consultant
            let consultantId = candidate.consultantId;
            let googleReviewUrl = null;

            if (consultantId) {
                googleReviewUrl =
                    ConsultantGoogleLinkHelper.getGoogleReviewUrlByConsultant(
                        consultantId,
                    );
            }

            // If no consultant mapping found, check if candidate is Swiss resident
            if (
                !googleReviewUrl &&
                candidate.addresses &&
                candidate.addresses.length > 0
            ) {
                for (const address of candidate.addresses) {
                    if (
                        address.country &&
                        address.country.toLowerCase().includes('swiss')
                    ) {
                        googleReviewUrl =
                            ConsultantGoogleLinkHelper.getGoogleReviewUrlByLocation(
                                'swiss',
                            );
                        break;
                    }
                }
            }

            // If still no URL found, use Paris as default fallback
            if (!googleReviewUrl) {
                googleReviewUrl = 'https://g.page/r/CXVw4LTxczwEEBM/review'; // Paris as default
            }

            // Get candidate language preference
            const candidateLanguage =
                await SharedCandidatesHelpers.getLanguageFromCandidate(
                    candidate,
                    this.referentialService,
                );

            const candidateLanguageCode =
                candidateLanguage?.code || defaultAppLanguage;

            // Get mail sender
            const mailSender =
                await SharedCandidatesHelpers.getMailSenderFromCandidate(
                    null,
                    null,
                    null,
                    consultantEmail,
                );

            // Prepare email data
            const mailData: EmailDataWithTemplate = {
                from: { address: mailSender },
                subject:
                    candidateLanguageCode === 'fr'
                        ? 'Votre avis compte pour nous !'
                        : 'Your opinion matters to us!',
                to: [{ address: candidate.email }],
                templateName: 'mail_placed_candidate_review.mjml',
                templateValues: {
                    candidateFirstName: candidate.firstName,
                    googleReviewUrl: googleReviewUrl,
                    language: candidateLanguageCode,
                    isFrench: candidateLanguageCode === 'fr',
                },
                useHandleBars: true,
                compileMjmlTemplate: true,
            };

            // Send email
            const sendMailResponse = await this.mailService.sendMail(mailData);

            if (!sendMailResponse.success) {
                throw new AppErrorWithMessage(
                    `Failed to send review request email to candidate ${candidateId}: ${sendMailResponse.message}`,
                );
            }

            response.success = true;
            response.message = 'Review request email sent successfully';
        } catch (error) {
            response.handleError(error);
        }

        return response;
    }

    /**
     * Daily interview report configuration
     */
    private static readonly DAILY_INTERVIEW_GOAL = 3;
    private static readonly WEEKLY_INTERVIEW_GOAL = 15;
    private static readonly REPORT_RECIPIENT_EMAILS = [
        'laurine@morganmallet.agency',
        'morgan@morganmallet.agency',
    ];
    private static readonly REPORT_RECIPIENT_EMAIL =
        'laurine@morganmallet.agency';
    private static readonly EXCLUDED_EMAILS = [
        'eric@morganmallet.agency',
    ];
    private static readonly US_CONSULTANT_USERNAMES = [
        'Eric',
        'Daniele',
        'Jonathan',
        'Cara-Leahy',
    ];

    /**
     * Send daily interview report for World (non-US) consultants
     * Called at 00:01 Paris time, Monday-Friday
     */
    async sendDailyInterviewReportWorld(): Promise<GenericResponse> {
        return this.sendDailyInterviewReport('world');
    }

    /**
     * Send daily interview report for US consultants
     * Called at 00:01 California time, Monday-Friday
     */
    async sendDailyInterviewReportUS(): Promise<GenericResponse> {
        return this.sendDailyInterviewReport('us');
    }

    /**
     * Send daily interview report for a specific region
     */
    private async sendDailyInterviewReport(
        region: 'world' | 'us',
    ): Promise<GenericResponse> {
        const response = new GenericResponse();

        try {
            // Determine timezone and calculate yesterday's date range
            const timezone =
                region === 'us' ? 'America/Los_Angeles' : 'Europe/Paris';
            const now = new Date();

            // Get yesterday in the specified timezone
            const yesterdayStart = this.getYesterdayStartInTimezone(timezone);
            const yesterdayEnd = this.getYesterdayEndInTimezone(timezone);

            // Check if yesterday was a weekend (skip report)
            const yesterdayDayOfWeek = this.getDayOfWeekInTimezone(
                yesterdayStart,
                timezone,
            );
            if (yesterdayDayOfWeek === 0 || yesterdayDayOfWeek === 6) {
                // Sunday = 0, Saturday = 6
                await AppLogger.log(
                    `Skipping daily interview report for ${region} - yesterday was a weekend`,
                );
                response.success = true;
                response.message = 'Skipped - weekend';
                return response;
            }

            // Get all active consultants
            const userRepository = getRepository(User);
            const allConsultants = await userRepository
                .createQueryBuilder('user')
                .innerJoin('user.roles', 'role')
                .where('role.role = :roleCode', {
                    roleCode: RolesList.Consultant,
                })
                .andWhere('user.disabled = :disabled', { disabled: false })
                .getMany();

            // Filter consultants by region, excluding excluded emails
            const consultants = allConsultants.filter((consultant) => {
                if (InterviewsService.EXCLUDED_EMAILS.includes(consultant.mail)) {
                    return false;
                }
                const isUSConsultant =
                    InterviewsService.US_CONSULTANT_USERNAMES.includes(
                        consultant.userName,
                    );
                return region === 'us' ? isUSConsultant : !isUSConsultant;
            });

            if (consultants.length === 0) {
                await AppLogger.log(
                    `No consultants found for region ${region}`,
                );
                response.success = true;
                response.message = 'No consultants to report';
                return response;
            }

            // Get interviews for yesterday
            const interviews = await this.repository.find({
                where: {
                    date: Between(yesterdayStart, yesterdayEnd),
                    consultantId: In(consultants.map((c) => c.id)),
                },
                relations: ['consultant'],
            });

            // Count interviews per consultant
            const interviewCountByConsultant = new Map<string, number>();
            for (const interview of interviews) {
                const count =
                    interviewCountByConsultant.get(interview.consultantId) || 0;
                interviewCountByConsultant.set(
                    interview.consultantId,
                    count + 1,
                );
            }

            // Build report data
            const consultantReports = consultants
                .map((consultant) => {
                    const interviewCount =
                        interviewCountByConsultant.get(consultant.id) || 0;
                    const name =
                        `${consultant.firstName || ''} ${
                            consultant.lastName || ''
                        }`.trim() || consultant.userName;
                    return {
                        name,
                        interviewCount,
                        metGoal:
                            interviewCount >=
                            InterviewsService.DAILY_INTERVIEW_GOAL,
                    };
                })
                .sort((a, b) => b.interviewCount - a.interviewCount);

            const successCount = consultantReports.filter(
                (c) => c.metGoal,
            ).length;
            const noInterviewConsultants = consultantReports
                .filter((c) => c.interviewCount === 0)
                .map((c) => c.name);

            // Format report date
            const reportDate = this.formatDateForReport(yesterdayStart);

            // Send email
            const mailData: EmailDataWithTemplate = {
                from: {
                    address:
                        Environment.MailSender || 'noreply@morganmallet.agency',
                },
                subject: `Rapport quotidien des entretiens - Equipe ${
                    region === 'us' ? 'US' : 'Monde'
                } - ${reportDate}`,
                to: [{ address: InterviewsService.REPORT_RECIPIENT_EMAIL }],
                templateName: 'mail_daily_interview_report.mjml',
                templateValues: {
                    reportDate,
                    regionName: region === 'us' ? 'US' : 'Monde (hors US)',
                    goal: InterviewsService.DAILY_INTERVIEW_GOAL,
                    consultants: consultantReports,
                    successCount,
                    totalConsultants: consultants.length,
                    noInterviewConsultants,
                    SITE_BASE_URL: Environment.BaseURL,
                },
                useHandleBars: true,
                compileMjmlTemplate: true,
            };

            const sendMailResponse = await this.mailService.sendMail(mailData);

            if (!sendMailResponse.success) {
                await AppLogger.error(
                    `Failed to send daily interview report for ${region}`,
                    sendMailResponse.message,
                );
                throw new AppErrorWithMessage(
                    `Failed to send email: ${sendMailResponse.message}`,
                );
            }

            await AppLogger.log(
                `Daily interview report sent for ${region} - ${successCount}/${consultants.length} met goal`,
            );
            response.success = true;
            response.message = `Report sent: ${successCount}/${consultants.length} met goal`;
        } catch (error) {
            response.handleError(error);
            await AppLogger.error('Error in sendDailyInterviewReport', error);
        }

        return response;
    }

    /**
     * Get the start of yesterday (00:00:00) in a specific timezone, returned as UTC Date
     */
    private getYesterdayStartInTimezone(timezone: string): Date {
        const now = new Date();
        // Create a date string in the target timezone
        const formatter = new Intl.DateTimeFormat('en-CA', {
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
        const todayStr = formatter.format(now); // YYYY-MM-DD in target timezone

        // Parse as local date in target timezone, then subtract 1 day
        const [year, month, day] = todayStr.split('-').map(Number);
        const yesterday = new Date(
            Date.UTC(year, month - 1, day - 1, 0, 0, 0, 0),
        );

        // Adjust for timezone offset
        const offsetMs = this.getTimezoneOffsetMs(timezone, yesterday);
        return new Date(yesterday.getTime() + offsetMs);
    }

    /**
     * Get the end of yesterday (23:59:59.999) in a specific timezone, returned as UTC Date
     */
    private getYesterdayEndInTimezone(timezone: string): Date {
        const start = this.getYesterdayStartInTimezone(timezone);
        return new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
    }

    /**
     * Get the day of week for a date in a specific timezone (0 = Sunday, 6 = Saturday)
     */
    private getDayOfWeekInTimezone(date: Date, timezone: string): number {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            weekday: 'short',
        });
        const dayStr = formatter.format(date);
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days.indexOf(dayStr);
    }

    /**
     * Get timezone offset in milliseconds for a given timezone and date
     */
    private getTimezoneOffsetMs(timezone: string, date: Date): number {
        const utcDate = new Date(
            date.toLocaleString('en-US', { timeZone: 'UTC' }),
        );
        const tzDate = new Date(
            date.toLocaleString('en-US', { timeZone: timezone }),
        );
        return utcDate.getTime() - tzDate.getTime();
    }

    /**
     * Format date for display in report (DD/MM/YYYY)
     */
    private formatDateForReport(date: Date): string {
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${day}/${month}/${year}`;
    }

    /**
     * Send weekly interview report for consultants who didn't meet the weekly goal.
     * Called every Monday at 08:00 Paris time (07:00 UTC).
     * Sends individual emails to each underperforming consultant + both CEOs.
     */
    async sendWeeklyInterviewReport(): Promise<GenericResponse> {
        const response = new GenericResponse();

        try {
            const timezone = 'Europe/Paris';

            // Calculate last week's Monday-Friday date range
            const { weekStart, weekEnd } =
                this.getLastWeekDateRange(timezone);

            const weekStartFormatted = this.formatDateForReport(weekStart);
            const weekEndFormatted = this.formatDateForReport(weekEnd);

            // Get all active consultants and RH users, excluding admins
            const userRepository = getRepository(User);
            const adminUserIds = userRepository
                .createQueryBuilder('adminUser')
                .select('adminUser.id')
                .innerJoin('adminUser.roles', 'adminRole')
                .where('adminRole.role IN (:...adminRoles)', {
                    adminRoles: [RolesList.Admin, RolesList.AdminTech],
                });

            const allRecruiters = await userRepository
                .createQueryBuilder('user')
                .innerJoin('user.roles', 'role')
                .where('role.role IN (:...roles)', {
                    roles: [RolesList.Consultant, RolesList.RH],
                })
                .andWhere('user.disabled = :disabled', { disabled: false })
                .andWhere(
                    `user.id NOT IN (${adminUserIds.getQuery()})`,
                )
                .setParameters(adminUserIds.getParameters())
                .getMany();

            // Exclude specific emails from the report
            const filteredRecruiters = allRecruiters.filter(
                (r) => !InterviewsService.EXCLUDED_EMAILS.includes(r.mail),
            );

            if (filteredRecruiters.length === 0) {
                await AppLogger.log(
                    'Weekly interview report: No active consultants/RH found',
                );
                response.success = true;
                response.message = 'No consultants to report';
                return response;
            }

            // Get all interviews for last week for these recruiters
            const interviews = await this.repository.find({
                where: {
                    date: Between(weekStart, weekEnd),
                    consultantId: In(filteredRecruiters.map((c) => c.id)),
                },
                relations: ['consultant'],
            });

            // Count interviews per consultant
            const interviewCountByConsultant = new Map<string, number>();
            for (const interview of interviews) {
                const count =
                    interviewCountByConsultant.get(interview.consultantId) || 0;
                interviewCountByConsultant.set(
                    interview.consultantId,
                    count + 1,
                );
            }

            // Check each recruiter individually and send emails for those below target
            let belowTargetCount = 0;

            for (const recruiter of filteredRecruiters) {
                const interviewCount =
                    interviewCountByConsultant.get(recruiter.id) || 0;

                if (interviewCount >= InterviewsService.WEEKLY_INTERVIEW_GOAL) {
                    continue;
                }

                belowTargetCount++;

                const name =
                    `${recruiter.firstName || ''} ${
                        recruiter.lastName || ''
                    }`.trim() || recruiter.userName;
                const deficit =
                    InterviewsService.WEEKLY_INTERVIEW_GOAL - interviewCount;

                const recipients = [
                    ...InterviewsService.REPORT_RECIPIENT_EMAILS.map(
                        (email) => ({ address: email }),
                    ),
                ];

                if (recruiter.mail) {
                    recipients.push({ address: recruiter.mail });
                }

                const mailData: EmailDataWithTemplate = {
                    from: {
                        address:
                            Environment.MailSender ||
                            'noreply@morganmallet.agency',
                    },
                    subject: `Rapport hebdomadaire entretiens / Weekly Interview Report - ${name} - ${weekStartFormatted}`,
                    to: recipients,
                    templateName: 'mail_weekly_interview_report.mjml',
                    templateValues: {
                        weekStartDate: weekStartFormatted,
                        weekEndDate: weekEndFormatted,
                        weeklyGoal: InterviewsService.WEEKLY_INTERVIEW_GOAL,
                        dailyGoal: InterviewsService.DAILY_INTERVIEW_GOAL,
                        consultantName: name,
                        consultantInterviewCount: interviewCount,
                        deficit,
                        SITE_BASE_URL: Environment.BaseURL,
                    },
                    useHandleBars: true,
                    compileMjmlTemplate: true,
                };

                const sendMailResponse =
                    await this.mailService.sendMail(mailData);

                if (!sendMailResponse.success) {
                    await AppLogger.error(
                        `Failed to send weekly interview report for ${name}`,
                        sendMailResponse.message,
                    );
                }
            }

            await AppLogger.log(
                `Weekly interview report sent - ${belowTargetCount} consultant(s) below target out of ${filteredRecruiters.length}`,
            );
            response.success = true;
            response.message = `Report sent: ${belowTargetCount}/${filteredRecruiters.length} below target`;
        } catch (error) {
            response.handleError(error);
            await AppLogger.error(
                'Error in sendWeeklyInterviewReport',
                error,
            );
        }

        return response;
    }

    /**
     * Get date range for last week (Monday 00:00:00 to Friday 23:59:59) in a given timezone
     */
    private getLastWeekDateRange(timezone: string): {
        weekStart: Date;
        weekEnd: Date;
    } {
        const now = new Date();

        // Get today's date in the target timezone
        const formatter = new Intl.DateTimeFormat('en-CA', {
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
        const todayStr = formatter.format(now);
        const [year, month, day] = todayStr.split('-').map(Number);

        // Get current day of week in target timezone (0=Sun, 1=Mon, ..., 6=Sat)
        const dayOfWeekFormatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            weekday: 'short',
        });
        const dayStr = dayOfWeekFormatter.format(now);
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const currentDayOfWeek = days.indexOf(dayStr);

        // Calculate days since last Monday
        // If today is Monday (1), last Monday was 7 days ago
        const daysSinceLastMonday =
            currentDayOfWeek === 0
                ? 6 + 7 // Sunday: last Monday was 13 days ago? No, 6 days ago is last Monday of same week. But we want LAST week's Monday.
                : currentDayOfWeek - 1 + 7; // E.g., Monday(1): 0+7=7 days ago

        // Last week's Monday at 00:00:00 in UTC
        const lastMondayUTC = new Date(
            Date.UTC(year, month - 1, day - daysSinceLastMonday, 0, 0, 0, 0),
        );

        // Last week's Friday at 23:59:59 in UTC
        const lastFridayUTC = new Date(
            Date.UTC(
                year,
                month - 1,
                day - daysSinceLastMonday + 4,
                23,
                59,
                59,
                999,
            ),
        );

        // Adjust for timezone offset
        const offsetMs = this.getTimezoneOffsetMs(timezone, lastMondayUTC);
        const weekStart = new Date(lastMondayUTC.getTime() + offsetMs);
        const weekEnd = new Date(lastFridayUTC.getTime() + offsetMs);

        return { weekStart, weekEnd };
    }

    /**
     * Check if candidates have had an interview with the current consultant in the last 14 days
     * @param candidateIds List of candidate IDs to check
     * @param consultantId The current consultant's ID
     * @returns Eligibility status for each candidate
     */
    async checkCandidatesInterviewEligibility(
        candidateIds: string[],
        consultantId: string,
    ): Promise<{
        candidateId: string;
        isEligible: boolean;
        lastInterviewDate?: Date;
    }[]> {
        const results: {
            candidateId: string;
            isEligible: boolean;
            lastInterviewDate?: Date;
        }[] = [];

        // Calculate the date 14 days ago (start of day for inclusive check)
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
        fourteenDaysAgo.setHours(0, 0, 0, 0);

        for (const candidateId of candidateIds) {
            // Find the most recent interview for this candidate with this consultant
            const interview = await this.repository.findOne({
                where: {
                    candidateId: candidateId,
                    consultantId: consultantId,
                },
                order: { date: 'DESC' },
            });

            if (interview && interview.date >= fourteenDaysAgo) {
                // Candidate has a recent interview - eligible
                results.push({
                    candidateId,
                    isEligible: true,
                    lastInterviewDate: interview.date,
                });
            } else {
                // No recent interview - not eligible
                results.push({
                    candidateId,
                    isEligible: false,
                    lastInterviewDate: interview?.date,
                });
            }
        }

        return results;
    }
}
