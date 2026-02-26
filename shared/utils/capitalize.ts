export const capitalize = (value: string) => {
    if (!value) {
        return value;
    }

    value = value.toLowerCase();

    return value.charAt(0).toUpperCase() + value.slice(1);
};
