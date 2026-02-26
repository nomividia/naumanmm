import { NgModule } from '@angular/core';
import { CommonModulesList } from '../../app/app.module';
import { LanguageComponent } from './language.component';

@NgModule({
    imports: [...CommonModulesList],
    declarations: [LanguageComponent],
    exports: [LanguageComponent],
})
export class LanguageModule {}
