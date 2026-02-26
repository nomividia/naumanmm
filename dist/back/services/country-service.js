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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryService = exports.IpAllowedResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
const nextalys_node_helpers_1 = require("nextalys-node-helpers");
const generic_response_1 = require("../models/responses/generic-response");
class IpAllowedResponse extends generic_response_1.GenericResponse {
    constructor() {
        super(...arguments);
        this.allowed = true;
    }
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], IpAllowedResponse.prototype, "allowed", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], IpAllowedResponse.prototype, "country", void 0);
exports.IpAllowedResponse = IpAllowedResponse;
class CountryService {
    static getCountryByIp(ipAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const httpClient = new nextalys_node_helpers_1.NextalysNodeHttpClient();
            let country;
            try {
                const response = yield httpClient.request('https://api.country.is/' + ipAddress, 'get', null, true);
                const responseData = response === null || response === void 0 ? void 0 : response.data;
                country = responseData === null || responseData === void 0 ? void 0 : responseData.country;
            }
            catch (error) { }
            return country;
        });
    }
    static isIpAllowed(ipAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new IpAllowedResponse();
            if (!ipAddress || ipAddress === '::1') {
                response.allowed = true;
                return response;
            }
            const country = yield this.getCountryByIp(ipAddress);
            if (!country) {
                response.allowed = true;
                return response;
            }
            response.allowed = !this.forbiddenCountries.some((x) => (x === null || x === void 0 ? void 0 : x.toLowerCase()) === (country === null || country === void 0 ? void 0 : country.toLowerCase()));
            response.country = country;
            response.success = true;
            return response;
        });
    }
}
exports.CountryService = CountryService;
_a = CountryService;
CountryService.africanCountries = [
    'AO',
    'BJ',
    'BW',
    'BF',
    'BI',
    'CV',
    'CM',
    'CF',
    'DZ',
    'TD',
    'KM',
    'CD',
    'CG',
    'CI',
    'DJ',
    'EG',
    'GQ',
    'ER',
    'ET',
    'GA',
    'GH',
    'GM',
    'GN',
    'GW',
    'KE',
    'LS',
    'LR',
    'LY',
    'MG',
    'MW',
    'ML',
    'MR',
    'MU',
    'MZ',
    'NA',
    'NE',
    'NG',
    'RW',
    'ST',
    'SN',
    'SC',
    'SL',
    'SO',
    'SS',
    'SD',
    'SZ',
    'TZ',
    'TG',
    'TN',
    'UG',
    'ZM',
    'ZW',
];
CountryService.forbiddenCountries = [
    'PK',
    'LK',
    'IN',
    ..._a.africanCountries,
];
//# sourceMappingURL=country-service.js.map