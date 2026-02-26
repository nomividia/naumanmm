import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationSourceListComponent } from './application-source-list.component';

describe('ApplicationSourceListComponent', () => {
    let component: ApplicationSourceListComponent;
    let fixture: ComponentFixture<ApplicationSourceListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApplicationSourceListComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ApplicationSourceListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
