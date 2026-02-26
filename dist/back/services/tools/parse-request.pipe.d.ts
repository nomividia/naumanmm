import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
export declare class ParseRequestPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any;
}
