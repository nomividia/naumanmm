import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { StarNoteComponent } from './star-note.component';

@NgModule({
    imports: [CommonModule, MatIconModule],
    declarations: [StarNoteComponent],
    exports: [StarNoteComponent],
})
export class StarNoteModule {}
