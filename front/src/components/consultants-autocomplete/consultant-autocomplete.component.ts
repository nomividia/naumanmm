import { Component, forwardRef, Input, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { RolesList } from '../../../../shared/shared-constants';
import { UserDto, UsersService } from '../../providers/api-client.generated';

@Component({
    selector: 'app-consultant-autocomplete',
    templateUrl: './consultant-autocomplete.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ConsultantsAutocompleteComponent),
            multi: true,
        },
    ],
})
export class ConsultantsAutocompleteComponent {
    private innerValue: UserDto;

    public RolesList = RolesList;

    loading = false;

    @Input() disabled = false;
    @Input() placeholder = '';

    private onChangeCallback: (_: any) => void = () => {};

    private onTouchedCallback: () => void = () => {};

    get value(): UserDto {
        return this.innerValue;
    }

    set value(v: UserDto) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
        }
    }

    onBlur() {
        this.onTouchedCallback();
    }

    writeValue(value: UserDto) {
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
    constructor(private userService: UsersService) {
        // console.log("🚀 ~ ConsultantsAutocompleteComponent ~ placeholder", this.placeholder);
    }

    loadConsultants = async (value: string) => {
        try {
            const getConsultantsResponse = await this.userService
                .getAllUsers({
                    start: 0,
                    length: 1000,
                    search: value,
                    roles: [this.RolesList.Consultant, this.RolesList.RH].join(
                        ',',
                    ),
                })
                .toPromise();

            if (getConsultantsResponse.success) {
                return getConsultantsResponse.users;
            }

            return [];
        } catch (err) {
            console.log('🚀 ~ loadJobOffer= ~ err', err);
        }

        return;
    };

    displayFunction = (item: UserDto) => {
        return item.lastName + ' - ' + item.firstName;
    };
}
