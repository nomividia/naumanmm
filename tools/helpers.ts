const colors = require("colors/safe");

export class ScriptHelpers {
    public static handleError(error: string | any) {
        if (typeof colors != "undefined") {
            console.error(colors.red(error));
        } else {
            console.error(error);
        }

        process.exit(1);
    }

    static log(...args: any[]) {
        if (typeof colors != "undefined") {
            console.log(colors.cyan(...args));
        } else {
            console.log(...args);
        }
    }

    static endScript(message: string) {
        if (typeof colors != "undefined") {
            console.log(colors.green(message));
        } else {
            console.log(message);
        }

        process.exit(0);
    }
}
