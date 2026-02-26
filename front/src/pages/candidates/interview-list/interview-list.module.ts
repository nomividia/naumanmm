import { NgModule } from '@angular/core';
import { CommonModulesList } from '../../../app/app.module';
import { InterviewListComponent } from './interview-list.component';

@NgModule({
    imports: [...CommonModulesList],
    declarations: [InterviewListComponent],
    exports: [InterviewListComponent],
})
export class InterviewListModule {}
