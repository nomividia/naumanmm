import { Component, forwardRef, Input, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import {
    CustomerDto,
    CustomersService,
} from '../../providers/api-client.generated';

@Component({
    selector: 'app-customers-autocomplete',
    templateUrl: './customers-autocomplete.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CustomersAutocompleteComponent),
            multi: true,
        },
    ],
})
export class CustomersAutocompleteComponent {
    private innerValue: CustomerDto;

    loading = false;

    @Input() disabled = false;
    @Input() placeholder = '';
    @Input() label = '';

    private onChangeCallback: (_: any) => void = () => {};

    private onTouchedCallback: () => void = () => {};

    get value(): CustomerDto {
        return this.innerValue;
    }

    set value(v: CustomerDto) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
        }
    }

    onBlur() {
        this.onTouchedCallback();
    }

    writeValue(value: CustomerDto) {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    }

    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
    // eslint-disable-next-line @typescript-eslint/member-ordering
    constructor(private customerService: CustomersService) {}

    loadCustomers = async (value: string) => {
        try {
            const getCustomersResponse = await this.customerService
                .getAllCustomers({
                    start: 0,
                    length: 1000,
                    search: value,
                })
                .toPromise();

            if (getCustomersResponse.success) {
                return getCustomersResponse.customers;
            }

            return [];
        } catch (err) {
            console.log('🚀 ~ loadJobOffer= ~ err', err);
        }

        return;
    };

    displayFunction = (item: CustomerDto) => {
        if (item.isCompany) {
            return item.companyName;
        } else if (item.isPrivatePerson) {
            return item.lastName + ' - ' + item.firstName;
        }
    };
}
