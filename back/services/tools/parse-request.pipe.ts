import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { DateHelpers } from 'nextalys-js-helpers';

@Injectable()
export class ParseRequestPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (!value) return value;
        DateHelpers.parseAllDatesRecursive(value, true);
        return value;
    }
}
