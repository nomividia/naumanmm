import { HttpClient } from '@angular/common/http';
import {
    Component,
    EventEmitter,
    forwardRef,
    Input,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NextalysAutocompleteComponent } from 'nextalys-angular-tools';
import { Department, GeoService } from '../../services/geo.service';
import { BaseComponent } from '../base/base.component';

// export interface DptWrapper {
//     value: string;
//     isAutocompleteProposition: boolean;
//     department?: Department;
// }

@Component({
    selector: 'app-departments-autocomplete',
    templateUrl: './departments-autocomplete.component.html',
    styleUrls: ['departments-autocomplete.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DepartmentsAutocompleteComponent),
            multi: true,
        },
    ],
})
export class DepartmentsAutocompleteComponent extends BaseComponent {
    private pCountryCodes: string[];
    private innerValue: Department;
    fullDataSearchMethod: any;
    currentText: string;

    departments: Department[] = [];
    loading = false;

    @Input() required = false;
    @Input() showValidBtn = false;
    @Input() disabled = false;
    @Input() label = '';
    @Input('countryCodes') set countryCodes(v: string[]) {
        this.pCountryCodes = v;
        this.onSetCountriesList();
    }

    @ViewChild(NextalysAutocompleteComponent)
    nextalysAutocompleteComponent: NextalysAutocompleteComponent;

    @Output() textChange = new EventEmitter<string>();
    @Output() validate = new EventEmitter<string>();

    get value(): Department {
        return this.innerValue;
    }

    set value(v: Department) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
        }
    }

    constructor(public http: HttpClient) {
        super();
        this.fullDataSearchMethod = this.fullDataSearch.bind(this);
    }

    private async onSetCountriesList() {
        this.departments = [];

        if (!this.pCountryCodes?.length) {
            return;
        }

        for (const item of this.pCountryCodes) {
            await GeoService.loadJSON(item, this);
        }

        this.departments = GeoService.departments;
    }

    private onChangeCallback: (_: any) => void = () => {};

    private onTouchedCallback: () => void = () => {};

    onBlur() {
        this.onTouchedCallback();
    }

    writeValue(value: Department) {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    }

    onTextChange(val: string) {
        this.currentText = val;
        this.textChange.emit(val);
    }

    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    // // eslint-disable-next-line @typescript-eslint/require-await
    // loadDepartments = async (value: string) => {
    //     try {
    //         if (!this.value) {
    //             this.value = { isAutocompleteProposition: false, value };
    //         }

    //         this.value.isAutocompleteProposition = false;
    //         this.value.value = value;
    //         this.value.department = null;

    //         if (!this.departments)
    //             return;

    //         return this.departments.filter(x => x.name.toLowerCase().includes(value)).map(x => ({
    //             value: x.name,
    //             department: x,
    //             isAutocompleteProposition: true,
    //         }));
    //     } catch (err) {
    //         console.log("🚀 ~ loadJobOffer= ~ err", err);
    //     }
    //     return;
    // };

    displayFunction = (item: Department) => {
        // console.log("Log ~ file: departments-autocomplete.component.ts:165 ~ displayFunction ~ item", item);
        let label = '';

        if (item?.name) {
            label += item?.name;

            if (item?.num) {
                label += ' (' + item.num + ')';
            }

            if (item?.region) {
                label += ' - ' + item?.region;
            }
        }

        if (!label) {
            label = item?.num || '';
        }

        return label;
    };

    fullDataSearch(item: Department, input: string) {
        if (!item || !input) {
            return false;
        }

        const dptName = item?.name?.toLowerCase()?.trim();
        const dptNum = item?.num?.toLowerCase()?.trim();
        const inputLower = input?.toLowerCase()?.trim();

        if (dptName) {
            if (dptName.indexOf(inputLower) !== -1) {
                return true;
            }
        }

        if (dptNum) {
            if (dptNum.indexOf(inputLower) !== -1) {
                return true;
            }
        }

        return false;
    }

    onValidate() {
        this.validate?.emit(this.currentText);
    }

    clear() {
        this.nextalysAutocompleteComponent?.clearInput();
    }
}
