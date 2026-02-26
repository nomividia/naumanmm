import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { RefData } from '../../../../shared/ref-data';
import { AddressDto } from '../../providers/api-client.generated';
import { Department } from '../../services/geo.service';
import { BaseComponent } from '../base/base.component';

@Component({
    selector: 'app-address',
    templateUrl: 'address.component.html',
    styleUrls: ['address.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AddressComponent extends BaseComponent {
    selectedDepartment: Department;

    countriesList = RefData.countriesListForCurrentLanguage;

    loading = false;

    @Input() address: AddressDto;
    @Input() disabled: boolean;
    @Input() showOnlyCountry = false;
    @Input() mode: 'single' | 'multiple' | 'two-lines';
    @Input() smallInput = false;
    @Input() dFlexRow = false;

    @Output() addressChange = new EventEmitter<AddressDto>();
    @Output() onDelete = new EventEmitter<AddressDto>();
    @Output() onAdd = new EventEmitter<void>();
    @Output() onModification = new EventEmitter<boolean>();

    constructor() {
        super();
    }

    ngOnInit() {
        if (this.address.department) {
            this.selectedDepartment = {
                country: '',
                name: '',
                num: this.address.department,
            };
        }
    }

    addressChangeResult() {
        // console.log("🚀 ~ file: address.component.ts ~ line 47 ~ AddressComponent ~ addressChangeResult ~ this.address.country", this.address.country)
        this.addressChange.emit(this.address);
        this.emitModification();
    }

    removeAddress(address: AddressDto) {
        if (!address) {
            return;
        }

        this.onDelete.emit(this.address);
    }

    addAddress() {
        this.onAdd.emit();
    }

    emitModification() {
        this.hasPendingModifications = true;
        this.onModification.emit(this.hasPendingModifications);
    }

    onDepartmentSelection(dptNum?: string) {
        if (!dptNum) {
            dptNum = this.selectedDepartment?.num;
        }

        if (!dptNum) {
            return;
        }

        this.address.department = dptNum;
        this.addressChangeResult();
    }
}
