import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidatePresentation } from '../../entities/candidate-presentation.entity';
import { CandidatePresentationDto } from './candidate-presentation-dto';

@Injectable()
export class CandidatePresentationsService {
    constructor(
        @InjectRepository(CandidatePresentation)
        private readonly candidatePresentationRepository: Repository<CandidatePresentation>,
    ) {}

    async findAllByCandidateId(
        candidateId: string,
    ): Promise<CandidatePresentationDto[]> {
        const presentations = await this.candidatePresentationRepository.find({
            where: { candidateId, disabled: false },
            order: { displayOrder: 'ASC', creationDate: 'ASC' },
        });

        return presentations.map((p) => p.toDto());
    }

    async findOne(id: string): Promise<CandidatePresentationDto> {
        const presentation = await this.candidatePresentationRepository.findOne(
            {
                where: { id },
            },
        );

        if (!presentation) {
            throw new Error('Candidate presentation not found');
        }

        return presentation.toDto();
    }

    async create(
        dto: CandidatePresentationDto,
    ): Promise<CandidatePresentationDto> {
        // If this is marked as default, unset any existing default for this candidate
        if (dto.isDefault) {
            await this.candidatePresentationRepository.update(
                { candidateId: dto.candidateId, isDefault: true },
                { isDefault: false },
            );
        }

        const presentation = new CandidatePresentation();
        presentation.fromDto(dto);

        const saved = await this.candidatePresentationRepository.save(
            presentation,
        );
        return saved.toDto();
    }

    async update(
        id: string,
        dto: CandidatePresentationDto,
    ): Promise<CandidatePresentationDto> {
        const existing = await this.candidatePresentationRepository.findOne({
            where: { id },
        });

        if (!existing) {
            throw new Error('Candidate presentation not found');
        }

        // If this is being set as default, unset any existing default for this candidate
        if (dto.isDefault && !existing.isDefault) {
            await this.candidatePresentationRepository.update(
                { candidateId: dto.candidateId, isDefault: true },
                { isDefault: false },
            );
        }

        existing.fromDto(dto);
        const saved = await this.candidatePresentationRepository.save(existing);
        return saved.toDto();
    }

    async delete(id: string): Promise<void> {
        const presentation = await this.candidatePresentationRepository.findOne(
            {
                where: { id },
            },
        );

        if (!presentation) {
            throw new Error('Candidate presentation not found');
        }

        // Soft delete
        presentation.disabled = true;
        await this.candidatePresentationRepository.save(presentation);
    }

    async setAsDefault(id: string): Promise<CandidatePresentationDto> {
        const presentation = await this.candidatePresentationRepository.findOne(
            {
                where: { id },
            },
        );

        if (!presentation) {
            throw new Error('Candidate presentation not found');
        }

        // Unset any existing default for this candidate
        await this.candidatePresentationRepository.update(
            { candidateId: presentation.candidateId, isDefault: true },
            { isDefault: false },
        );

        // Set this one as default
        presentation.isDefault = true;
        const saved = await this.candidatePresentationRepository.save(
            presentation,
        );
        return saved.toDto();
    }

    async getDefaultPresentation(
        candidateId: string,
    ): Promise<CandidatePresentationDto | null> {
        const presentation = await this.candidatePresentationRepository.findOne(
            {
                where: { candidateId, isDefault: true, disabled: false },
            },
        );

        return presentation ? presentation.toDto() : null;
    }
}
