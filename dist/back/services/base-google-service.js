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
exports.BaseGoogleService = void 0;
const google_api_1 = require("nextalys-node-helpers/dist/google-api");
const path = require("path");
const environment_1 = require("../environment/environment");
const events_handler_1 = require("./tools/events-handler");
class BaseGoogleService {
    static init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!environment_1.Environment.GDriveClientSecretFileName) {
                return;
            }
            const credentialsFile = path.join(environment_1.Environment.ApiBasePath, environment_1.Environment.GDriveClientSecretFileName);
            yield google_api_1.BaseGoogleApi.init({ credentialFile: credentialsFile });
            this.initialized = true;
            events_handler_1.EventsHandler.initGdriveModule.next();
        });
    }
}
exports.BaseGoogleService = BaseGoogleService;
BaseGoogleService.initialized = false;
//# sourceMappingURL=base-google-service.js.map