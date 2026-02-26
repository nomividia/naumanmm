import { List } from 'linqts';
export declare class stNoeud {
    Type: number;
    pFArbre: stNoeud;
    XFait: number;
    YFait: number;
    DecalX: number;
    DecalY: number;
    HFait: number;
    Calculed: boolean;
    Selected: boolean;
    Niveau: number;
}
export declare class NxsList<T = any> extends List<T> {
    constructor(elements?: T[]);
    [Symbol.iterator](): {
        next: () => {
            value: T;
            done: boolean;
        };
    };
    Delete(index: number): void;
    RemoveAndGetIndex(element: T): number;
    ChangeItemAtPosition(index: number, element: T): void;
}
