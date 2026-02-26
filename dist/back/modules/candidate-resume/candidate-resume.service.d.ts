/// <reference types="node" />
import { Repository } from 'typeorm';
import { Candidate } from '../candidates/candidate.entity';
import { GCloudStorageService } from '../gdrive/gcloud-storage-service';
export declare class CandidateResumeService {
    private readonly candidateRepository;
    private readonly gCloudStorageService;
    constructor(candidateRepository: Repository<Candidate>, gCloudStorageService: GCloudStorageService);
    generateCandidateResume(candidateId: string, body: {
        language: 'fr' | 'en';
        showAge: boolean;
        showNationality: boolean;
        selectedJobId: string;
        selectedPresentationId?: string;
    }): Promise<{
        buffer: Buffer;
        fileName: string;
        mimeType: string;
    }>;
    private generatePdfWithPDFKit;
    private getJobTitleTranslation;
    private getLanguageId;
    private formatDate;
    private getCandidateLanguages;
    private getLanguageName;
    private getLanguageLevelTranslation;
    private normalizeJobDescription;
    private resolveCandidatePicturePath;
}
