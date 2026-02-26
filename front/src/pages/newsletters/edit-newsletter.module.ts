import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import { RouterModule } from '@angular/router';
import { CommonModulesList } from '../../app/app.module';
import { CityChipsModule } from '../../components/city-chips/city-chips.module';
import { DrawerContainerModule } from '../../components/drawer-container/drawer-container.module';
import { JobOffersAutocompleteModule } from '../../components/job-offers-autocomplete/job-offers-autocomplete.module';
import { JobSelectorModule } from '../../components/jobs-selector/jobs-selector.module';
import { NewsletterTemplatesDialogModule } from '../../components/newsletter-templates-dialog/newsletter-templates-dialog.module';
import { CanLeaveGenericGuard } from '../../providers/guards/can-leave-generic.guard';
import { EditNewsLetterComponent } from './edit-newsletter.component';
import { NewsLetterPreviewDialogModule } from './newsletter-preview-dialog.module';

const Routes = [
    {
        path: '',
        component: EditNewsLetterComponent,
        canDeactivate: [CanLeaveGenericGuard],
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(Routes),
        ...CommonModulesList,
        DrawerContainerModule,
        JobOffersAutocompleteModule,
        MatChipsModule,
        JobSelectorModule,
        MatRadioModule,
        NewsletterTemplatesDialogModule,
        NewsLetterPreviewDialogModule,
        CityChipsModule,
    ],
    declarations: [EditNewsLetterComponent],
    exports: [RouterModule],
})
export class EditNewsLetterModule {}
