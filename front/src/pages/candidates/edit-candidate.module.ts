import { NgModule } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { NxsIntlTelInputModule } from 'nextalys-angular-tools';
import { CommonModulesList } from '../../app/app.module';
import { AddressModule } from '../../components/address/address.module';
import { CandidateApplicationListMinifiedModule } from '../../components/candidate-application-list/candidate-applications-list-minified.module';
import { CandidateFilesModule } from '../../components/candidate-files/candidate-files.module';
import { CandidateInformationsModule } from '../../components/candidate-informations/candidate-informations.module';
import { CandidatePresentationsModule } from '../../components/candidate-presentations/candidate-presentations.module';
import { CandidateProcessWarningDialogModule } from '../../components/candidate-process-warning-dialog/candidate-process-warning-dialog.module';
import { CandidateResumeModule } from '../../components/candidate-resume-component/candidate-resume.module';
import { CandidateStatusHistoriesDialogModule } from '../../components/candidate-status-histories-dialog/candidate-status-histories-dialog.module';
import { DetailInterviewDialogModule } from '../../components/detail-interview-dialog/detail-interview-dialog.module';
import { DrawerContainerModule } from '../../components/drawer-container/drawer-container.module';
import { ExchangesModule } from '../../components/exchanges/exchanges.module';
import { ExperiencesModule } from '../../components/experiences-component/experiences.module';
import { LanguageModule } from '../../components/language/language.module';
import { CandidatePlacementHistoryModule } from '../../components/candidate-placement-history/candidate-placement-history.module';
import { SelectJobOfferDialogModule } from '../../components/select-job-offer-dialog/select-job-offer-dialog.module';
import { SendAvailabilityDialogModule } from '../../components/send-availability-mail-dialog/send-availability-dialog.module';
import { SendFolderCustomerDialogModule } from '../../components/send-folder-customer/send-folder-dialog.module';
import { StarNoteModule } from '../../components/star-note/star-note.module';
import { CustomDatePickerModule } from '../../modules/date-picker/date-picker.module';
import { ShortenStringPipe } from '../../pipes/shorten-string.pipe';
import { CanLeaveGenericGuard } from '../../providers/guards/can-leave-generic.guard';
import { EditCandidateComponent } from './edit-candidate.component';
import { InterviewListModule } from './interview-list/interview-list.module';

const Routes = [
    {
        path: '',
        component: EditCandidateComponent,
        canDeactivate: [CanLeaveGenericGuard],
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(Routes),
        ...CommonModulesList,
        DrawerContainerModule,
        AddressModule,
        NxsIntlTelInputModule,
        CustomDatePickerModule,
        MatSlideToggleModule,
        MatTabsModule,
        MatProgressBarModule,
        StarNoteModule,
        CandidateApplicationListMinifiedModule,
        DetailInterviewDialogModule,
        MatDatepickerModule,
        CandidateInformationsModule,
        ExchangesModule,
        InterviewListModule,
        CandidateFilesModule,
        LanguageModule,
        ExperiencesModule,
        CandidateResumeModule,
        CandidatePresentationsModule,
        SendFolderCustomerDialogModule,
        CandidateStatusHistoriesDialogModule,
        SendAvailabilityDialogModule,
        SelectJobOfferDialogModule,
        CandidatePlacementHistoryModule,
        CandidateProcessWarningDialogModule,
    ],
    declarations: [EditCandidateComponent],
    exports: [RouterModule],
    providers: [ShortenStringPipe],
})
export class EditCandidateModule {}
