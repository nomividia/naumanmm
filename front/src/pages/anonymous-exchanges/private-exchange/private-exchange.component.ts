import { Component, ViewEncapsulation } from '@angular/core';
import { BasePageComponent } from '../../base/base-page.component';

@Component({
    selector: 'private-exchange',
    templateUrl: './private-exchange.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class PrivateExchangeComponent extends BasePageComponent {
    constructor() {
        super();
    }
}
