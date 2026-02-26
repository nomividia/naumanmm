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
exports.TranslateService = exports.translations = exports.TranslateResponse = void 0;
const nextalys_node_helpers_1 = require("nextalys-node-helpers");
class TranslateResponse {
}
exports.TranslateResponse = TranslateResponse;
class translations {
}
exports.translations = translations;
class TranslateService {
    static getTranslation(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const httpClient = new nextalys_node_helpers_1.NextalysNodeHttpClient();
            try {
                const apiKey = 'AIzaSyC43XmNRvn4Xexx_OtGyd8XdROqYTRpruA';
                const apiUrl = 'https://translation.googleapis.com/language/translate/v2';
                const url = `${apiUrl}?key=${apiKey}`;
                const response = yield httpClient.request(url, 'post', request, true);
                return response.data;
            }
            catch (error) {
                console.error('Error in TranslateService.getTranslation', error);
            }
        });
    }
}
exports.TranslateService = TranslateService;
//# sourceMappingURL=translate-service.js.map