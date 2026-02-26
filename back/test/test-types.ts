import { List } from 'linqts';
export class stNoeud {
    Type: number;
    pFArbre: stNoeud;
    XFait: number = 0;
    YFait: number = 0;

    DecalX: number = 0;
    DecalY: number = 0;
    HFait: number = 0;
    Calculed: boolean;
    Selected: boolean;
    Niveau: number;
}

export class NxsList<T = any> extends List<T> {
    constructor(elements: T[] = []) {
        super(elements);
    }
    [Symbol.iterator]() {
        let index = -1;
        // var data = this._data;

        return {
            next: () => ({
                value: this.ElementAt(++index),
                done: index >= this.Count(),
            }),
        };
    }

    Delete(index: number) {
        this.RemoveAt(index);
    }

    RemoveAndGetIndex(element: T) {
        const index = this.IndexOf(element);
        if (index === -1) return index;
        this.Remove(element);
        return index;
    }
    ChangeItemAtPosition(index: number, element: T) {
        this._elements[index] = element;
    }
}
