/**
 * @enumerable decorator that sets the enumerable property of a class field to false.
 * @param value true|false
 */
export const NonEnumerable = (target: any, propertyKey: string) => {
    const descriptor =
        Object.getOwnPropertyDescriptor(target, propertyKey) || {};

    if (descriptor.enumerable !== false) {
        Object.defineProperty(target, propertyKey, {
            enumerable: false,
            set(value: any) {
                Object.defineProperty(this, propertyKey, {
                    enumerable: false,
                    writable: true,
                    value,
                });
            },
        });
    }
};
