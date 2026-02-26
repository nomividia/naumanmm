"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpiredTokenException = void 0;
const common_1 = require("@nestjs/common");
class ExpiredTokenException extends common_1.HttpException {
    constructor() {
        super('Forbidden', common_1.HttpStatus.FORBIDDEN);
    }
}
exports.ExpiredTokenException = ExpiredTokenException;
//# sourceMappingURL=expired-token-exception.js.map