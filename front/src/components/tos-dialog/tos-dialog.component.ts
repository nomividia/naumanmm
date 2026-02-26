import { Component, Input, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '../base/base.component';

@Component({
    selector: 'app-tos-dialog',
    templateUrl: './tos-dialog.component.html',
    styles: [''],
    encapsulation: ViewEncapsulation.None,
})
export class TOSDialog extends BaseComponent {
    @Input() displayAcceptBtn: boolean = true;
    constructor(private translate: TranslateService) {
        super();
    }
}
