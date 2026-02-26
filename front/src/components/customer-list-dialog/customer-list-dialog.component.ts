import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RefData } from '../../../../shared/ref-data';
import { CustomerDto } from '../../providers/api-client.generated';
import { BaseComponent } from '../base/base.component';

export interface CustomerListDialogResponse {
    cancel: boolean;
    createNew: boolean;
    customer?: CustomerDto;
}

interface CustomerWrapperDto extends CustomerDto {
    selected: boolean;
}

@Component({
    selector: 'customer-list-dialog',
    templateUrl: './customer-list-dialog.component.html',
    styleUrls: ['./customer-list-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CustomerListDialog extends BaseComponent {
    dialogResponse: CustomerListDialogResponse;
    selectedCustomer: CustomerWrapperDto;

    RefData = RefData;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: CustomerWrapperDto[],
        public dialogRef: MatDialogRef<CustomerListDialog>,
    ) {
        super();
        this.init();
    }

    init() {
        this.dialogResponse = {
            cancel: false,
            createNew: false,
        };
        this.data.forEach((x) => (x.selected = false));
    }

    onSelectedItem(item: CustomerWrapperDto) {
        this.data.forEach((x) => (x.selected = false));
        item.selected = true;
        this.selectedCustomer = item;
    }

    overwriteCustomer() {
        this.dialogResponse.customer = this.selectedCustomer;
        this.dialogRef.close(this.dialogResponse);
    }

    cancel() {
        this.dialogResponse.cancel = true;
        this.dialogRef.close(this.dialogResponse);
    }

    createNew() {
        this.dialogResponse.createNew = true;
        this.dialogRef.close(this.dialogResponse);
    }
}
