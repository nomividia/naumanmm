import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SecuredImageComponent } from './secured-image.component';

@NgModule({
    imports: [CommonModule],
    declarations: [SecuredImageComponent],
    exports: [SecuredImageComponent],
    providers: [],
})
export class SecuredImageModule {}
