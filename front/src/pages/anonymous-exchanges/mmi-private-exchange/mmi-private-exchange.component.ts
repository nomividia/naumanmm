import { Component, ViewEncapsulation } from '@angular/core';
import { BasePageComponent } from '../../base/base-page.component';

@Component({
    selector: 'mmi-private-exchange',
    templateUrl: './mmi-private-exchange.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class MmiPrivateExchangeComponent extends BasePageComponent {
    constructor() {
        super();
    }
}
