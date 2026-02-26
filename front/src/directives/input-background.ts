/* eslint-disable no-underscore-dangle */
import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appInputBg]',
})
export class InputBackgroundDirective implements OnInit {
    private classToApply = 'white-bg';

    private _property: any;
    @Input('appInputBg') set property(v: any) {
        this._property = v;
        this.init();
    }

    constructor(private el: ElementRef, private renderer: Renderer2) {}

    ngOnInit() {
        this.init();
    }

    init() {
        if (this.applyWhiteBackgroundOnField()) {
            this.renderer.addClass(this.el.nativeElement, this.classToApply);
        } else {
            this.renderer.removeClass(this.el.nativeElement, this.classToApply);
        }
    }

    applyWhiteBackgroundOnField() {
        return !this._property || (this._property as Array<any>)?.length === 0;
    }
}
