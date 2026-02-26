import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { CandidatePlacementHistoryComponent } from './candidate-placement-history.component';

@NgModule({
    declarations: [CandidatePlacementHistoryComponent],
    imports: [
        CommonModule,
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        TranslateModule,
    ],
    exports: [CandidatePlacementHistoryComponent],
})
export class CandidatePlacementHistoryModule {}
