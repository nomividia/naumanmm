import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    NgZone,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
    selector: 'app-city-chips',
    templateUrl: './city-chips.component.html',
    styleUrls: ['./city-chips.component.scss'],
})
export class CityChipsComponent implements OnChanges, AfterViewInit {
    @Input() cities: string[] = [];
    @Input() placeholder: string = 'Add a city...';
    @Input() disabled: boolean = false;

    @Output() citiesChange = new EventEmitter<string[]>();

    readonly separatorKeysCodes = [ENTER, COMMA] as const;

    constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['cities']) {
            // Ensure cities is always an array
            if (!Array.isArray(this.cities)) {
                this.cities = [];
            }
        }
    }

    ngAfterViewInit(): void {
        // Ensure proper initialization
        this.ngZone.runOutsideAngular(() => {
            setTimeout(() => {
                this.ngZone.run(() => {
                    this.cdr.detectChanges();
                });
            });
        });
    }

    addCity(event: MatChipInputEvent): void {
        // Prevent adding cities when disabled
        if (this.disabled) {
            return;
        }

        const value = (event.value || '').trim();

        if (value && !this.cities.includes(value)) {
            this.cities = [...this.cities, value];
            this.citiesChange.emit(this.cities);
            // Use NgZone to avoid ExpressionChangedAfterItHasBeenCheckedError
            this.ngZone.runOutsideAngular(() => {
                setTimeout(() => {
                    this.ngZone.run(() => {
                        this.cdr.detectChanges();
                    });
                });
            });
        }

        event.chipInput.clear();
    }

    removeCity(city: string): void {
        // Prevent removing cities when disabled
        if (this.disabled) {
            return;
        }

        const index = this.cities.indexOf(city);

        if (index >= 0) {
            this.cities = this.cities.filter((_, i) => i !== index);
            this.citiesChange.emit(this.cities);
            // Use NgZone to avoid ExpressionChangedAfterItHasBeenCheckedError
            this.ngZone.runOutsideAngular(() => {
                setTimeout(() => {
                    this.ngZone.run(() => {
                        this.cdr.detectChanges();
                    });
                });
            });
        }
    }

    get hasCities(): boolean {
        return this.cities && this.cities.length > 0;
    }
}
