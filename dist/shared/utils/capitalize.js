"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalize = void 0;
const capitalize = (value) => {
    if (!value) {
        return value;
    }
    value = value.toLowerCase();
    return value.charAt(0).toUpperCase() + value.slice(1);
};
exports.capitalize = capitalize;
//# sourceMappingURL=capitalize.js.map