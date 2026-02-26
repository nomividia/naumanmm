import { HttpClient } from '@angular/common/http';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-secured-image',
    template: ` <img *ngIf="dataUrl" [src]="dataUrl" /> `,
    styles: [
        `
            app-secured-image {
                display: block;
                height: 100%;
                width: 100%;
            }
            app-secured-image img {
                max-width: 100%;
                max-height: 100%;
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
})
export class SecuredImageComponent {
    dataUrl: SafeUrl;

    @Input() private src: string;

    constructor(
        private httpClient: HttpClient,
        private domSanitizer: DomSanitizer,
    ) {}

    ngOnInit() {
        this.init();
    }

    async init() {
        if (!this.src) {
            return;
        }

        const dataUrl = await this.loadImage(this.src);

        if (!dataUrl) {
            return;
        }

        this.dataUrl = dataUrl;
    }

    private async loadImage(url: string): Promise<SafeUrl> {
        const blob = await this.httpClient
            .get(url, { responseType: 'blob' })
            .toPromise();

        if (!blob || blob.size === 0) {
            return null;
        }

        return this.domSanitizer.bypassSecurityTrustUrl(
            URL.createObjectURL(blob),
        );
    }
}
