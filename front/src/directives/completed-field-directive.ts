import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
    selector: `[ngModel][completedField]`,
})
export class CompletedFieldDirective implements OnInit {
    @Input() completedField = 'white-bg-input';

    constructor(
        private element: ElementRef<HTMLElement>,
        private ngModel: NgModel,
        private renderer: Renderer2,
    ) {}

    ngOnInit() {
        if (!this.ngModel) {
            return;
        }

        this.ngModel.valueChanges.subscribe((val) => {
            this.setClassDependingOnModel(val);
        });
        this.setClassDependingOnModel(this.ngModel.value);
    }

    private setClassDependingOnModel(val: any) {
        // console.log("Log ~ file: completed-field-directive.ts ~ line 45 ~ CompletedFieldDirective ~ this.ngModel.valueChanges.subscribe ~ matFormField", matFormField);
        if (!this.completedField) {
            this.completedField = 'white-bg-input';
        }
        // console.log('this element', this.element.nativeElement.parentElement);
        const matFormField = this.getMatFormField();
        // console.log("Log ~ file: completed-field-directive.ts ~ line 45 ~ CompletedFieldDirective ~ this.ngModel.valueChanges.subscribe ~ matFormField", matFormField);
        if (!matFormField) {
            return;
        }

        if (!!val && (!Array.isArray(val) || val.length)) {
            this.renderer.addClass(matFormField, this.completedField);
            // console.log('add  class', matFormField, this.completedField);
        } else {
            this.renderer.removeClass(matFormField, this.completedField);
            // console.log('remove  class', matFormField, this.completedField);
        }
    }

    private getMatFormField() {
        // console.log("Log ~ file: completed-field-directive.ts ~ line 83 ~ this.element.nativeElement?.parentElement?.parentElement", this.element.nativeElement?.parentElement?.parentElement?.parentElement?.parentElement?.tagName);
        if (
            this.element?.nativeElement?.parentElement?.parentElement
                ?.parentElement?.parentElement?.tagName === 'MAT-FORM-FIELD'
        ) {
            return this.element?.nativeElement?.parentElement?.parentElement
                ?.parentElement?.parentElement;
        }

        return null;
    }
}
