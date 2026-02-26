import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { JobHistoryDto } from './job-history-dto';
import { Job } from './job.entity';

@Entity({ name: 'jobs-history' })
export class JobHistory {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @ManyToOne(() => Job, (job) => job.jobHistory, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'jobId' })
    public job: Job;

    @Column('varchar', { name: 'jobId', length: 36, nullable: false })
    public jobId: string;

    @Column('datetime', { name: 'date', nullable: false })
    date: Date;

    @Column('text', { name: 'result', nullable: true })
    result: string;

    @Column('float', { name: 'duration', nullable: false, default: 0 })
    duration: number;

    public toDto(getJob: boolean): JobHistoryDto {
        return {
            id: this.id,
            job: this.job && getJob ? this.job.toDto() : undefined,
            jobId: this.jobId,
            date: this.date,
            result: this.result,
            duration: this.duration,
        };
    }
}
