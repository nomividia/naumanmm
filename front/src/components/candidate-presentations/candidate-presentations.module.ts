import { NgModule } from '@angular/core';
import { CommonModulesList } from '../../app/app.module';
import { CandidatePresentationsComponent } from './candidate-presentations.component';

@NgModule({
    imports: [...CommonModulesList],
    declarations: [CandidatePresentationsComponent],
    exports: [CandidatePresentationsComponent],
})
export class CandidatePresentationsModule {}
