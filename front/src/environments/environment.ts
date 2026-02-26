// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { environment as currentEnvironment } from './environment.dev';
const apiPrefix = 'api';
export const environment = {
    production: currentEnvironment.production,
    envName: currentEnvironment.envName,
    apiBaseUrl: currentEnvironment.apiBaseUrl,
    apiBaseUrlWithPrefix: currentEnvironment.apiBaseUrl + '/' + apiPrefix,
    uploadMediaUrl: currentEnvironment.apiBaseUrl + '/' + apiPrefix + '/file',
    uploadImageUrl: currentEnvironment.apiBaseUrl + '/' + apiPrefix + '/image',
    uploadedFilesTempDirectoryUrl:
        currentEnvironment.apiBaseUrl + '/uploaded-files-temp',
    googleOAuthClientId: currentEnvironment.googleOAuthClientId,
    facebookAppId: currentEnvironment.facebookAppId,
    googleMapsApiKey: currentEnvironment.googleMapsApiKey,
    mapBoxApiKey: currentEnvironment.mapBoxApiKey,
    version: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
    appName: 'Morgan And Mallet International',
    httpDelay: currentEnvironment.httpDelay,
    analyticsEnabled: false,
    firebaseEnabled: false,
    liveTrackingEnabled: false,
    liveTrackingPageEnabled: false,
    googleRecaptchaSiteKey: '6Lem774aAAAAADV2AnbLXVvAJvQUZpc1yHpXLRwJ',
    picaActivatedFeatures: ['js'],
    baseUrl: currentEnvironment.baseUrl,
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
