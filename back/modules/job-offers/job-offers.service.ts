import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as puppeteer from 'puppeteer';
import { Repository } from 'typeorm';
import { SharedCandidatesHelpers } from '../../../shared/candidates-helpers';
import { JobOfferState } from '../../../shared/shared-constants';
import { AppErrorWithMessage } from '../../models/app-error';
import { GenericResponse } from '../../models/responses/generic-response';
import { ApplicationBaseModelService } from '../../services/base-model.service';
import { ReferentialService } from '../../services/referential.service';
import { MailService } from '../../services/tools/mail.service';
import {
    GetJobOfferResponse,
    GetJobOffersResponse,
    JobOfferDto,
    SendJobOfferByMailRequest,
} from './job-offer-dto';
import { JobOffer } from './job-offer.entity';

@Injectable()
export class JobOfferService extends ApplicationBaseModelService<
    JobOffer,
    JobOfferDto,
    GetJobOfferResponse,
    GetJobOffersResponse
> {
    constructor(
        @InjectRepository(JobOffer)
        public readonly repository: Repository<JobOffer>,
        private mailService: MailService,
        private referentialService: ReferentialService,
    ) {
        super();

        this.modelOptions = {
            getManyResponse: GetJobOffersResponse,
            getOneResponse: GetJobOfferResponse,
            getManyResponseField: 'jobOffers',
            getOneResponseField: 'jobOffer',
            getManyRelations: [
                'consultant',
                'customer',
                'contractType',
                'contractType.translations',
                'state',
                'job',
                'state.translations',
            ],
            getOneRelations: [
                'consultant',
                'consultant.image',
                'job',
                'contractType',
                'customer',
                'state',
                'state.translations',
            ],
            repository: this.repository,
            entity: JobOffer,
            archiveField: 'disabled',
            archiveFieldValue: true,
        };
    }

    async createOrUpdate(
        dto: JobOfferDto,
        ...toDtoParameters: any
    ): Promise<GetJobOfferResponse> {
        const getAppValueResponse =
            await this.referentialService.getOneAppValue(
                JobOfferState.Activated,
            );

        if (!getAppValueResponse.success) {
            throw new AppErrorWithMessage('Error');
        }

        if (!dto.stateId) {
            dto.stateId = getAppValueResponse.appValue.id;
        }

        const getJobOfferResponse = await super.findOne({
            where: { ref: dto.ref },
        });

        if (getJobOfferResponse.success && getJobOfferResponse.jobOffer) {
            if (getJobOfferResponse.jobOffer.id !== dto.id) {
                throw new AppErrorWithMessage('Reference existante');
            }
        }

        return super.createOrUpdate(dto, toDtoParameters);
    }

    async findAllExcludingPlaced(
        findOptions: any,
    ): Promise<GetJobOffersResponse> {
        // Get all job offers first
        const allJobOffers = await this.findAll(findOptions);

        if (!allJobOffers.success) {
            return allJobOffers;
        }

        // Get job offer IDs that have candidates placed to them
        const placedJobOfferIds = await this.repository
            .createQueryBuilder('jobOffer')
            .select('jobOffer.id')
            .innerJoin(
                'candidates',
                'candidate',
                'candidate.placedJobOfferId = jobOffer.id',
            )
            .where('candidate.placedJobOfferId IS NOT NULL')
            .getMany();

        const placedIds = placedJobOfferIds.map((jobOffer) => jobOffer.id);

        // Filter out job offers that have placed candidates
        allJobOffers.jobOffers = allJobOffers.jobOffers.filter(
            (jobOffer) => !placedIds.includes(jobOffer.id),
        );

        // Update the filtered results count
        allJobOffers.filteredResults = allJobOffers.jobOffers.length;

        return allJobOffers;
    }

    async scrapping() {
        let lastJobOffer = 1800;

        const response = new GenericResponse();

        try {
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox'],
            });
            const page = await browser.newPage();
            console.log('before');
            page.setJavaScriptEnabled(false);

            const httpResponse = await page.goto(
                'https://www.personneldemaison.agency/jobs--emplois-personnel-de-maison.html',
            );
            // await page.screenshot({ path: 'example.png' });
            console.log('after');

            if (!httpResponse.ok()) {
                throw new AppErrorWithMessage('httpResponse not ok');
            }

            const links = await page.evaluate(() => {
                const data: string[] = [];
                // let elements = document.getElementsByClassName('myclass');
                const elements: NodeListOf<HTMLAnchorElement> =
                    document.querySelectorAll(
                        'div.wsite-section-elements div.imageGallery div.galleryImageHolder div.galleryInnerImageHolder a',
                    );

                for (const element of elements) {
                    data.push(element.href);
                }

                return data;
            });

            console.log(
                'Log ~ file: job-offers.service.ts ~ line 47 ~ JobOfferService ~ links ~ links',
                links,
            );

            let counter = 0;

            for (const link of links) {
                if (counter === 1) {
                    break;
                }
                const httpResponseForLink = await page.goto(link);

                if (!httpResponseForLink.ok()) {
                    throw new AppErrorWithMessage('httpResponseForLink not ok');
                }

                const jobOfferDataListResult = await page.evaluate(
                    (argLastJobOffer) => {
                        const jobOfferDataList: JobOfferDto[] = [];
                        // let elements = document.getElementsByClassName('myclass');
                        const elements: NodeListOf<HTMLAnchorElement> =
                            document.querySelectorAll(
                                'div.wsite-multicol .wsite-multicol-col',
                            );

                        if (elements.length === 0) {
                            return [];
                        }

                        for (const element of elements) {
                            // data.push(element.href);

                            const refElements: NodeListOf<HTMLAnchorElement> =
                                element.querySelectorAll('.paragraph ul li');

                            const jobOfferData: JobOfferDto = {} as any;

                            if (
                                !refElements?.length ||
                                refElements[0].textContent.indexOf(
                                    'Référence: ',
                                ) === -1
                            ) {
                                continue;
                            }

                            let refJobOffer =
                                refElements[0].textContent.split(
                                    'Référence: ',
                                )[1];

                            refJobOffer = refJobOffer.trim();
                            // refJobOffer = refElements[0].textContent;

                            if (!refJobOffer) {
                                continue;
                            }

                            const refSplitted = refJobOffer.split(' ');
                            const refNumber = parseInt(refSplitted[0], 10);

                            if (isNaN(refNumber)) {
                                continue;
                            }

                            if (refNumber < argLastJobOffer) {
                                continue;
                            }

                            const titleElements: NodeListOf<HTMLAnchorElement> =
                                element.querySelectorAll(
                                    '.wsite-content-title a',
                                );

                            if (!titleElements?.length) {
                                continue;
                            }

                            jobOfferData.ref = refJobOffer;
                            jobOfferData.title = titleElements[0].textContent;
                            jobOfferData.publicLink = titleElements[0].href;
                            // console.log('adding job offer', titleElements);
                            jobOfferDataList.push(jobOfferData);

                            // if (jobOfferData?.publicLink)
                            //     jobOfferDataList.push(jobOfferData);
                            // else {
                            //     console.log('ignore job offer data', jobOfferData);
                            // }
                        }

                        return jobOfferDataList;
                    },
                    lastJobOffer,
                );

                console.log(
                    'Log ~ file: job-offers.service.ts ~ line 71 ~ JobOfferService ~ jobOfferDataList ~ jobOfferDataList',
                    jobOfferDataListResult,
                );
                counter++;
            }

            await browser.close();

            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    async sendJobOfferByMail(
        request: SendJobOfferByMailRequest,
        consultantEmail?: string,
    ): Promise<GenericResponse> {
        const mailSender =
            await SharedCandidatesHelpers.getMailSenderFromCandidate(
                null,
                null,
                null,
                consultantEmail,
            );

        return this.mailService.sendMail({
            to: [{ address: request.email }],
            htmlBody: request.content,
            subject: request.object,
            from: { address: request.sender || mailSender },
        });
    }
}
