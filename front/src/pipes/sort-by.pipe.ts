/*
 *ngFor="let c of oneDimArray | sortBy:'asc'"
 *ngFor="let c of arrayOfObjects | sortBy:'asc':'propertyName'"
 */
import { Pipe, PipeTransform } from '@angular/core';
import { NxsList } from 'nextalys-js-helpers/dist/nxs-list';

@Pipe({ name: 'sortBy' })
export class SortByPipe implements PipeTransform {
    transform(
        value: any[],
        order: 'asc' | 'desc' = 'asc',
        column: string = '',
    ): any[] {
        if (!value || !order) {
            return value;
        } // no array

        if (value.length <= 1) {
            return value;
        } // array with only one item

        if (!column) {
            if (order === 'asc') {
                return value.sort();
            } else {
                return value.sort().reverse();
            }
        }

        if (order === 'asc') {
            return new NxsList(value).OrderBy((x) => x[column]).ToArray();
        }

        return new NxsList(value).OrderByDescending((x) => x[column]).ToArray();
    }
}
