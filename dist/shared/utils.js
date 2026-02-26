"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NonEnumerable = void 0;
const NonEnumerable = (target, propertyKey) => {
    const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey) || {};
    if (descriptor.enumerable !== false) {
        Object.defineProperty(target, propertyKey, {
            enumerable: false,
            set(value) {
                Object.defineProperty(this, propertyKey, {
                    enumerable: false,
                    writable: true,
                    value,
                });
            },
        });
    }
};
exports.NonEnumerable = NonEnumerable;
//# sourceMappingURL=utils.js.map