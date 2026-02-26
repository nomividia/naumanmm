import { FileHelpers, NextalysNodeHttpClient } from "nextalys-node-helpers";
const path = require("path");

export class CountryService {
    static africanCountries = [
        "AO",
        "BJ",
        "BW",
        "BF",
        "BI",
        "CV",
        "CM",
        "CF",
        "DZ",
        "TD",
        "KM",
        "CD",
        "CG",
        "CI",
        "DJ",
        "EG",
        "GQ",
        "ER",
        "ET",
        "GA",
        "GH",
        "GM",
        "GN",
        "GW",
        "KE",
        "LS",
        "LR",
        "LY",
        "MG",
        "MW",
        "ML",
        "MR",
        "MU",
        "MZ",
        "NA",
        "NE",
        "NG",
        "RW",
        "ST",
        "SN",
        "SC",
        "SL",
        "SO",
        "SS",
        "SD",
        "SZ",
        "TZ",
        "TG",
        "TN",
        "UG",
        "ZM",
        "ZW",

        // 'ZA', //ignore south africa
        // 'MA', //ignore morocco
    ];

    static forbiddenCountries = [
        //pakistan
        "PK",
        //sri lanka
        "LK",
        //Inde
        "IN",
        ...this.africanCountries,
    ];

    static async getCountryByIp(ipAddress: string) {
        const httpClient = new NextalysNodeHttpClient();
        let country: string;

        try {
            const response = await httpClient.request(
                "https://api.country.is/" + ipAddress,
                "get",
                null,
                true
            );
            // console.log("Log ~ CountryService ~ getCountryByIp ~ response:", response);
            const responseData: { ip: string; country: string } =
                response?.data;
            country = responseData?.country;
        } catch (error) {}

        return country;
        //https://api.country.is/141.255.131.31
    }

    static async isIpAllowed(ipAddress: string) {
        const response: { allowed: boolean; country: string } = {
            allowed: true,
            country: null,
        };

        const country = await this.getCountryByIp(ipAddress);

        if (!country) {
            return response;
        }

        response.allowed = !this.forbiddenCountries.some(
            (x) => x?.toLowerCase() === country?.toLowerCase()
        );

        response.country = country;
        return response;
    }
}

async function test() {
    const data = (await FileHelpers.readFile(
        path.join(__dirname, "african-countries.json"),
        true
    )) as string;
    const obj = JSON.parse(data);
    let arr: string[] = [];

    for (const key in obj) {
        arr.push(key);
    }

    console.log(arr);
}

async function isIpAllowedTest() {
    const ipAllowed = await CountryService.isIpAllowed("141.255.131.31");
    console.log("Log ~ isIpAllowedTest ~ ipAllowed:", ipAllowed);
    const ipAllowed2 = await CountryService.isIpAllowed("101.0.32.0");
    console.log("Log ~ isIpAllowedTest ~ ipAllowed2:", ipAllowed2);

    const ipAllowed3 = await CountryService.isIpAllowed("103.100.188.0");
    console.log("Log ~ isIpAllowedTest ~ ipAllowed3:", ipAllowed3);

    const ipAllowed4 = await CountryService.isIpAllowed("103.207.116.0");
    console.log("Log ~ isIpAllowedTest ~ ipAllowed4:", ipAllowed4);

    const ipAllowed5 = await CountryService.isIpAllowed("103.127.44.0");
    console.log("Log ~ isIpAllowedTest ~ ipAllowed5:", ipAllowed5);
}

isIpAllowedTest();

// test();
