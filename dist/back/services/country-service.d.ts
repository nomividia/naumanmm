import { GenericResponse } from '../models/responses/generic-response';
export declare class IpAllowedResponse extends GenericResponse {
    allowed: boolean;
    country: string;
}
export declare class CountryService {
    static africanCountries: string[];
    static forbiddenCountries: string[];
    static getCountryByIp(ipAddress: string): Promise<string>;
    static isIpAllowed(ipAddress: string): Promise<IpAllowedResponse>;
}
