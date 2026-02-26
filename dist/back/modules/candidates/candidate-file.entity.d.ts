import { AppFile } from '../../entities/app-file.entity';
import { AppValue } from '../../entities/app-value.entity';
import { AppBaseEntity } from '../../entities/base-entity';
import { CandidateFileDto } from './candidate-file-dto';
import { Candidate } from './candidate.entity';
export declare class CandidateFile extends AppBaseEntity {
    fileId?: string;
    file?: AppFile;
    candidateId?: string;
    candidate?: Candidate;
    fileTypeId?: string;
    fileType?: AppValue;
    isMandatory?: boolean;
    toDto(): CandidateFileDto;
    fromDto(dto: CandidateFileDto): void;
}
