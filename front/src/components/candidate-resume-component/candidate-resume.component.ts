import { HttpClient } from '@angular/common/http';
import {
    Component,
    Input,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'nextalys-angular-tools';
import { NextalysPdfViewerComponent } from 'nextalys-pdf-viewer';
import { BasePageComponent } from '../../pages/base/base-page.component';
import { AddressDto } from '../../providers/api-client.generated';
import { LanguageProvider } from '../../providers/language.provider';
import { GlobalAppService } from '../../services/global.service';
import { CandidatePresentationsService } from '../../providers/api-client.generated';

/**
 * Simplified Candidate Resume Component
 *
 * This component displays a PDF resume generated from the backend.
 * It automatically generates the resume when the component initializes.
 *
 * Usage:
 * <app-candidate-resume-component
 * [candidateId]="'candidate-id-here'"
 * [language]="'fr'"
 * [showAge]="true"
 * [showNationality]="true"
 * </app-candidate-resume-component>
 *
 * Inputs:
 * - candidateId: string (required) - The ID of the candidate
 * - language: 'fr' | 'en' (optional, default: 'fr') - Language for the resume
 * - showAge: boolean (optional, default: false) - Whether to show age in resume
 * - showNationality: boolean (optional, default: false) - Whether to show nationality
 * - candidate: any (optional) - Candidate object containing nationality information
 *
 * Note: For US candidates (nationality === 'US'), age and nationality options are
 * automatically hidden and set to false by default due to legal restrictions.
 */

@Component({
    selector: 'app-candidate-resume-component',
    templateUrl: './candidate-resume.component.html',
    styleUrls: [
        '../../pages/base/edit-page-style.scss',
        './candidate-resume.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class CandidateResumeComponent
    extends BasePageComponent
    implements OnInit
{
    pdfBlob: Blob | null = null;
    pdfBase64: string | null = null;
    pdfDataUrl: SafeResourceUrl | null = null;
    errorMessage: string | null = null;

    @ViewChild(NextalysPdfViewerComponent)
    nextalysPdfViewerComponent: NextalysPdfViewerComponent;

    @Input() candidateId: string;
    @Input() language: 'fr' | 'en' = 'fr';
    @Input() showAge: boolean = false;
    @Input() showNationality: boolean = false;
    @Input() candidate: any; // Type should match your candidate interface
    @Input() selectedJobId: string | null = null;

    // Presentation selection
    selectedPresentationId: string | null = null;
    presentations: any[] = [];

    // Auto-regenerate when options change
    private autoRegenerate: boolean = true;

    // Computed property to check if candidate is from US
    get isUSCandidate(): boolean {
        return (
            this.candidate?.nationality === 'US' ||
            this.candidate?.addresses?.some(
                (address: AddressDto) => address.country === 'US',
            )
        );
    }

    constructor(
        private httpClient: HttpClient,
        private dialogService: DialogService,
        private translate: TranslateService,
        private sanitizer: DomSanitizer,
        private candidatePresentationsService: CandidatePresentationsService,
    ) {
        super();
    }

    async ngOnInit(): Promise<void> {
        // Set language from current Angular language
        this.language = LanguageProvider.currentLanguageCode as 'fr' | 'en';

        // Set defaults for US candidates (illegal to show age/nationality)
        if (this.isUSCandidate) {
            this.showAge = false;
            this.showNationality = false;
        }

        // Load presentations if candidateId is provided
        if (this.candidateId) {
            await this.loadPresentations();
            this.generateResume();
        }
    }

    /**
     * Load presentations for the candidate
     */
    async loadPresentations(): Promise<void> {
        if (!this.candidateId) {
            return;
        }

        try {
            const response = await this.candidatePresentationsService
                .findAllByCandidateId({ candidateId: this.candidateId })
                .toPromise();

            this.presentations = response || [];

            // Auto-select default presentation
            const defaultPresentation = this.presentations.find(
                (p) => p.isDefault,
            );
            if (defaultPresentation) {
                this.selectedPresentationId = defaultPresentation.id;
            } else if (this.presentations.length > 0) {
                // If no default, select the first one
                this.selectedPresentationId = this.presentations[0].id;
            }
        } catch (error) {
            console.error('Error loading presentations:', error);
            this.presentations = [];
        }
    }

    /**
     * Handle options change - auto-regenerate PDF if enabled
     */
    onOptionsChange() {
        if (this.autoRegenerate && this.candidateId) {
            this.generateResume();
        }
    }

    /**
     * Generate PDF resume by calling the backend API using the application's standard pattern
     */
    async generateResume() {
        if (!this.candidateId) {
            this.errorMessage = 'Candidate ID is required';
            return;
        }

        this.loading = true;
        this.errorMessage = null;

        try {
            // Use GlobalAppService.getBlobFile which follows the application's patterns
            const response = await GlobalAppService.getBlobFile(
                this.httpClient,
                `/api/candidate-resumes/generate/${this.candidateId}`,
                'post',
                {
                    language: this.language,
                    showAge: this.showAge,
                    showNationality: this.showNationality,
                    selectedJobId: this.selectedJobId,
                    selectedPresentationId: this.selectedPresentationId,
                },
                {
                    component: this,
                },
            );

            if (response.success && response.blob) {
                // Convert response to blob and base64 for display
                this.pdfBlob = response.blob;
                this.pdfBase64 = await this.blobToBase64(this.pdfBlob);

                // Create sanitized PDF data URL for iframe display
                if (this.pdfBase64) {
                    const dataUrl = `data:application/pdf;base64,${this.pdfBase64}`;
                    this.pdfDataUrl =
                        this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
                }
            } else {
                throw new Error('Failed to generate resume');
            }
        } catch (error) {
            console.error('Error generating resume:', error);
            this.errorMessage = 'Failed to generate resume. Please try again.';
            this.pdfBlob = null;
            this.pdfBase64 = null;
            this.pdfDataUrl = null;
        } finally {
            this.loading = false;
        }
    }

    /**
     * Download the generated PDF
     */
    downloadPdf() {
        if (!this.pdfBlob) {
            return;
        }

        const url = window.URL.createObjectURL(this.pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `candidate-resume-${this.candidateId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
    }

    /**
     * Convert blob to base64 string for PDF viewer
     */
    private blobToBase64(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result as string;
                // Extract just the base64 string (remove data URL prefix)
                const base64Data = base64.split(',')[1];
                resolve(base64Data);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }
}
