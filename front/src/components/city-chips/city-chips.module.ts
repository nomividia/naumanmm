import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { CityChipsComponent } from './city-chips.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatChipsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        TranslateModule,
    ],
    declarations: [CityChipsComponent],
    exports: [CityChipsComponent],
})
export class CityChipsModule {}
