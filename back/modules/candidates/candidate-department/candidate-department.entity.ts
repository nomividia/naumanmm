import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppBaseEntity } from '../../../entities/base-entity';
import { CandidateApplication } from '../../candidates-application/candidate-application.entity';
import { Newsletter } from '../../newsletter/newsletter.entity';
import { Candidate } from '../candidate.entity';
import { CandidateDepartmentDto } from './candidate-department.dto';

@Entity({ name: 'candidate-department' })
export class CandidateDepartment extends AppBaseEntity {
    @Column('varchar', { name: 'candidateId', length: 36, nullable: true })
    candidateId?: string;

    @ManyToOne(() => Candidate, (candidate) => candidate.candidateDepartments, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'candidateId' })
    candidate?: Candidate;

    @Column('varchar', {
        name: 'candidateApplicationId',
        length: 36,
        nullable: true,
    })
    candidateApplicationId?: string;

    @ManyToOne(
        () => CandidateApplication,
        (candidateApplication) => candidateApplication.candidateDepartments,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
    )
    @JoinColumn({ name: 'candidateApplicationId' })
    candidateApplication?: CandidateApplication;

    @Column('varchar', { name: 'department', length: 20, nullable: false })
    department: string;

    @Column('varchar', { name: 'newsletterId', length: 36, nullable: true })
    newsletterId?: string;

    @ManyToOne(
        () => Newsletter,
        (newsletter) => newsletter.candidateDepartments,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
    )
    @JoinColumn({ name: 'newsletterId' })
    newsletter?: Newsletter;

    toDto(): CandidateDepartmentDto {
        return {
            id: this.id,
            candidateId: this.candidateId,
            candidate: this.candidate ? this.candidate.toDto() : null,
            candidateApplicationId: this.candidateApplicationId,
            candidateApplication: this.candidateApplication
                ? this.candidateApplication.toDto()
                : null,
            department: this.department,
        };
    }

    fromDto(dto: CandidateDepartmentDto) {
        this.id = dto.id;
        this.candidateId = dto.candidateId;
        this.candidateApplicationId = dto.candidateApplicationId;
        this.department = dto.department;
    }
}
