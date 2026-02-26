import { Component, forwardRef, Input, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import {
    CandidateDto,
    CandidatesService,
} from '../../providers/api-client.generated';
import { BaseComponent } from '../base/base.component';

@Component({
    selector: 'app-candidate-autocomplete',
    templateUrl: './candidate-autocomplete.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CandidateAutocompleteComponent),
            multi: true,
        },
    ],
})
export class CandidateAutocompleteComponent extends BaseComponent {
    private innerValue: CandidateDto;
    loading = false;

    @Input() disabled = false;
    @Input() placeholder = '';
    @Input() label = '';
    @Input() tooltip = '';
    @Input() candidateStatusToTake: string[] = [];

    constructor(private candidatesService: CandidatesService) {
        super();
    }

    private onChangeCallback: (_: any) => void = () => {};

    private onTouchedCallback: () => void = () => {};

    get value(): CandidateDto {
        return this.innerValue;
    }

    set value(v: CandidateDto) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
        }
    }

    onBlur() {
        this.onTouchedCallback();
    }

    writeValue(value: CandidateDto) {
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

    loadCandidate = async (val: string) => {
        // console.log("Log ~ CandidateAutocompleteComponent ~ loadCandidate= ~ val:", val);
        try {
            const getCandidatesResponse = await this.sendApiRequest(
                this.candidatesService.getAllCandidates({
                    getCandidatesRequest: {
                        disabled: 'false',
                        candidateStatut: this.candidateStatusToTake.join(','), // || null
                        search: val,
                    },
                }),
            );
            // console.log("🚀 ~ loadJobOffer= ~ getJobOffersResponse", getCandidatesResponse);

            if (!getCandidatesResponse.success) {
                return [];
            }

            return getCandidatesResponse.candidates;
        } catch (err) {
            console.log('🚀 ~ loadJobOffer= ~ err', err);
        }

        return;
    };

    displayFunction = (item: CandidateDto) => {
        return (
            (item.firstName ?? '') +
            ' - ' +
            (item.lastName?.toUpperCase() ?? '')
        );
    };
}
