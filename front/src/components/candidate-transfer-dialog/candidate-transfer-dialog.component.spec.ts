import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateTransferDialogComponent } from './candidate-transfer-dialog.component';

describe('CandidateTransferDialogComponent', () => {
    let component: CandidateTransferDialogComponent;
    let fixture: ComponentFixture<CandidateTransferDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CandidateTransferDialogComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CandidateTransferDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
