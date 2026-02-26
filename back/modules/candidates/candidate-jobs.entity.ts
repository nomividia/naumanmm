import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CandidateJobStatus } from '../../../shared/types/candidate-job-status.type';
import { CandidateJobType } from '../../../shared/types/candidate-job-type';
import { AppValue } from '../../entities/app-value.entity';
import { AppBaseEntity } from '../../entities/base-entity';
import { JobReference } from '../job-references/job-reference.entity';
import { CandidateJobDto } from './candidate-jobs.dto';
import { Candidate } from './candidate.entity';

@Entity({ name: 'candidate-jobs' })
export class CandidateJob extends AppBaseEntity {
    @Column('varchar', { name: 'candidateId', nullable: true, length: 36 })
    candidateId?: string;

    @ManyToOne(() => Candidate, (candidate) => candidate.candidateJobs, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
    })
    @JoinColumn({ name: 'candidateId' })
    candidate?: Candidate;

    @Column('varchar', { name: 'jobId', nullable: true, length: 36 })
    jobId?: string;

    @ManyToOne(() => AppValue)
    @JoinColumn({ name: 'jobId' })
    job?: AppValue;

    @Column('date', { name: 'experienceStartDate', nullable: true })
    experienceStartDate?: Date;

    @Column('date', { name: 'experienceEndDate', nullable: true })
    experienceEndDate?: Date;

    @Column('boolean', { name: 'showMonthInResume', default: true })
    showMonthInResume?: boolean;

    @Column('varchar', { name: 'employer', nullable: true })
    employer?: string;

    @Column('boolean', { name: 'inActivity', default: true })
    inActivity?: boolean;

    @Column('text', { name: 'leavingReason', nullable: true })
    leavingReason?: string;

    @Column('varchar', { name: 'jobReferenceId', nullable: true, length: 36 })
    jobReferenceId?: string;

    @ManyToOne(() => JobReference, { cascade: true })
    @JoinColumn({ name: 'jobReferenceId' })
    jobReference?: JobReference;

    @Column('varchar', {
        name: 'employerProfileId',
        nullable: true,
        length: 36,
    })
    employerProfileId: string;

    @ManyToOne(() => AppValue)
    @JoinColumn({ name: 'employerProfileId' })
    employerProfile?: AppValue;

    @Column('varchar', { name: 'jobName', nullable: true, length: 255 })
    jobName?: string;

    @Column('text', { name: 'jobDescription', nullable: true })
    jobDescription?: string;

    @Column('enum', {
        name: 'status',
        nullable: false,
        default: CandidateJobStatus.PENDING,
        enum: CandidateJobStatus,
    })
    status: CandidateJobStatus;

    @Column('enum', {
        name: 'type',
        nullable: false,
        default: CandidateJobType.JOB,
        enum: CandidateJobType,
    })
    type: CandidateJobType;

    private normalizeDateForOutput(
        date: Date | string | null | undefined,
    ): Date | null {
        if (!date) {
            return null;
        }

        let year: number, month: number, day: number;

        if (typeof date === 'string') {
            const match = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
            if (match) {
                year = parseInt(match[1], 10);
                month = parseInt(match[2], 10) - 1;
                day = parseInt(match[3], 10);
            } else {
                const d = new Date(date);
                year = d.getFullYear();
                month = d.getMonth();
                day = d.getDate();
            }
        } else {
            year = date.getFullYear();
            month = date.getMonth();
            day = date.getDate();
        }

        // Ensure the date is at UTC noon to avoid timezone edge cases during serialization
        return new Date(Date.UTC(year, month, day, 12, 0, 0));
    }

    toDto(): CandidateJobDto {
        return {
            id: this.id,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            candidateId: this.candidateId,
            jobId: this.jobId,
            job: this.job ? this.job.toDto() : null,
            experienceStartDate: this.normalizeDateForOutput(
                this.experienceStartDate,
            ),
            experienceEndDate: this.normalizeDateForOutput(
                this.experienceEndDate,
            ),
            showMonthInResume: this.showMonthInResume,
            employer: this.employer,
            inActivity: this.inActivity,
            leavingReason: this.leavingReason,
            jobReferenceId: this.jobReferenceId,
            jobReference: this.jobReference ? this.jobReference.toDto() : null,
            employerProfileId: this.employerProfileId,
            employerProfile: this.employerProfile?.toDto(),
            jobName: this.jobName,
            jobDescription: this.jobDescription,
            status: this.status,
            type: this.type,
        };
    }

    private normalizeDateForStorage(
        date: Date | string | null | undefined,
    ): Date | null {
        if (!date) {
            return null;
        }

        let year: number, month: number, day: number;

        if (typeof date === 'string') {
            // Parse date parts directly from ISO string (e.g., "2025-12-01T00:00:00.000+01:00")
            // This avoids timezone conversion issues
            const match = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
            if (match) {
                year = parseInt(match[1], 10);
                month = parseInt(match[2], 10) - 1; // JS months are 0-indexed
                day = parseInt(match[3], 10);
            } else {
                // Fallback: parse as date and use local components
                const d = new Date(date);
                year = d.getFullYear();
                month = d.getMonth();
                day = d.getDate();
            }
        } else {
            // For Date objects, use local time components (what the user intended)
            year = date.getFullYear();
            month = date.getMonth();
            day = date.getDate();
        }

        // Create date at UTC noon to avoid any edge cases
        return new Date(Date.UTC(year, month, day, 12, 0, 0));
    }

    fromDto(dto: CandidateJobDto) {
        this.id = dto.id;
        this.candidateId = dto.candidateId;
        this.jobId = dto.jobId;
        this.experienceStartDate = this.normalizeDateForStorage(
            dto.experienceStartDate,
        );
        this.experienceEndDate = this.normalizeDateForStorage(
            dto.experienceEndDate,
        );
        this.showMonthInResume = dto.showMonthInResume;
        this.employer = dto.employer;
        this.inActivity = dto.inActivity;
        this.leavingReason = dto.leavingReason;
        this.jobReferenceId = dto.jobReferenceId;
        this.employerProfileId = dto.employerProfileId;
        this.jobName = dto.jobName;
        this.jobDescription = dto.jobDescription;
        this.status = dto.status;
        this.type = dto.type;

        if (dto.jobReference) {
            const jobRef = new JobReference();
            jobRef.fromDto(dto.jobReference);
            this.jobReference = jobRef;
            this.jobReferenceId = jobRef.id;
        }

        if (!this.id) {
            this.id = undefined;
        }
    }
}
