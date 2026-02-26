import { HttpClient } from '@angular/common/http';
import {
    Component,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { DialogService } from 'nextalys-angular-tools';
import { BrowserFileHelpers } from 'nextalys-js-helpers/dist/browser-file-helpers';
import { CandidateJobOfferHistoryService } from '../../providers/api-client.generated';
import { GlobalAppService } from '../../services/global.service';
import { AuthDataService } from '../../services/auth-data.service';
import { RolesList } from '../../../../shared/shared-constants';

interface PlacementHistoryEntry {
    id: string;
    jobOffer?: { title?: string; ref?: string; customer?: { companyName?: string } };
    startDate?: Date;
    contractFile?: { file?: { id?: string; physicalName?: string; name?: string; mimeType?: string; creationDate?: Date } };
    contractFileId?: string;
    actionDate: Date;
    action: string;
}

@Component({
    selector: 'app-candidate-placement-history',
    templateUrl: './candidate-placement-history.component.html',
    styleUrls: ['./candidate-placement-history.component.scss'],
})
export class CandidatePlacementHistoryComponent implements OnChanges {
    @Input() candidateId: string;

    placementHistory: PlacementHistoryEntry[] = [];
    loading = false;
    displayedColumns = [
        'jobOffer',
        'customer',
        'startDate',
        'contract',
        'placementDate',
    ];

    constructor(
        private candidateJobOfferHistoryService: CandidateJobOfferHistoryService,
        private httpClient: HttpClient,
        private dialogService: DialogService,
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.candidateId && this.candidateId) {
            this.loadHistory();
        }
    }

    async loadHistory(): Promise<void> {
        this.loading = true;
        try {
            const response = await this.candidateJobOfferHistoryService
                .candidateJobOfferHistoryControllerGetCandidateHistory({
                    candidateId: this.candidateId,
                })
                .toPromise();

            console.log('History API response:', response);

            if (response?.success && response.history) {
                console.log('Full history:', response.history);
                this.placementHistory = response.history.filter(
                    (entry: PlacementHistoryEntry) => entry.action === 'LINKED',
                );
                console.log('Filtered placement history:', this.placementHistory);
            }
        } catch (error) {
            console.error('Error loading placement history:', error);
        } finally {
            this.loading = false;
        }
    }

    canShowContract(entry: PlacementHistoryEntry): boolean {
        if (!entry.contractFile?.file) {
            return false;
        }

        // If user is a candidate, check 90-day rule
        if (GlobalAppService.userHasRole(AuthDataService.currentUser, RolesList.Candidate)) {
            const uploadDate = entry.contractFile.file.creationDate;
            if (!uploadDate) {
                return false;
            }
            const daysSinceUpload = Math.floor((Date.now() - new Date(uploadDate).getTime()) / (1000 * 60 * 60 * 24));
            return daysSinceUpload < 90;
        }

        // Non-candidates can always see contracts
        return true;
    }

    async downloadContract(entry: PlacementHistoryEntry): Promise<void> {
        if (!entry.contractFile?.file) {
            return;
        }

        const file = entry.contractFile.file;
        try {
            const response = await GlobalAppService.getBlobFile(
                this.httpClient,
                '/api/gdrive/downloadGloudStorageFile/' + file.id + '?returnBlob=true',
                'get',
            );
            if (response?.success && response.blob) {
                BrowserFileHelpers.downloadFile({
                    fileName: file.physicalName || file.name || 'contract',
                    blobData: response.blob,
                    mimeType: file.mimeType,
                });
            }
        } catch (error) {
            console.error('Error downloading contract:', error);
            this.dialogService.showDialog('Error downloading contract file.');
        }
    }
}
