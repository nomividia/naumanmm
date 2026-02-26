import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'decode_uri' })
export class DecodeUriPipe implements PipeTransform {
    constructor() {}

    transform(toDecode: string): string {
        if (!toDecode) {
            return '';
        }

        return decodeURIComponent(toDecode);
    }
}
