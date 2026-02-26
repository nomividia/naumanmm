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
exports.PM2Helpers = void 0;
const rxjs_1 = require("rxjs");
const environment_1 = require("../environment/environment");
const pm2 = require('pm2');
class PM2Helpers {
    static init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.enabled = !!environment_1.Environment.PM2AppName;
            if (!this.enabled) {
                return;
            }
            try {
                const pm_id_str = process.env.pm_id;
                if (!pm_id_str) {
                    return;
                }
                let pm_id = pm_id_str;
                if (typeof pm_id_str !== 'number') {
                    pm_id = parseInt(pm_id_str, 10);
                }
                this.pm2AppId = pm_id;
                this.processList = yield this.getPM2ProcessList(true);
                this.processSelf = this.processList.find((x) => x.pm_id === pm_id);
                console.log('PM2 Helpers init ~ PM2 APP ID', this.pm2AppId);
                console.log('PM2 Helpers init ~ PM2 APP LIST COUNT : ' +
                    this.processList.length +
                    ' - PM2 SELF FOUND : ' +
                    !!this.processList);
                this.subscribeData();
            }
            catch (error) {
                console.log('PM2Helpers ~ init ~ error', error);
            }
        });
    }
    static getPM2ProcessList(onlySelf) {
        return new Promise((resolve, reject) => {
            pm2.list((err, list) => {
                if (err) {
                    reject(err);
                    return;
                }
                const items = [];
                for (const item of list) {
                    if (onlySelf && item.name !== environment_1.Environment.PM2AppName) {
                        continue;
                    }
                    items.push(item);
                }
                resolve(items);
            });
        });
    }
    static pm2Connect() {
        return new Promise((resolve, reject) => {
            pm2.connect(() => {
                resolve();
            });
        });
    }
    static sendDataToProcess(processItem, data) {
        return new Promise((resolve, reject) => {
            pm2.sendDataToProcessId({
                id: processItem.pm_id,
                type: 'process:msg',
                topic: true,
                data: data,
            }, () => {
                resolve();
            });
        });
    }
    static sendDataToAllSpecificProcess(data, pm2Id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.enabled) {
                return;
            }
            try {
                const pm2Process = this.processList.find((x) => x.pm_id === pm2Id);
                if (pm2Process) {
                    yield this.sendDataToProcess(pm2Process, data);
                }
            }
            catch (error) {
                console.log('Log ~ file: pm2-helpers.ts ~ line 53 ~ PM2Helpers ~ sendDataToApp ~ error', error);
            }
        });
    }
    static sendDataToAllAppProcesses(data, exceptSelf) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.enabled) {
                return;
            }
            try {
                for (const processItem of this.processList) {
                    if (exceptSelf && processItem.pm_id === this.pm2AppId) {
                        continue;
                    }
                    yield this.sendDataToProcess(processItem, data);
                }
            }
            catch (error) {
                console.log('Log ~ file: pm2-helpers.ts ~ line 53 ~ PM2Helpers ~ sendDataToApp ~ error', error);
            }
        });
    }
    static subscribeData() {
        process.on('message', (packet) => {
            this.onPM2Data.next(packet.data);
        });
    }
}
exports.PM2Helpers = PM2Helpers;
PM2Helpers.enabled = false;
PM2Helpers.onPM2Data = new rxjs_1.Subject();
PM2Helpers.processList = [];
PM2Helpers.pm2AppId = 0;
//# sourceMappingURL=pm2-helpers.js.map