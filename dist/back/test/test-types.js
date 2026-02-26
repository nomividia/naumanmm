"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NxsList = exports.stNoeud = void 0;
const linqts_1 = require("linqts");
class stNoeud {
    constructor() {
        this.XFait = 0;
        this.YFait = 0;
        this.DecalX = 0;
        this.DecalY = 0;
        this.HFait = 0;
    }
}
exports.stNoeud = stNoeud;
class NxsList extends linqts_1.List {
    constructor(elements = []) {
        super(elements);
    }
    [Symbol.iterator]() {
        let index = -1;
        return {
            next: () => ({
                value: this.ElementAt(++index),
                done: index >= this.Count(),
            }),
        };
    }
    Delete(index) {
        this.RemoveAt(index);
    }
    RemoveAndGetIndex(element) {
        const index = this.IndexOf(element);
        if (index === -1)
            return index;
        this.Remove(element);
        return index;
    }
    ChangeItemAtPosition(index, element) {
        this._elements[index] = element;
    }
}
exports.NxsList = NxsList;
//# sourceMappingURL=test-types.js.map