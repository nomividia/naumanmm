import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendAvailabilityDialogComponent } from './send-availability-dialog.component';

describe('SendAvailabilityDialogComponent', () => {
    let component: SendAvailabilityDialogComponent;
    let fixture: ComponentFixture<SendAvailabilityDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SendAvailabilityDialogComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SendAvailabilityDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
