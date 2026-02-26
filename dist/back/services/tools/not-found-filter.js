"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AngularNotFoundExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const nextalys_node_helpers_1 = require("nextalys-node-helpers");
const path = require('path');
let AngularNotFoundExceptionFilter = class AngularNotFoundExceptionFilter {
    constructor(indexFullPath) {
        this.indexFullPath = indexFullPath;
    }
    catch(exception, host) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let reply;
            try {
                const ctx = host.switchToHttp();
                reply = ctx.getResponse();
                reply.hijack();
                const fileContent = yield nextalys_node_helpers_1.FileHelpers.readFile(this.indexFullPath, true);
                reply.raw.setHeader('Content-Type', 'text/html');
                reply.raw.end(fileContent);
            }
            catch (error) {
                console.log('Log ~ file: not-found-filter.ts:49 ~ AngularNotFoundExceptionFilter ~ error', error);
                (_a = reply === null || reply === void 0 ? void 0 : reply.raw) === null || _a === void 0 ? void 0 : _a.end('Error');
            }
        });
    }
};
AngularNotFoundExceptionFilter = __decorate([
    (0, common_1.Catch)(common_1.NotFoundException),
    __metadata("design:paramtypes", [String])
], AngularNotFoundExceptionFilter);
exports.AngularNotFoundExceptionFilter = AngularNotFoundExceptionFilter;
//# sourceMappingURL=not-found-filter.js.map