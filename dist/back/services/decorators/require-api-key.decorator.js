"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireApiKey = exports.REQUIRE_API_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.REQUIRE_API_KEY = 'requireApiKey';
const RequireApiKey = () => (0, common_1.SetMetadata)(exports.REQUIRE_API_KEY, true);
exports.RequireApiKey = RequireApiKey;
//# sourceMappingURL=require-api-key.decorator.js.map