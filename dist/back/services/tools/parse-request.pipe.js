"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseRequestPipe = void 0;
const common_1 = require("@nestjs/common");
const nextalys_js_helpers_1 = require("nextalys-js-helpers");
let ParseRequestPipe = class ParseRequestPipe {
    transform(value, metadata) {
        if (!value)
            return value;
        nextalys_js_helpers_1.DateHelpers.parseAllDatesRecursive(value, true);
        return value;
    }
};
ParseRequestPipe = __decorate([
    (0, common_1.Injectable)()
], ParseRequestPipe);
exports.ParseRequestPipe = ParseRequestPipe;
//# sourceMappingURL=parse-request.pipe.js.map