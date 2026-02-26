import { ApiPropertyOptional } from '@nestjs/swagger';
import { NextalysNodeHttpClient } from 'nextalys-node-helpers';
import { GenericResponse } from '../models/responses/generic-response';

export class IpAllowedResponse extends GenericResponse {
    @ApiPropertyOptional()
    allowed: boolean = true;
    @ApiPropertyOptional()
    country: string;
}

export class CountryService {
    static africanCountries = [
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

        // 'ZA', //ignore south africa
        // 'MA', //ignore morocco
    ];

    static forbiddenCountries = [
        //pakistan
        'PK',
        //sri lanka
        'LK',
        //Inde
        'IN',
        ...this.africanCountries,
    ];

    static async getCountryByIp(ipAddress: string) {
        const httpClient = new NextalysNodeHttpClient();
        let country: string;

        try {
            const response = await httpClient.request(
                'https://api.country.is/' + ipAddress,
                'get',
                null,
                true,
            );
            // console.log("Log ~ CountryService ~ getCountryByIp ~ response:", response);
            const responseData: { ip: string; country: string } =
                response?.data;
            country = responseData?.country;
        } catch (error) {}

        return country;
        //https://api.country.is/141.255.131.31
    }

    static async isIpAllowed(ipAddress: string): Promise<IpAllowedResponse> {
        // console.log("Log ~ CountryService ~ isIpAllowed ~ ipAddress:", ipAddress);
        const response = new IpAllowedResponse();

        if (!ipAddress || ipAddress === '::1') {
            response.allowed = true;
            return response;
        }

        const country = await this.getCountryByIp(ipAddress);

        if (!country) {
            response.allowed = true;
            return response;
        }

        response.allowed = !this.forbiddenCountries.some(
            (x) => x?.toLowerCase() === country?.toLowerCase(),
        );
        response.country = country;
        response.success = true;

        return response;
    }
}
