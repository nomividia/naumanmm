import { HttpClient } from '@angular/common/http';

export interface CountryDepartmentsJson {
    dep_name: string;
    num_dep: number;
    region_name: string;
}

export interface Department {
    country: string;
    num: string;
    name: string;
    region?: string;
}

export class GeoService {
    static departments: Department[] = [];
    private static countriesLoaded: string[] = [];
    private static countriesLoading: string[] = [];

    static async loadJSON(
        countryCode: string,
        baseComponent: {
            sendApiRequest?: (arg: any) => Promise<any>;
            http?: HttpClient;
        },
    ) {
        try {
            if (
                !countryCode ||
                !baseComponent?.sendApiRequest ||
                !baseComponent?.http
            ) {
                return;
            }

            countryCode = countryCode.toLowerCase().trim();

            if (
                this.countriesLoaded?.some((x) => x === countryCode) ||
                this.countriesLoading?.some((x) => x === countryCode)
            ) {
                return;
            }

            if (!this.departments) {
                this.departments = [];
            }

            const countryCodeLower = countryCode.toLowerCase();
            this.countriesLoading.push(countryCode);

            const fileContent = (await baseComponent.sendApiRequest(
                baseComponent.http.get(
                    '/assets/departments/' + countryCodeLower + '.json',
                ),
            )) as CountryDepartmentsJson[];

            const index = this.countriesLoading.indexOf(countryCode);

            if (index !== -1) {
                this.countriesLoading.splice(index, 1);
            }

            if (fileContent?.length) {
                if (!this.countriesLoaded?.some((x) => x === countryCode)) {
                    this.departments.push(
                        ...fileContent.map((x) => ({
                            name: x.dep_name,
                            num: x.num_dep?.toString(),
                            country: countryCodeLower,
                            region: x.region_name,
                        })),
                    );
                    this.countriesLoaded.push(countryCode);
                }

                console.log(
                    'Log ~ file: departments-autocomplete.component.ts:151 ~ DepartmentsAutocompleteComponent ~ loadJSON ~    this.departments',
                    this.departments,
                );
            }
        } catch (err) {
            console.log('🚀 ~ loadJSON ~ err', err);
        }
    }
}
