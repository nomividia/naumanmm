import { BaseGoogleApi } from 'nextalys-node-helpers/dist/google-api';
import * as path from 'path';
import { Environment } from '../environment/environment';
import { EventsHandler } from './tools/events-handler';

export class BaseGoogleService {
    static initialized = false;
    static async init() {
        if (!Environment.GDriveClientSecretFileName) {
            return;
        }

        const credentialsFile = path.join(
            Environment.ApiBasePath,
            Environment.GDriveClientSecretFileName,
        );
        await BaseGoogleApi.init({ credentialFile: credentialsFile });
        this.initialized = true;
        EventsHandler.initGdriveModule.next();
    }
}
