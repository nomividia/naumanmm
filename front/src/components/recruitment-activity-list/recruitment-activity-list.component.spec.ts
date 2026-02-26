import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentActivityListComponent } from './recruitment-activity-list.component';

describe('RecruitmentActivityListComponent', () => {
    let component: RecruitmentActivityListComponent;
    let fixture: ComponentFixture<RecruitmentActivityListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RecruitmentActivityListComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(RecruitmentActivityListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
