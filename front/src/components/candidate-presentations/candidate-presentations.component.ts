import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DialogService } from 'nextalys-angular-tools';
import { BasePageComponent } from '../../pages/base/base-page.component';
import {
    CandidatePresentationsService,
    DeleteRequestParams,
    SetAsDefaultRequestParams,
    UpdateRequestParams,
} from '../../providers/api-client.generated';
import { CandidatePresentationDto } from '../../providers/api-client.generated/model/candidatePresentationDto';

@Component({
    selector: 'app-candidate-presentations',
    templateUrl: './candidate-presentations.component.html',
    styleUrls: ['./candidate-presentations.component.scss'],
})
export class CandidatePresentationsComponent
    extends BasePageComponent
    implements OnInit
{
    @Input() candidateId: string;

    presentations: CandidatePresentationDto[] = [];
    editingPresentation: CandidatePresentationDto | null = null;
    isCreating = false;

    constructor(
        private dialogService: DialogService,
        private candidatePresentationsService: CandidatePresentationsService,
    ) {
        super();
    }

    async ngOnInit(): Promise<void> {
        if (this.candidateId) {
            await this.loadPresentations();
        }
    }

    async loadPresentations(): Promise<void> {
        this.loading = true;
        try {
            // TODO: After running nswag-generate-client, replace this line with:
            this.presentations = await this.candidatePresentationsService
                .findAllByCandidateId({
                    candidateId: this.candidateId,
                })
                .toPromise();
        } catch (error) {
            console.error('Error loading presentations:', error);
            // this.dialogService.showErrorMessage(
            //     'Error loading presentations',
            // );
        } finally {
            this.loading = false;
        }
    }

    startCreate(): void {
        this.isCreating = true;
        this.editingPresentation = {
            title: '',
            content: '',
            candidateId: this.candidateId,
            isDefault: this.presentations.length === 0, // Make first one default
            displayOrder: this.presentations.length + 1,
        };
    }

    startEdit(presentation: CandidatePresentationDto): void {
        this.editingPresentation = { ...presentation };
    }

    cancelEdit(): void {
        this.editingPresentation = null;
        this.isCreating = false;
    }

    async savePresentation(): Promise<void> {
        if (!this.editingPresentation) return;

        if (
            !this.editingPresentation.title ||
            !this.editingPresentation.content
        ) {
            // this.dialogService.showErrorMessage(
            //     'Title and content are required',
            // );
            return;
        }

        this.loading = true;
        try {
            if (this.isCreating) {
                // TODO: After running nswag-generate-client, replace with:
                await this.candidatePresentationsService
                    .create({
                        candidatePresentationDto: this.editingPresentation,
                    })
                    .toPromise();
            } else {
                // TODO: After running nswag-generate-client, replace with:
                await this.candidatePresentationsService
                    .update({
                        id: this.editingPresentation.id,
                        candidatePresentationDto: this.editingPresentation,
                    } as UpdateRequestParams)
                    .toPromise();
            }

            await this.loadPresentations();
            this.cancelEdit();
            // this.dialogService.showSuccessMessage(
            //     this.isCreating
            //         ? 'Presentation created successfully'
            //         : 'Presentation updated successfully',
            // );
        } catch (error) {
            console.error('Error saving presentation:', error);
            // this.dialogService.showErrorMessage('Error saving presentation');
        } finally {
            this.loading = false;
        }
    }

    async deletePresentation(
        presentation: CandidatePresentationDto,
    ): Promise<void> {
        const confirmed = await this.dialogService.showConfirmDialog(
            'Delete Presentation',
            // `Are you sure you want to delete "${presentation.title}"?`,
        );

        if (!confirmed) return;

        this.loading = true;
        try {
            // eslint-disable-next-line no-underscore-dangle
            await this.candidatePresentationsService
                ._delete({ id: presentation.id } as DeleteRequestParams)
                .toPromise();

            await this.loadPresentations();
        } catch (error) {
            console.error('Error deleting presentation:', error);
        } finally {
            this.loading = false;
        }
    }

    async setAsDefault(presentation: CandidatePresentationDto): Promise<void> {
        this.loading = true;
        try {
            // TODO: After running nswag-generate-client, replace with:
            await this.candidatePresentationsService
                .setAsDefault({
                    id: presentation.id,
                } as SetAsDefaultRequestParams)
                .toPromise();

            await this.loadPresentations();
            // this.dialogService.showSuccessMessage(
            //     'Default presentation updated',
            // );
        } catch (error) {
            console.error('Error setting default:', error);
            // this.dialogService.showErrorMessage(
            //     'Error setting default presentation',
            // );
        } finally {
            this.loading = false;
        }
    }
}
