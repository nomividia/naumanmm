import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { JobDto } from './job-dto';
import { JobHistory } from './job-history.entity';

@Entity({ name: 'jobs' })
export class Job {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column('varchar', {
        name: 'name',
        nullable: false,
        length: 100,
        unique: true,
    })
    name: string;

    @Column('varchar', { name: 'cronPattern', nullable: true, length: 30 })
    cronPattern?: string;

    @Column('text', { name: 'description', nullable: true })
    description?: string;

    @OneToMany(() => JobHistory, (jobHistory) => jobHistory.job, {
        cascade: true,
        onUpdate: 'CASCADE',
    })
    public jobHistory: JobHistory[];

    @Column('tinyint', { name: 'enabled', nullable: false, default: 1 })
    public enabled: boolean;

    @Column('varchar', {
        name: 'applicationServiceName',
        nullable: true,
        length: 150,
    })
    applicationServiceName: string;

    @Column('varchar', { name: 'methodName', nullable: false, length: 150 })
    methodName: string;

    @Column('tinyint', { name: 'logHistory', nullable: false, default: 1 })
    logHistory: boolean;

    @Column('varchar', { name: 'moduleName', nullable: true, length: 200 })
    moduleName: string;

    @Column('text', { name: 'modulePath', nullable: true })
    modulePath: string;

    @Column('text', { name: 'servicePath', nullable: true })
    servicePath: string;

    public toDto(): JobDto {
        return {
            id: this.id,
            name: this.name,
            cronPattern: this.cronPattern,
            description: this.description,
            enabled: this.enabled,
            jobHistory: this.jobHistory
                ? this.jobHistory.map((x) => x.toDto(false))
                : undefined,
            methodName: this.methodName,
            applicationServiceName: this.applicationServiceName,
            logHistory: this.logHistory,
            moduleName: this.moduleName,
            modulePath: this.modulePath,
            servicePath: this.servicePath,
        };
    }

    public fromDto(dto: JobDto) {
        this.id = dto.id;
        this.cronPattern = dto.cronPattern;
        this.name = dto.name;
        this.description = dto.description;
        this.applicationServiceName = dto.applicationServiceName;
        this.methodName = dto.methodName;
        this.enabled = dto.enabled;
        this.logHistory = dto.logHistory;
        this.moduleName = dto.moduleName;
        this.modulePath = dto.modulePath;
        this.servicePath = dto.servicePath;
    }
}
