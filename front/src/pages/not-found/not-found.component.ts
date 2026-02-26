import { Component, ViewEncapsulation } from '@angular/core';
import { BasePageComponent } from '../base/base-page.component';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NotFoundComponent extends BasePageComponent {
    constructor() {
        super();
        BasePageComponent.serverResponseService.setNotFound();
    }
}
