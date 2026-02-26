import { NextalysNodeHttpClient } from 'nextalys-node-helpers';

export class TranslateResponse {
    data: translations[];
}

export class translations {
    translatedText: string;
}

export class TranslateService {
    static async getTranslation(request: string): Promise<any> {
        const httpClient = new NextalysNodeHttpClient();

        try {
            const apiKey = 'AIzaSyC43XmNRvn4Xexx_OtGyd8XdROqYTRpruA';
            const apiUrl =
                'https://translation.googleapis.com/language/translate/v2';

            const url = `${apiUrl}?key=${apiKey}`;
            const response = await httpClient.request(
                url,
                'post',
                request,
                true,
            );

            return response.data;
        } catch (error) {
            console.error('Error in TranslateService.getTranslation', error);
        }
    }
}
