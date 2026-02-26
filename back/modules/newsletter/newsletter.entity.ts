import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import {
    NewsletterLanguage,
    NewsletterType,
} from '../../../shared/shared-constants';
import { AppValue } from '../../entities/app-value.entity';
import { AppBaseEntity } from '../../entities/base-entity';
import { CandidateDepartment } from '../candidates/candidate-department/candidate-department.entity';
import { NewsLetterCandidateJobs } from '../candidates/newsletter-candidate-jobs.entity';
import { NewsLetterCandidateStatus } from '../candidates/newsletter-candidate-status.entity';
import { NewsletterJobOffer } from '../candidates/newsletter-joboffer.entity';
import { NewsletterDto } from './newsletter.dto';

@Entity({ name: 'newsletter' })
export class Newsletter extends AppBaseEntity {
    @Column('varchar', { name: 'title', nullable: true, length: 100 })
    title: string;

    @Column('longtext', { name: 'content', nullable: true })
    content: string;

    @Column('varchar', { name: 'subject', nullable: true, length: 190 })
    subject: string;

    @Column('varchar', { name: 'sender', nullable: true, length: 200 })
    sender: string;

    @Column('varchar', {
        name: 'newsletterStatusId',
        nullable: true,
        length: 50,
    })
    newsletterStatusId?: string;

    @ManyToOne(() => AppValue)
    @JoinColumn({ name: 'newsletterStatusId' })
    newsletterStatus?: AppValue;

    @Column('datetime', { name: 'sendDate', nullable: true })
    sendDate: Date;

    @Column('int', { name: 'candidatesCount', nullable: true, default: 0 })
    candidatesCount: number;

    @Column('int', {
        name: 'candidateApplicationsCount',
        nullable: true,
        default: 0,
    })
    candidateApplicationsCount: number;

    @Column('enum', {
        name: 'language',
        default: NewsletterLanguage.EN,
        enum: NewsletterLanguage,
    })
    language?: NewsletterLanguage;

    @OneToMany(
        () => NewsLetterCandidateStatus,
        (newsLetterCandidateStatus) => newsLetterCandidateStatus.newsLetter,
        { cascade: true },
    )
    newsLettersCandidateStatus: NewsLetterCandidateStatus[];

    @OneToMany(
        () => NewsLetterCandidateJobs,
        (newsLetterCandidateJobs) => newsLetterCandidateJobs.newsLetter,
        { cascade: true },
    )
    newsLettersCandidateJobs: NewsLetterCandidateJobs[];

    @OneToMany(
        () => NewsletterJobOffer,
        (newslettersJobOffer) => newslettersJobOffer.newsletter,
        { cascade: true },
    )
    newslettersJobOffer?: NewsletterJobOffer[];

    @Column('varchar', { name: 'newsletterSibId', nullable: true, length: 60 })
    newsletterSibId?: string;

    @Column('enum', {
        name: 'type',
        nullable: false,
        enum: NewsletterType,
        default: NewsletterType.Email,
    })
    type?: NewsletterType;

    @Column('varchar', {
        name: 'newsletterListSibId',
        nullable: true,
        length: 60,
    })
    newsletterListSibId?: string;

    @Column('int', { name: 'sentCount', nullable: true })
    sentCount?: number;

    @Column('int', { name: 'deliveredCount', nullable: true })
    deliveredCount?: number;

    @Column('int', { name: 'answeredCount', nullable: true })
    answeredCount?: number;

    @Column('int', { name: 'unsubscriptionsCount', nullable: true })
    unsubscriptionsCount?: number;

    @Column('int', { name: 'openedCount', nullable: true })
    openedCount?: number;

    @Column('int', { name: 'clickedCount', nullable: true })
    clickedCount?: number;

    @Column('longtext', { name: 'htmlFullContent', nullable: true })
    htmlFullContent?: string;

    @Column('boolean', {
        name: 'includeCandidateApplication',
        nullable: true,
        default: 0,
    })
    includeCandidateApplications?: boolean;

    // Need to add a column to save the array of selected cities for the newsletter filter
    @Column('json', {
        name: 'cityFilter',
        nullable: true,
    })
    cityFilter?: string[];

    @Column('varchar', {
        name: 'countriesFilter',
        nullable: true,
        length: 255,
    })
    countriesFilter?: string;

    @OneToMany(
        () => CandidateDepartment,
        (candidateDepartment) => candidateDepartment.newsletter,
        { cascade: true },
    )
    candidateDepartments?: CandidateDepartment[];

    toDto(): NewsletterDto {
        return {
            id: this.id,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            disabled: this.disabled,
            title: this.title,
            content: this.content,
            newsletterStatusId: this.newsletterStatusId,
            newsletterStatus: this.newsletterStatus?.toDto(),
            subject: this.subject,
            sendDate: this.sendDate,
            candidatesCount: this.candidatesCount,
            candidateApplicationsCount: this.candidateApplicationsCount,
            newsLettersCandidateStatus: this.newsLettersCandidateStatus?.map(
                (x) => x.toDto(),
            ),
            newsLettersJob: this.newsLettersCandidateJobs?.map((x) =>
                x.toDto(),
            ),
            newslettersJobOffer: this.newslettersJobOffer?.map((x) =>
                x.toDto(),
            ),
            language: this.language,
            sender: this.sender,
            newsletterSibId: this.newsletterSibId,
            type: this.type,
            newsletterListSibId: this.newsletterListSibId,
            clickedCount: this.clickedCount,
            unsubscriptionsCount: this.unsubscriptionsCount,
            sentCount: this.sentCount,
            openedCount: this.openedCount,
            deliveredCount: this.deliveredCount,
            answeredCount: this.answeredCount,
            includeCandidateApplications: this.includeCandidateApplications,
            cityFilter: this.cityFilter,
            countriesFilter: this.countriesFilter,
        };
    }

    fromDto(dto: NewsletterDto) {
        this.id = dto.id;
        this.creationDate = dto.creationDate;
        this.modifDate = dto.modifDate;
        this.disabled = dto.disabled;

        this.title = dto.title;
        this.content = dto.content;
        this.newsletterStatusId = dto.newsletterStatusId;
        this.subject = dto.subject;
        this.sendDate = dto.sendDate;
        this.candidatesCount = dto.candidatesCount;
        this.candidateApplicationsCount = dto.candidateApplicationsCount;
        this.language = dto.language;
        this.sender = dto.sender;
        this.newsletterSibId = dto.newsletterSibId;
        this.type = dto.type;
        this.newsletterListSibId = dto.newsletterListSibId;
        this.includeCandidateApplications = dto.includeCandidateApplications;
        this.cityFilter = dto.cityFilter;
        this.countriesFilter = dto.countriesFilter;

        if (dto.newsLettersCandidateStatus) {
            this.newsLettersCandidateStatus =
                dto.newsLettersCandidateStatus.map<NewsLetterCandidateStatus>(
                    (x) => {
                        const newsLettersCandidateStatus =
                            new NewsLetterCandidateStatus();
                        newsLettersCandidateStatus.fromDto(x);
                        return newsLettersCandidateStatus;
                    },
                );
        }

        if (dto.newsLettersJob) {
            this.newsLettersCandidateJobs =
                dto.newsLettersJob.map<NewsLetterCandidateJobs>((x) => {
                    const newsLettersCandidateJobs =
                        new NewsLetterCandidateJobs();
                    newsLettersCandidateJobs.fromDto(x);
                    return newsLettersCandidateJobs;
                });
        }

        if (dto.newslettersJobOffer) {
            this.newslettersJobOffer =
                dto.newslettersJobOffer.map<NewsletterJobOffer>((x) => {
                    const newsletterJobOffer = new NewsletterJobOffer();
                    newsletterJobOffer.fromDto(x);
                    return newsletterJobOffer;
                });
        }

        if (!dto.id) {
            this.id = undefined;
        }
    }
}
