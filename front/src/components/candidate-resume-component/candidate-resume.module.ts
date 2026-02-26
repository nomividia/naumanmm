import { NgModule } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { NextalysPdfViewerModule } from 'nextalys-pdf-viewer';
import { CommonModulesList } from '../../app/app.module';
import { DrawerContainerModule } from '../drawer-container/drawer-container.module';
import { CandidateResumeComponent } from './candidate-resume.component';

@NgModule({
    imports: [
        ...CommonModulesList,
        DrawerContainerModule,
        MatStepperModule,
        NextalysPdfViewerModule,
    ],
    declarations: [CandidateResumeComponent],
    exports: [CandidateResumeComponent],
})
export class CandidateResumeModule {}
