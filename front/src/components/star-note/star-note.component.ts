import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Component({
    selector: 'app-star-note',
    templateUrl: 'star-note.component.html',
    styleUrls: ['./star-note.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class StarNoteComponent extends BaseComponent {
    tempNote: number;

    @Input('note') note: number;
    @Input('editMode') editMode: boolean = false;

    @Output() onRateSelected = new EventEmitter<number>();

    @ViewChild('starContainer') private starContainer: ElementRef<HTMLElement>;

    constructor() {
        super();
    }

    ngOnInit() {
        this.tempNote = this.note;
        // console.log("Log ~ file: star-note.component.ts ~ line 28 ~ StarNoteComponent ~ ngOnInit ~  this.tempNote", this.tempNote);
    }

    applyHover(num: number) {
        if (!this.editMode) {
            return;
        }

        this.tempNote = num;
    }

    onLeave() {
        this.tempNote = this.note;
    }

    setNote(num: number) {
        if (!this.editMode) {
            return;
        }

        if (!num) {
            return;
        }

        this.onRateSelected.emit(num);
    }
}
