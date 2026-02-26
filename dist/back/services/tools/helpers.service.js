"use strict";
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
exports.ApiMainHelpers = void 0;
const bcryptjs_1 = require("bcryptjs");
const nextalys_node_helpers_1 = require("nextalys-node-helpers");
const environment_1 = require("../../environment/environment");
class ApiMainHelpers {
    static getIpAddress(req) {
        if (!req)
            return null;
        return (req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress);
    }
    static isMainWorker() {
        return (!process.env.NODE_APP_INSTANCE ||
            process.env.NODE_APP_INSTANCE === '0');
    }
    static hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield (0, bcryptjs_1.genSalt)(10);
            return yield (0, bcryptjs_1.hash)(password, salt);
        });
    }
    static comparePasswords(clearPassword, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, bcryptjs_1.compare)(clearPassword, hashedPassword);
            return result;
        });
    }
    static removeOrphanChildren(repository, nullFieldName) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {};
            where[nullFieldName] = null;
            const response = yield repository.find({ where });
            if (response && response.length > 0)
                yield repository.delete(response.map((x) => x.id));
        });
    }
    static mysql_real_escape_string(str) {
        if (!str)
            return str;
        if (typeof str !== 'string')
            return str;
        return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
            switch (char) {
                case '\0':
                    return '\\0';
                case '\x08':
                    return '\\b';
                case '\x09':
                    return '\\t';
                case '\x1a':
                    return '\\z';
                case '\n':
                    return '\\n';
                case '\r':
                    return '\\r';
                case '"':
                case "'":
                case '\\':
                case '%':
                    return '\\' + char;
                default:
                    return char;
            }
        });
    }
    static saveFileInPublicTempFolder(fileName, fileContent) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = nextalys_node_helpers_1.FileHelpers.joinPaths(environment_1.Environment.PublicTempFolder, fileName);
            return yield nextalys_node_helpers_1.FileHelpers.writeFile(filePath, fileContent);
        });
    }
}
exports.ApiMainHelpers = ApiMainHelpers;
//# sourceMappingURL=helpers.service.js.map