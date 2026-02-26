import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateHelpers, MainHelpers } from 'nextalys-js-helpers';
import { EmailAddress } from 'nextalys-node-helpers';
import {
    SendInBlueNewsletterReportMail,
    SendInBlueNewsletterReportSms,
} from 'nextalys-node-helpers/dist/helpers/sendinblue/sendinblue-shared-types';
import { SMSDataNewsletter } from 'nextalys-node-helpers/dist/sms-helpers';
import {
    FindConditions,
    getManager,
    In,
    IsNull,
    Not,
    Raw,
    Repository,
} from 'typeorm';
import { normalizeCountryName } from '../../../shared/country-names-helper';
import { RoutesList } from '../../../shared/routes';
import {
    AppTypes,
    NewsletterLanguage,
    NewsletterState,
    NewsletterType,
} from '../../../shared/shared-constants';
import { SharedService } from '../../../shared/shared-service';
import { Address } from '../../entities/address.entity';
import { Environment } from '../../environment/environment';
import { AppErrorWithMessage } from '../../models/app-error';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import {
    GenericResponse,
    GenericResponseWithData,
} from '../../models/responses/generic-response';
import { ApplicationBaseModelService } from '../../services/base-model.service';
import { ReferentialService } from '../../services/referential.service';
import { AppLogger } from '../../services/tools/logger.service';
import {
    EmailDataNewsletterWithTemplate,
    MailService,
} from '../../services/tools/mail.service';
import { TranslationService } from '../../services/translation.service';
import { SendNewsletterResponse } from '../../shared/types';
import { CandidateApplicationDto } from '../candidates-application/candidate-application-dto';
import { CandidateApplication } from '../candidates-application/candidate-application.entity';
import { CandidateApplicationService } from '../candidates-application/candidate-applications.service';
import { CandidateCurrentJob } from '../candidates/candidate-current-jobs/candidate-current-jobs.entity';
import { CandidateDto } from '../candidates/candidate-dto';
import { Candidate } from '../candidates/candidate.entity';
import { CandidateService } from '../candidates/candidates.service';
import { SmsService } from '../sms/sms.service';
import {
    GetCandidatesCountRequest,
    GetCandidatesCountResponse,
    GetNewsletterCandidateApplicationsRequest,
    GetNewsletterCandidateApplicationsResponse,
    GetNewsletterResponse,
    GetNewslettersResponse,
    NewsletterDto,
    SendNewsletterWithContactsResponse,
    UnsubscribeFromNewsletterRequest,
} from './newsletter.dto';
import { Newsletter } from './newsletter.entity';

@Injectable()
export class NewsletterService extends ApplicationBaseModelService<
    Newsletter,
    NewsletterDto,
    GetNewsletterResponse,
    GetNewslettersResponse
> {
    constructor(
        @InjectRepository(Newsletter)
        public readonly repository: Repository<Newsletter>,
        private referentialService: ReferentialService,
        private candidateService: CandidateService,
        private candidateApplicationService: CandidateApplicationService,
        private mailService: MailService,
        private smsService: SmsService,
    ) {
        super();

        this.modelOptions = {
            getManyResponse: GetNewslettersResponse,
            getOneResponse: GetNewsletterResponse,
            getManyResponseField: 'newsletters',
            getOneResponseField: 'newsletter',
            getManyRelations: ['newsletterStatus'],
            getOneRelations: [
                'newsletterStatus',
                'newslettersJobOffer',
                'newslettersJobOffer.jobOffer',
                'newsLettersCandidateStatus',
                'newsLettersCandidateJobs',
            ],
            repository: this.repository,
            entity: Newsletter,
            archiveField: 'disabled',
            archiveFieldValue: true,
        };
    }

    public async archiveNewslettersStatus(id: string) {
        const response = new GetNewsletterResponse();

        try {
            const getNewsletter = await this.findOne({
                where: { id: id },
                relations: ['newsletterStatus'],
            });
            const getAppType = await this.referentialService.getTypeValues({
                appTypeCode: AppTypes.NewsletterStateCode,
            });

            if (!getNewsletter.success) {
                throw new AppErrorWithMessage(
                    'Impossible to find newsletter with this id',
                );
            }

            if (!getAppType.success) {
                throw new AppErrorWithMessage('Impossible to get apptype');
            }

            const appType = getAppType.appType;
            const newsletter = getNewsletter.newsletter;

            newsletter.newsletterStatus = null;
            newsletter.newsletterStatusId = appType.appValues.find(
                (x) => x.code === NewsletterState.Archived,
            ).id;

            const saveResponse = await this.createOrUpdate(newsletter);

            if (!saveResponse.success) {
                throw new AppErrorWithMessage(response.message);
            }

            response.newsletter = saveResponse.newsletter;
            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    public async sendNewsletter(
        id: string,
        consultantEmail?: string,
    ): Promise<GenericResponse> {
        const response = new GenericResponse();

        try {
            const getNewletter = await this.repository.findOne({
                where: { id: id },
                relations: this.modelOptions.getOneRelations,
            });

            if (!getNewletter) {
                throw new AppErrorWithMessage(
                    'Unable to find newsletter with this id',
                );
            }

            const newsletterDto = getNewletter.toDto();

            if (!newsletterDto.newsLettersCandidateStatus?.length) {
                throw new AppErrorWithMessage(
                    'Vous devez préciser le statuts des candidats',
                );
            }

            const sendNewsletterSmsOrMailResponse =
                await this.sendNewsLetterMailOrSms(
                    newsletterDto,
                    false,
                    consultantEmail,
                );

            if (
                sendNewsletterSmsOrMailResponse?.newsletterId ||
                sendNewsletterSmsOrMailResponse?.listId
            ) {
                await this.getRepository().update(
                    { id: newsletterDto.id },
                    {
                        newsletterSibId:
                            sendNewsletterSmsOrMailResponse.newsletterId,
                        newsletterListSibId:
                            sendNewsletterSmsOrMailResponse.listId,
                    },
                );
            }

            console.log(
                'sendNewsletterSmsOrMailResponse line 191 => ',
                sendNewsletterSmsOrMailResponse,
            );

            if (!sendNewsletterSmsOrMailResponse?.success) {
                throw new AppErrorWithMessage(
                    "Une erreur s'est produite lors de l'envoi du mail",
                );
            }

            const getAppType = await this.referentialService.getTypeValues({
                appTypeCode: AppTypes.NewsletterStateCode,
            });

            await this.getRepository().update(
                { id: newsletterDto.id },
                {
                    sendDate: new Date(),
                    newsletterStatusId: getAppType?.appType?.appValues?.find(
                        (x) => x.code === NewsletterState.Pending,
                    )?.id,
                    candidatesCount:
                        sendNewsletterSmsOrMailResponse.contactsList?.length ||
                        0,
                    newsletterSibId:
                        sendNewsletterSmsOrMailResponse.newsletterId,
                    newsletterListSibId: sendNewsletterSmsOrMailResponse.listId,
                },
            );

            response.success = true;
        } catch (error) {
            response.handleError(error);
        }

        return response;
    }

    public async duplicateNewsletter(
        id: string,
    ): Promise<GetNewsletterResponse> {
        const response = new GetNewsletterResponse();

        try {
            let newNewsletter = new NewsletterDto();
            const getNewsletterToDuplicate = await this.findOne({
                where: { id: id },
                relations: [
                    'newsletterStatus',
                    'newslettersJobOffer',
                    'newslettersJobOffer.jobOffer',
                    'newsLettersCandidateStatus',
                ],
            });
            const getAppType = await this.referentialService.getTypeValues({
                appTypeCode: AppTypes.NewsletterStateCode,
            });

            if (!getNewsletterToDuplicate.success) {
                throw new AppErrorWithMessage(getNewsletterToDuplicate.message);
            }

            const oldNewsletter = getNewsletterToDuplicate.newsletter;
            const appType = getAppType.appType;

            newNewsletter = {
                title: oldNewsletter.title,
                content: oldNewsletter.content,
                subject: oldNewsletter.subject,
                language: oldNewsletter.language,
                cityFilter: oldNewsletter.cityFilter,
                countriesFilter: oldNewsletter.countriesFilter,
                newsletterStatusId: appType.appValues.find(
                    (x) => x.code === NewsletterState.Draft,
                ).id,
                sender: oldNewsletter.sender,
                includeCandidateApplications:
                    oldNewsletter.includeCandidateApplications,
            };

            if (oldNewsletter.newsLettersCandidateStatus?.length) {
                newNewsletter.newsLettersCandidateStatus =
                    oldNewsletter.newsLettersCandidateStatus?.map((x) => ({
                        candidateStatusId: x.candidateStatusId,
                    }));
            }

            if (oldNewsletter.newsLettersJob?.length) {
                newNewsletter.newsLettersJob =
                    oldNewsletter.newsLettersJob?.map((x) => ({
                        jobTypeId: x.jobTypeId,
                    }));
            }

            if (oldNewsletter.newslettersJobOffer?.length) {
                newNewsletter.newslettersJobOffer =
                    oldNewsletter.newslettersJobOffer?.map((x) => ({
                        jobofferId: x.jobofferId,
                    }));
            }

            const createNewNewsletterResponse = await super.createOrUpdate(
                newNewsletter,
            );

            if (!createNewNewsletterResponse.success) {
                throw new AppErrorWithMessage(
                    createNewNewsletterResponse.message,
                );
            }

            response.newsletter = createNewNewsletterResponse.newsletter;
            response.success = true;
        } catch (error) {
            response.handleError(error);
        }

        return response;
    }

    private createCandidateSubquery(
        alias: string,
        candidateIdSubQueries: string[],
    ) {
        if (!candidateIdSubQueries?.length) {
            return null;
        }

        let query = ``;

        for (const candidateIdSubQuery of candidateIdSubQueries) {
            if (!!query) {
                query += ' AND ';
            }
            query += `(${alias} IN (${candidateIdSubQuery}))`;
        }

        return query;
    }

    public async getNewsletterCandidateApplications(
        request: GetNewsletterCandidateApplicationsRequest,
        returnCandidateApplications: boolean,
    ): Promise<GetNewsletterCandidateApplicationsResponse> {
        const response = new GetNewsletterCandidateApplicationsResponse();

        try {
            const findOptions =
                BaseSearchRequest.getDefaultFindOptions<CandidateApplication>(
                    {},
                );
            const where: FindConditions<CandidateApplication> = {};

            const IdSubQueries: string[] = [];

            where.linkedToCandidate = false;
            where.candidateId = null;
            where.disabled = false;

            // if (request.candidateAdressesAlreadyLoaded?.length) {
            //     where.email = Raw(alias => `${alias} NOT IN ('${request.candidateAdressesAlreadyLoaded.join('\',\'')}')`);
            // }

            if (request.newsletterType === NewsletterType.SMS) {
                where.phone = Raw(
                    (alias) => `${alias} IS NOT NULL AND LENGTH(${alias}) > 0`,
                );
            } else {
                where.email = Raw(
                    (alias) => `${alias} IS NOT NULL AND LENGTH(${alias}) > 0`,
                );
                where.newsletterUnsubscribed = false;
                where.newsletterUnsubscribedGuid = Not(IsNull());
            }

            const addressTableName =
                getManager().getRepository(Address).metadata.tableName;

            if (request.isNewsletterFrench === 'true') {
                IdSubQueries.push(
                    `SELECT DISTINCT(candidateApplicationId) FROM \`${addressTableName}\` WHERE country='FR'`,
                );
            } else {
                IdSubQueries.push(
                    `SELECT DISTINCT(candidateApplicationId) FROM \`${addressTableName}\` WHERE (country IS NULL OR country<>'FR' )`,
                );
            }

            if (request.jobIds?.length) {
                const jobIds = request.jobIds.split(',');
                if (jobIds?.length) {
                    where.professionId = In(jobIds);
                }
            }

            if (IdSubQueries.length) {
                where.id = Raw((alias) => {
                    const query = this.createCandidateSubquery(
                        alias,
                        IdSubQueries,
                    );
                    return query;
                });
            }

            findOptions.where = where;
            delete findOptions.take;
            delete findOptions.skip;

            if (returnCandidateApplications) {
                findOptions.select = [
                    'id',
                    'email',
                    'phone',
                    'firstName',
                    'lastName',
                    'phoneSecondary',
                    'newsletterUnsubscribedGuid',
                ];
                response.candidateApplications = [];
                const groupCount = 20000;
                findOptions.take = groupCount;
                let continueLoop = true;
                let index = 0;

                while (continueLoop) {
                    findOptions.skip = index * groupCount;
                    const candidateApplicationsFromDb =
                        await this.candidateApplicationService
                            .getRepository()
                            .find(findOptions);

                    if (candidateApplicationsFromDb?.length) {
                        response.candidateApplications =
                            response.candidateApplications.concat(
                                candidateApplicationsFromDb.map((x) =>
                                    x.toDto(),
                                ),
                            );
                        continueLoop =
                            candidateApplicationsFromDb?.length >= groupCount;
                    } else {
                        continueLoop = false;
                    }

                    index++;
                }

                if (request.candidateAdressesAlreadyLoaded?.length) {
                    request.candidateAdressesAlreadyLoaded =
                        request.candidateAdressesAlreadyLoaded
                            .filter((x) => !!x)
                            .map((x) => x.trim().toLowerCase());
                    response.candidateApplications =
                        response.candidateApplications.filter(
                            (x) =>
                                !request.candidateAdressesAlreadyLoaded.some(
                                    (y) => y === x.email.toLowerCase().trim(),
                                ),
                        );
                    response.candidateApplications =
                        response.candidateApplications.filter((x) =>
                            SharedService.isValidEmail(x.email),
                        );
                }
            } else {
                response.candidateApplicationsCount =
                    await this.candidateApplicationService.repository.count(
                        findOptions,
                    );
            }

            response.success = true;
        } catch (error) {
            response.handleError(error);
        }

        return response;
    }

    public async getNewsletterCandidates(
        request: GetCandidatesCountRequest,
        returnCandidates: boolean,
    ): Promise<GetCandidatesCountResponse> {
        const response = new GetCandidatesCountResponse();

        try {
            const findOptions =
                BaseSearchRequest.getDefaultFindOptions<Candidate>({});
            const where: FindConditions<Candidate> = {};

            if (request.newsletterType === NewsletterType.SMS) {
                where.phone = Raw(
                    (alias) => `${alias} IS NOT NULL AND LENGTH(${alias}) > 0`,
                );
            } else {
                where.email = Raw(
                    (alias) => `${alias} IS NOT NULL AND LENGTH(${alias}) > 0`,
                );
                where.newsletterUnsubscribed = false;
                where.newsletterUnsubscribedGuid = Not(IsNull());
            }

            where.disabled = false;

            if (request.statusIds?.length) {
                const statusIds = request.statusIds.split(',');

                if (statusIds?.length) {
                    where.candidateStatusId = In(statusIds);
                }
            }

            const candidateIdSubQueries: string[] = [];
            const addressTableName =
                getManager().getRepository(Address).metadata.tableName;

            if (request.jobIds?.length) {
                const jobIds = request.jobIds.split(',');

                if (jobIds?.length) {
                    const candidateJobsTableName =
                        getManager().getRepository(CandidateCurrentJob).metadata
                            .tableName;

                    candidateIdSubQueries.push(
                        `SELECT candidateId FROM \`${candidateJobsTableName}\` WHERE \`${candidateJobsTableName}\`.currentJobId IN("${jobIds.join(
                            '","',
                        )}") `,
                    );
                }
            }

            if (request.cityFilter) {
                console.log(
                    'request.cityFilter => ',
                    typeof request.cityFilter,
                );

                // Handle both string and array inputs for backward compatibility
                let cityArray: string[];
                if (Array.isArray(request.cityFilter)) {
                    cityArray = request.cityFilter;
                } else if (typeof request.cityFilter === 'string') {
                    cityArray = (request.cityFilter as string)
                        .split(',')
                        .filter((city) => city.trim());
                } else {
                    cityArray = [];
                }

                if (cityArray.length > 0) {
                    const cityConditions = cityArray
                        .map((city) => `city LIKE '%${city.trim()}%'`)
                        .join(' OR ');
                    candidateIdSubQueries.push(
                        `SELECT candidateId FROM \`${addressTableName}\` WHERE (${cityConditions})`,
                    );
                }
            }

            if (request.countriesFilter) {
                const countries = request.countriesFilter.split(',');

                if (countries?.length) {
                    candidateIdSubQueries.push(
                        `SELECT candidateId FROM \`${addressTableName}\` WHERE country IN ("${countries.join(
                            '","',
                        )}")`,
                    );
                }
            }

            const subquery = this.createCandidateSubquery(
                'id',
                candidateIdSubQueries,
            );

            if (subquery) {
                where.id = Raw((alias) => subquery);
            }

            findOptions.where = where;
            delete findOptions.take;
            delete findOptions.skip;

            if (returnCandidates) {
                findOptions.select = [
                    'id',
                    'email',
                    'phone',
                    'firstName',
                    'lastName',
                    'newsletterUnsubscribedGuid',
                    'phoneSecondary',
                ];
                let candidatesFromDb = await this.candidateService
                    .getRepository()
                    .find(findOptions);
                candidatesFromDb = candidatesFromDb.filter((x) =>
                    SharedService.isValidEmail(x.email),
                );
                response.candidates = candidatesFromDb.map((x) => x.toDto());
            } else {
                response.candidatesCount =
                    await this.candidateService.repository.count(findOptions);
            }

            response.success = true;
        } catch (error) {
            response.handleError(error);
        }

        return response;
    }

    async previewNewsletter(newsletterId: string) {
        const response = await this.findOne({ where: { id: newsletterId } });

        if (
            !response.newsletter ||
            response.newsletter.type !== NewsletterType.Email
        ) {
            return new GenericResponse(false);
        }

        return await this.sendNewsLetterMailOrSms(
            response?.newsletter,
            true,
            undefined,
        );
    }

    private getContactsListFromNewsletterRequest(
        candidates: CandidateDto[],
        candidateApplications: CandidateApplicationDto[],
    ): EmailAddress[] {
        let adresses: EmailAddress[] = candidates.map<EmailAddress>((x) => {
            return {
                address: x.email,
                name: x.email,
                unsubscribeGuid: x.newsletterUnsubscribedGuid,
                contactFirstName: x.firstName,
                contactLastName: x.lastName,
                contactPhone: x.phone || x.phoneSecondary,
            };
        });

        if (candidateApplications?.length) {
            const addressMailsList = adresses.map((y) => y.address);
            const candidateApplicationsFiltered = candidateApplications.filter(
                (x) => !addressMailsList.some((z) => z === x.email),
            );
            const emailAddressesToAdd =
                candidateApplicationsFiltered.map<EmailAddress>((x) => {
                    return {
                        address: x.email,
                        name: x.email,
                        contactFirstName: x.firstName,
                        contactLastName: x.lastName,
                        contactPhone: x.phone || x.phoneSecondary,
                        unsubscribeGuid: x.newsletterUnsubscribedGuid,
                    };
                });
            adresses = adresses.concat(emailAddressesToAdd);
        }

        return adresses;
    }

    private async getDataNewsletterFromNewsletterDto(
        newsletterDto: NewsletterDto,
        loadCandidates: boolean,
        consultantEmail?: string,
    ): Promise<EmailDataNewsletterWithTemplate | SMSDataNewsletter> {
        let contactsList: EmailAddress[] = [];

        if (loadCandidates) {
            let candidates: CandidateDto[] = [];
            // if (newsletterDto.newsLettersCandidateStatus?.length || newsletterDto.newsLettersJob?.length) {
            let jobIdsJoined: string = null;

            if (newsletterDto.newsLettersJob?.length) {
                jobIdsJoined = newsletterDto.newsLettersJob
                    .map((x) => x.jobTypeId)
                    ?.join(',');
            }

            const statusIdsJoined = newsletterDto.newsLettersCandidateStatus
                .map((x) => x.candidateStatusId)
                ?.join(',');

            const getCandidates = await this.getNewsletterCandidates(
                {
                    jobIds: jobIdsJoined,
                    statusIds: statusIdsJoined,
                    isNewsletterFrench:
                        newsletterDto.language === NewsletterLanguage.FR
                            ? 'true'
                            : 'false',
                    newsletterType: newsletterDto.type,
                    cityFilter: newsletterDto.cityFilter,
                    countriesFilter: newsletterDto.countriesFilter,
                },
                true,
            );

            if (!getCandidates.success) {
                throw new AppErrorWithMessage(getCandidates.message);
            }

            candidates = getCandidates.candidates;
            newsletterDto.candidatesCount = candidates.length;

            let candidateApplications: CandidateApplicationDto[] = [];

            if (newsletterDto.includeCandidateApplications) {
                const getCandidateApplications =
                    await this.getNewsletterCandidateApplications(
                        {
                            candidateAdressesAlreadyLoaded:
                                getCandidates.candidates?.map((x) => x.email),
                            isNewsletterFrench:
                                newsletterDto.language === NewsletterLanguage.FR
                                    ? 'true'
                                    : 'false',
                            newsletterType: newsletterDto.type,
                            jobIds: jobIdsJoined,
                        },
                        true,
                    );

                if (!getCandidateApplications.success) {
                    throw new AppErrorWithMessage(
                        getCandidateApplications.message,
                    );
                }

                candidateApplications =
                    getCandidateApplications.candidateApplications;
                newsletterDto.candidateApplicationsCount =
                    candidateApplications.length;
            }

            if (!candidates?.length && !candidateApplications?.length) {
                throw new AppErrorWithMessage(
                    'Aucun destinataire ne peut recevoir cette newsletter',
                );
            }

            contactsList = this.getContactsListFromNewsletterRequest(
                candidates,
                candidateApplications,
            );
        }

        if (newsletterDto.type === NewsletterType.Email) {
            let mailContent = newsletterDto.content || '';
            mailContent = MainHelpers.escapeHTML(mailContent);
            mailContent = MainHelpers.replaceAll(mailContent, '\n', '<br/>');
            const sendNoReply = [
                'morgan@morganmallet.agency',
                'laurine@morganmallet.agency',
            ];
            const mailSender =
                consultantEmail && !sendNoReply.includes(consultantEmail)
                    ? consultantEmail
                    : 'no-reply@morganmallet.agency';

            if (!newsletterDto.language) {
                newsletterDto.language = NewsletterLanguage.EN;
            }

            const jobOffersTitle = await TranslationService.getTranslation(
                newsletterDto.language,
                'Newsletter.JobOffersYouMightWant',
            );
            const jobOfferContentTitle =
                await TranslationService.getTranslation(
                    newsletterDto.language,
                    'Global.Title',
                );

            const newsletterFrench =
                newsletterDto.language === NewsletterLanguage.FR;
            const languageCode = newsletterFrench ? 'fr' : 'en';

            // Group job offers by country
            const jobOffersByCountry = this.groupJobOffersByCountry(
                newsletterDto.newslettersJobOffer.map((x) => x.joboffer),
                languageCode,
            );

            const templateValues = {
                language: languageCode,
                mailContent: mailContent,
                jobOffersTitle: jobOffersTitle,
                jobOffersByCountry: jobOffersByCountry,
                jobOfferContentTitle: jobOfferContentTitle,
                isFrench: newsletterFrench,
                jobOfferSeeMoreLink: newsletterFrench
                    ? 'https://www.personneldemaison.agency/offres-d-emplois'
                    : 'https://www.householdstaff.agency/jobs',
                unsubcribeLink:
                    Environment.BaseURL +
                    '/' +
                    RoutesList.UnsubscribeNewsletter +
                    '/{{contact.UNSUBSCRIBEGUID}}',
            };

            const fromObj: { address: string; name: string } = {
                address: mailSender,
                name: 'Morgan & Mallet International',
            };

            return {
                from: fromObj,
                replyTo: mailSender,
                subject: newsletterDto.subject,
                to: contactsList,
                templateName: 'new_mail_newsletter.mjml',
                templateValues: templateValues,
                useHandleBars: true,
                compileMjmlTemplate: true,
                sendOnCreate: true,
                newsLetterName: newsletterDto.title || null,
                sendWithFileUrl: true,
            } as EmailDataNewsletterWithTemplate;
        } else if (newsletterDto.type === NewsletterType.SMS) {
            const fromObj: { address: string; name: string } = {
                address: '',
                name: '',
            };

            fromObj.name = 'Morgan & Mallet International';
            fromObj.address = 'no-reply@morganmallet.agency';

            return {
                to: contactsList,
                sendOnCreate: false,
                newsLetterName: newsletterDto.title || null,
                content: newsletterDto.content,
                sender: 'Morgan & Mallet International',
                sendWithFileUrl: true,
            } as SMSDataNewsletter;
        }

        return null;
    }

    private async sendNewsLetterMailOrSms(
        newsletterDto: NewsletterDto,
        preview: boolean,
        consultantEmail?: string,
    ): Promise<SendNewsletterWithContactsResponse> {
        const testMode = Environment.EnvName !== 'production';

        let sendMailResponse: SendNewsletterWithContactsResponse =
            new SendNewsletterWithContactsResponse();

        if (!newsletterDto) {
            return sendMailResponse;
        }

        const newsletterData = await this.getDataNewsletterFromNewsletterDto(
            newsletterDto,
            !preview,
            consultantEmail,
        );

        console.log('newsletterData => ', newsletterData);

        // Show number of contacts
        console.log('newsletterData.to.length => ', newsletterData.to.length);

        /* If we are in preview mode, we need to prepare the mail */
        if (newsletterDto.type === NewsletterType.Email) {
            // eslint-disable-next-line max-len
            // const formatJobOffer = mailData.newsLetter.newslettersJobOffer.map(x => (`<li> Titre : ${x.joboffer.title} </li><br/><li> Ref : ${x.joboffer.ref} </li><br/><li> Contenu : ${(x.joboffer.jobDescription.length > 100) ? x.joboffer.jobDescription.substring(0, 100) : x.joboffer.jobDescription} </li><br/><br/><a href="${x.joboffer.publicLink}"> Cliquez ici pour consulter l'annonce. </a>`)).join(" ");
            if (preview) {
                sendMailResponse = await this.mailService.prepareMail(
                    newsletterData,
                );
                return sendMailResponse;
            }
        }

        // If we are not in test mode, we need to check if we have enough credits
        if (!testMode) {
            // if (newsletterDto.type === NewsletterType.SMS) {
            //     sendMailResponse = await this.smsService.createNewsletterList(newsletterData as SMSDataNewsletter);
            // }
            const sibAccountData = await this.mailService.getSibAccountData();

            if (sibAccountData.success) {
                const sibType =
                    newsletterDto.type === NewsletterType.SMS
                        ? 'sms'
                        : 'subscription';
                let credits;

                if (sibType === 'subscription') {
                    // For subscription type, add credits from both subscription and payAsYouGo plans
                    const subscriptionCredits =
                        sibAccountData.data?.plan?.find(
                            (x) => x.type === 'subscription',
                        )?.credits || 0;
                    const payAsYouGoCredits =
                        sibAccountData.data?.plan?.find(
                            (x) => x.type === 'payAsYouGo',
                        )?.credits || 0;
                    credits = subscriptionCredits + payAsYouGoCredits;
                } else {
                    // For SMS type, use the original logic
                    credits = sibAccountData.data?.plan?.find(
                        (x) => x.type === sibType,
                    )?.credits;
                }

                if (credits != null) {
                    const delta =
                        newsletterDto.type === NewsletterType.SMS ? 0 : 2000; //delta pour qu'il reste toujours des mails pour le CRM
                    const coeff =
                        newsletterDto.type === NewsletterType.SMS ? 4.5 : 1; //coeff credits sms sendinblue

                    credits = credits / coeff;
                    const initialCredits = credits;
                    let smsCount = 0;

                    if (newsletterDto.type === NewsletterType.SMS) {
                        smsCount = SharedService.getSMSCountFromText(
                            newsletterDto.content,
                        );
                        credits = Math.floor(credits / smsCount);
                    }

                    if (newsletterData.to.length >= credits - delta) {
                        console.log('newsletter service line 907');
                        console.log(
                            'newsletterData.to.length => ',
                            newsletterData.to.length,
                        );
                        console.log('credits => ', credits);
                        console.log('delta => ', delta);
                        console.log('initialCredits => ', initialCredits);
                        console.log('newsletter service line end of line 907');

                        throw new AppErrorWithMessage(
                            'Crédits ' +
                                (newsletterDto.type === NewsletterType.SMS
                                    ? 'SMS'
                                    : 'e-mails') +
                                ' insuffisant - crédits restants : ' +
                                (newsletterDto.type === NewsletterType.SMS
                                    ? initialCredits +
                                      '/' +
                                      smsCount +
                                      '=' +
                                      credits
                                    : credits),
                        );
                    }
                }
            }
        }

        if (testMode) {
            sendMailResponse = await this.mailService.sendMail(newsletterData);

            if (sendMailResponse.success) {
                sendMailResponse.newsletterId =
                    'test_newsletter_local_' + MainHelpers.generateGuid();
                sendMailResponse.listId =
                    'test_newsletter_local_' + MainHelpers.generateGuid();
            }
        } else {
            if (newsletterDto.type === NewsletterType.Email) {
                sendMailResponse = await this.mailService.createNewsletterList(
                    newsletterData,
                );
            } else if (newsletterDto.type === NewsletterType.SMS) {
                sendMailResponse = await this.smsService.createNewsletterList(
                    newsletterData as SMSDataNewsletter,
                );
            }
        }

        newsletterDto.newsletterSibId = sendMailResponse.newsletterId;
        newsletterDto.newsletterListSibId = sendMailResponse.listId;
        sendMailResponse.contactsList = newsletterData.to;

        return sendMailResponse;
    }

    /**
     * Groups job offers by country, sorted alphabetically by country name.
     * Jobs without a country are grouped under "Other" (or "Autres" in French).
     */
    private groupJobOffersByCountry(
        jobOffers: any[],
        language: string,
    ): {
        left: { countryName: string; jobs: any[] } | null;
        right: { countryName: string; jobs: any[] } | null;
    }[] {
        if (!jobOffers?.length) {
            return [];
        }

        const otherLabel = language === 'fr' ? 'Autres' : 'Other';

        // Group jobs by country
        const countryMap = new Map<string, any[]>();

        for (const job of jobOffers) {
            const countryName = job.country
                ? normalizeCountryName(job.country, language)
                : otherLabel;

            if (!countryMap.has(countryName)) {
                countryMap.set(countryName, []);
            }
            countryMap.get(countryName).push(job);
        }

        // Convert to array and sort alphabetically, with "Other" at the end
        const sortedCountries = Array.from(countryMap.entries())
            .map(([countryName, jobs]) => ({
                countryName,
                jobs: jobs.sort((a, b) =>
                    (a.title || '').localeCompare(b.title || ''),
                ),
            }))
            .sort((a, b) => {
                // "Other" always at the end
                if (a.countryName === otherLabel) return 1;
                if (b.countryName === otherLabel) return -1;
                return a.countryName.localeCompare(b.countryName);
            });

        // Create pairs for 2-column layout
        const pairs: {
            left: { countryName: string; jobs: any[] } | null;
            right: { countryName: string; jobs: any[] } | null;
        }[] = [];

        for (let i = 0; i < sortedCountries.length; i += 2) {
            pairs.push({
                left: sortedCountries[i],
                right: sortedCountries[i + 1] || null,
            });
        }

        return pairs;
    }

    async createOrUpdate(
        newsletterDto: NewsletterDto,
        consultantEmail?: string,
    ): Promise<GetNewsletterResponse> {
        if (!newsletterDto.id) {
            const getNewsletterStatusResponse =
                await this.referentialService.getTypeValues({
                    appTypeCode: AppTypes.NewsletterStateCode,
                });
            newsletterDto.newsletterStatusId =
                getNewsletterStatusResponse.appType.appValues.find(
                    (x) => x.code === NewsletterState.Draft,
                ).id;
        }

        return await super.createOrUpdate(newsletterDto);
    }

    public async unsubscribeFromNewsletter(
        request: UnsubscribeFromNewsletterRequest,
    ): Promise<GenericResponse> {
        const response = new GenericResponse();

        try {
            //try with candidate
            const getCandidateResponse = await this.candidateService.findOne({
                where: { newsletterUnsubscribedGuid: request.guid },
                select: ['id'],
            });

            if (getCandidateResponse?.candidate) {
                await this.candidateService
                    .getRepository()
                    .update(
                        { id: getCandidateResponse.candidate.id },
                        { newsletterUnsubscribed: true },
                    );
            } else {
                //try with candidate application
                const getCandidateApplicationResponse =
                    await this.candidateApplicationService.findOne({
                        where: { newsletterUnsubscribedGuid: request.guid },
                        select: ['id'],
                    });

                if (getCandidateApplicationResponse.candidateApplication) {
                    await this.candidateApplicationService
                        .getRepository()
                        .update(
                            {
                                id: getCandidateApplicationResponse
                                    .candidateApplication.id,
                            },
                            { newsletterUnsubscribed: true },
                        );
                } else {
                    throw new AppErrorWithMessage('Lien invalide');
                }
            }

            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    public async refreshNewsletterLoop() {
        const response = new GenericResponse(true);

        try {
            if (Environment.EnvName !== 'production') {
                return response;
            }

            const getAppType = await this.referentialService.getTypeValues({
                appTypeCode: AppTypes.NewsletterStateCode,
            });
            const pendingStatus = getAppType?.appType?.appValues?.find(
                (x) => x.code === NewsletterState.Pending,
            )?.id;
            const sentStatus = getAppType?.appType?.appValues?.find(
                (x) => x.code === NewsletterState.Sent,
            )?.id;
            const sentSibStatus = getAppType?.appType?.appValues?.find(
                (x) => x.code === NewsletterState.Sent_SendInBlue,
            )?.id;

            if (!sentStatus || !sentSibStatus || !pendingStatus) {
                return;
            }

            const statusIds = [pendingStatus, sentStatus];

            // const newsletterResponse = await this.findAll({ where: { newsletterStatusId: In(statusIds), disabled: false, newsletterListSibId: Not(IsNull()) }, relations: this.modelOptions.getOneRelations });
            const newsletterResponse = await this.findAll({
                where: {
                    newsletterStatusId: In(statusIds),
                    disabled: false,
                    newsletterListSibId: Not(IsNull()),
                },
                select: ['id'],
            });

            if (newsletterResponse.newsletters?.length) {
                AppLogger.log(
                    'refresh newsletter loop  - ' +
                        newsletterResponse.newsletters.length +
                        ' to treat',
                );

                for (const newsletterIdWrapper of newsletterResponse.newsletters) {
                    const newsletterEntity = await this.getRepository().findOne(
                        {
                            where: { id: newsletterIdWrapper.id },
                            relations: this.modelOptions.getOneRelations,
                        },
                    );
                    const newsletter = newsletterEntity.toDto();

                    if (newsletter.newsletterStatusId === sentStatus) {
                        if (!newsletter.newsletterSibId) {
                            AppLogger.log(
                                'ignoring update newsletter : no newsletterSibId',
                            );
                            continue;
                        }

                        AppLogger.log(
                            'refresh newsletter loop  - getting stat from sib',
                        );

                        await this.syncSibNewsletter(newsletter, sentSibStatus);
                        continue;
                    }

                    if (newsletter.newsletterStatusId === pendingStatus) {
                        if (!newsletter.newsletterListSibId) {
                            AppLogger.log(
                                'ignoring send newsletter : no newsletterListSibId',
                            );
                            continue;
                        }

                        if (!!newsletter.newsletterSibId) {
                            AppLogger.error(
                                'unable to send newsletter => sib id already set',
                            );
                            continue;
                        }

                        const now = DateHelpers.convertUTCDateToLocalDate(
                            new Date(),
                        );
                        const diffMinutes = DateHelpers.diffMinutes(
                            now,
                            newsletter.modifDate,
                        );

                        if (diffMinutes >= 10) {
                            let sendNewsletterResponse: SendNewsletterResponse;
                            let testMode = true;

                            if (Environment.EnvName === 'production') {
                                testMode = false;
                            }

                            const newsletterData =
                                await this.getDataNewsletterFromNewsletterDto(
                                    newsletter,
                                    false,
                                );

                            if (!newsletterData) {
                                AppLogger.error(
                                    'unable to send newsletter => no newsletterData',
                                );
                                continue;
                            }

                            if (testMode) {
                                sendNewsletterResponse = new GenericResponse(
                                    true,
                                );
                            } else {
                                if (newsletter.type === NewsletterType.Email) {
                                    sendNewsletterResponse =
                                        await this.mailService.sendNewsletterWithListId(
                                            newsletterData as EmailDataNewsletterWithTemplate,
                                            newsletter.newsletterListSibId,
                                        );
                                } else if (
                                    newsletter.type === NewsletterType.SMS
                                ) {
                                    sendNewsletterResponse =
                                        await this.smsService.sendNewsletterWithListId(
                                            newsletterData as SMSDataNewsletter,
                                            newsletter.newsletterListSibId,
                                        );
                                }
                            }

                            if (!sendNewsletterResponse) {
                                AppLogger.error(
                                    'unable to send newsletter => no sendNewsletterResponse',
                                );
                                continue;
                            }

                            const newsletterPartial: Partial<Newsletter> = {};

                            newsletterPartial.newsletterSibId =
                                sendNewsletterResponse.newsletterId;
                            let mustUpdate = false;

                            if (newsletterPartial.newsletterSibId) {
                                newsletterPartial.sendDate = new Date();
                                newsletterPartial.newsletterStatusId =
                                    sentStatus;
                                newsletterPartial.htmlFullContent = (
                                    newsletterData as EmailDataNewsletterWithTemplate
                                ).htmlBody;
                                mustUpdate = true;

                                AppLogger.log(
                                    'refresh newsletter loop  - ' +
                                        newsletter.id +
                                        ' sent to SIB',
                                );
                            } else {
                                AppLogger.error(
                                    'unable to send newsletter => ',
                                    sendNewsletterResponse.error,
                                );
                            }
                            if (mustUpdate) {
                                await this.getRepository().update(
                                    { id: newsletter.id },
                                    newsletterPartial,
                                );
                            }
                        }
                    }
                }
            }

            response.success = true;
        } catch (error) {
            response.handleError(error);
        }

        return response;
    }

    async syncSibNewsletter(
        newsletter: NewsletterDto,
        sentSibStatusId: string,
    ): Promise<GenericResponse> {
        const response = new GenericResponse();

        try {
            if (Environment.EnvName !== 'production') {
                return response;
            }

            if (!newsletter.newsletterSibId) {
                throw new Error('syncSibNewsletter : no newsletterSibId !');
            }

            let sibResponse: GenericResponseWithData<
                SendInBlueNewsletterReportSms | SendInBlueNewsletterReportMail
            >;

            if (newsletter.type === NewsletterType.SMS) {
                sibResponse = await this.smsService.getNewsletter(
                    newsletter.newsletterSibId,
                );
            } else if (newsletter.type === NewsletterType.Email) {
                sibResponse = await this.mailService.getNewsletter(
                    newsletter.newsletterSibId,
                );
            }

            // console.log("Log ~ file: newsletter.service.ts ~ line 536 ~ syncSibNewsletter ~ sibResponse", sibResponse);
            if (sibResponse.success && sibResponse?.data.statistics) {
                const status = sibResponse.data.status;

                if (status === 'sent') {
                    //const stats = sibResponse?.data?.statistics;
                    let sentCount = 0;
                    let deliveredCount = 0;
                    let answeredCount = 0;
                    let unsubscriptionsCount = 0;
                    let openedCount = 0;
                    let clickedCount = 0;

                    if (newsletter.type === NewsletterType.SMS) {
                        const sibResponseTyped =
                            sibResponse.data as SendInBlueNewsletterReportSms;

                        sentCount = sibResponseTyped.statistics?.sent || 0;
                        answeredCount =
                            sibResponseTyped.statistics?.answered || 0;
                        unsubscriptionsCount =
                            sibResponseTyped.statistics?.unsubscriptions || 0;
                        deliveredCount =
                            sibResponseTyped.statistics?.delivered || 0;
                    } else if (newsletter.type === NewsletterType.Email) {
                        const sibResponseTyped =
                            sibResponse.data as SendInBlueNewsletterReportMail;

                        sentCount =
                            sibResponseTyped.statistics?.globalStats?.sent || 0;
                        unsubscriptionsCount =
                            sibResponseTyped.statistics?.globalStats
                                ?.unsubscriptions || 0;
                        deliveredCount =
                            sibResponseTyped.statistics?.globalStats
                                ?.delivered || 0;
                        openedCount =
                            sibResponseTyped.statistics?.globalStats?.viewed ||
                            0;
                        clickedCount =
                            sibResponseTyped.statistics?.globalStats
                                ?.clickers || 0;
                    }
                    // console.log("Log ~ file: newsletter.service.ts ~ line 544 ~ syncSibNewsletter ~ status", status);
                    // console.log("Log ~ file: newsletter.service.ts ~ line 542 ~ syncSibNewsletter ~ stats", stats);

                    await this.getRepository().update(
                        { id: newsletter.id },
                        {
                            newsletterStatusId: sentSibStatusId,
                            sentCount: sentCount,
                            answeredCount: answeredCount,
                            unsubscriptionsCount: unsubscriptionsCount,
                            deliveredCount: deliveredCount,
                            openedCount: openedCount,
                            clickedCount: clickedCount,
                        },
                    );

                    AppLogger.log('syncSibNewsletter  - Success');
                }

                response.success = true;
            }
        } catch (error) {
            response.handleError(error);
        }

        return response;
    }

    async cleanNewsletterRecipients() {
        const response = new GenericResponse();

        try {
            const candidatesFilter: FindConditions<Candidate> = {};
            const updateData = true;
            const candidatesCleaned: string[] = [];
            const candidatesApplicationsCleaned: string[] = [];

            candidatesFilter.newsletterUnsubscribed = false;
            candidatesFilter.email = Not(IsNull());

            const candidates = await this.candidateService
                .getRepository()
                .find({ select: ['id', 'email'], where: candidatesFilter });

            for (const candidate of candidates) {
                if (!SharedService.emailCanBeSent(candidate.email)) {
                    if (updateData) {
                        await this.candidateService
                            .getRepository()
                            .update(
                                { id: candidate.id },
                                { newsletterUnsubscribed: true },
                            );
                    }

                    candidatesCleaned.push(candidate.email);
                }
            }

            const candidatesApplicationFilter: FindConditions<CandidateApplication> =
                {};
            candidatesApplicationFilter.newsletterUnsubscribed = false;
            candidatesApplicationFilter.email = Not(IsNull());

            const candidateApplications = await this.candidateApplicationService
                .getRepository()
                .find({
                    select: ['id', 'email'],
                    where: candidatesApplicationFilter,
                });

            for (const candidateApplication of candidateApplications) {
                if (!SharedService.emailCanBeSent(candidateApplication.email)) {
                    if (updateData) {
                        await this.candidateApplicationService
                            .getRepository()
                            .update(
                                { id: candidateApplication.id },
                                { newsletterUnsubscribed: true },
                            );
                    }
                    candidatesApplicationsCleaned.push(
                        candidateApplication.email,
                    );
                }
            }

            // console.log("Log ~ cleanNewsletterRecipients ~ candidatesApplicationsCleaned:", candidatesApplicationsCleaned);
            response.message =
                'Candidates cleaned : ' +
                candidatesCleaned.length +
                ' - CandidateApplications cleaned : ' +
                candidatesApplicationsCleaned.length;
            // console.log("Log ~ cleanNewsletterRecipients ~ response.message :", response.message);
            response.success = true;
        } catch (error) {
            response.handleError(error);
        }

        return response;
    }
}
