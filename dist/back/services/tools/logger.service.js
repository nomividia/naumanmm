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
var AppLogger_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLogger = void 0;
const common_1 = require("@nestjs/common");
const nextalys_js_helpers_1 = require("nextalys-js-helpers");
const nextalys_node_helpers_1 = require("nextalys-node-helpers");
const path = require("path");
const environment_1 = require("../../environment/environment");
const app_error_1 = require("../../models/app-error");
const logsDirectoryName = 'logs';
const daysToKeepLogs = 40;
let AppLogger = AppLogger_1 = class AppLogger extends common_1.Logger {
    constructor() {
        super();
        AppLogger_1.loggerInstance = this;
    }
    static log(...data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.loggerInstance) === null || _a === void 0 ? void 0 : _a.log(...data));
        });
    }
    static warn(...data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.loggerInstance) === null || _a === void 0 ? void 0 : _a.warn(...data));
        });
    }
    static error(...data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.loggerInstance) === null || _a === void 0 ? void 0 : _a.error(...data));
        });
    }
    static errorWithId(error, guid) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.loggerInstance) === null || _a === void 0 ? void 0 : _a.errorWithId(error, guid));
        });
    }
    cleanLogs() {
        return __awaiter(this, void 0, void 0, function* () {
            let result = true;
            try {
                const logsRootDir = path.join(environment_1.Environment.ApiBasePath, logsDirectoryName);
                const filesInRootFolder = yield nextalys_node_helpers_1.FileHelpers.getFilesInFolder(logsRootDir);
                for (const file of filesInRootFolder) {
                    const fileFullPath = path.join(logsRootDir, file);
                    if (yield nextalys_node_helpers_1.FileHelpers.isDirectory(fileFullPath)) {
                        const logDate = nextalys_js_helpers_1.DateHelpers.parseDateTimeFromISO8601Format(file);
                        if (logDate) {
                            const diff = nextalys_js_helpers_1.DateHelpers.daysDiff(logDate, new Date());
                            if (diff > daysToKeepLogs) {
                                yield nextalys_node_helpers_1.FileHelpers.removeFile(fileFullPath);
                                yield this.log('Suppression du dossier "' +
                                    fileFullPath +
                                    '" réussie.');
                            }
                        }
                    }
                }
            }
            catch (err) {
                result = false;
                yield this.error('Erreur lors de la suppression du dossier', err);
            }
            return result;
        });
    }
    getLogFilePath(date, type, createFolders) {
        return __awaiter(this, void 0, void 0, function* () {
            const folderName = this.getLogFileName(date, type, true);
            const logsFolder = path.join(environment_1.Environment.ApiBasePath, logsDirectoryName);
            const currentLogsFolder = path.join(logsFolder, folderName);
            if (createFolders && !(yield nextalys_node_helpers_1.FileHelpers.fileExists(currentLogsFolder)))
                yield nextalys_node_helpers_1.FileHelpers.createDirectory(currentLogsFolder);
            const logFileName = this.getLogFileName(date, type, false);
            return path.join(currentLogsFolder, logFileName);
        });
    }
    getLogFileName(date, type, returnFolderName) {
        const folderName = `${date.getFullYear()}-${nextalys_js_helpers_1.MainHelpers.pad((date.getMonth() + 1).toString(), 2, '0')}-${nextalys_js_helpers_1.MainHelpers.pad(date.getDate().toString(), 2, '0')}`;
        if (returnFolderName)
            return folderName;
        return `${folderName}-${type}.log`;
    }
    getLogFileContent(date, type, returnString) {
        return __awaiter(this, void 0, void 0, function* () {
            const dateObj = nextalys_js_helpers_1.DateHelpers.toUtcDate(nextalys_js_helpers_1.DateHelpers.parseDateTimeFromISO8601Format(date));
            if (!dateObj)
                throw new app_error_1.AppError('Invalid date');
            const filePath = yield this.getLogFilePath(dateObj, type);
            if (!(yield nextalys_node_helpers_1.FileHelpers.fileExists(filePath)))
                return '';
            return yield nextalys_node_helpers_1.FileHelpers.readFile(filePath, returnString);
        });
    }
    removeLogFile(date, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const dateObj = nextalys_js_helpers_1.DateHelpers.toUtcDate(nextalys_js_helpers_1.DateHelpers.parseDateTimeFromISO8601Format(date));
            if (!dateObj)
                throw new app_error_1.AppError('Invalid date');
            const filePath = yield this.getLogFilePath(dateObj, type);
            if (!(yield nextalys_node_helpers_1.FileHelpers.fileExists(filePath)))
                return;
            yield nextalys_node_helpers_1.FileHelpers.removeFile(filePath);
        });
    }
    writeToFile(args, logType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let date = nextalys_js_helpers_1.DateHelpers.convertUTCDateToLocalDate(new Date(), 'Europe/Paris');
                if (!nextalys_js_helpers_1.DateHelpers.isValidDate(date)) {
                    date = new Date();
                }
                let content = '';
                args.forEach((arg) => {
                    let argStr = arg;
                    if (arg instanceof Error) {
                        argStr = JSON.stringify(arg, Object.getOwnPropertyNames(arg), 2);
                    }
                    else if (typeof arg === 'object') {
                        argStr = JSON.stringify(arg, null, 2);
                    }
                    else if (!!arg)
                        argStr = arg.toString();
                    else
                        argStr = '';
                    content += `
    ${argStr}`;
                });
                const dateString = nextalys_js_helpers_1.DateHelpers.formatDateISO8601(date, true);
                content = `
[${dateString}] - [${logType}] => ${content}`;
                yield nextalys_node_helpers_1.FileHelpers.appendFile(yield this.getLogFilePath(date, logType, true), content);
            }
            catch (err) {
                console.error('writeToFile Error => ', err);
            }
        });
    }
    errorWithId(error, guid) {
        const _super = Object.create(null, {
            error: { get: () => super.error }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const arr = ['Guid = ' + guid, error];
            yield this.writeToFile(arr, 'error');
            _super.error.call(this, arr);
            console.error(arr);
        });
    }
    error(...data) {
        const _super = Object.create(null, {
            error: { get: () => super.error }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield this.writeToFile(data, 'error');
            _super.error.call(this, data);
            console.error(data);
        });
    }
    log(...data) {
        const _super = Object.create(null, {
            log: { get: () => super.log }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield this.writeToFile(data, 'info');
            _super.log.call(this, data);
        });
    }
    warn(...data) {
        const _super = Object.create(null, {
            warn: { get: () => super.warn }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield this.writeToFile(data, 'warn');
            _super.warn.call(this, data);
        });
    }
};
AppLogger = AppLogger_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AppLogger);
exports.AppLogger = AppLogger;
//# sourceMappingURL=logger.service.js.map