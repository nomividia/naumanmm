import { Pipe, PipeTransform } from '@angular/core';
import { MainHelpers } from 'nextalys-js-helpers';

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
    constructor() {}

    transform(value: string, maxLength?: number, cutType?: number): string {
        if (!maxLength) {
            maxLength = 20;
        }

        if (!cutType) {
            cutType = 0;
        }

        return MainHelpers.shorten(value, maxLength, cutType as any, '...');
    }
}
