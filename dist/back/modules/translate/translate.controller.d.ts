import { BaseController } from '../../shared/base.controller';
export declare class TranslateController extends BaseController {
    constructor();
    getTranslation(request: string): Promise<any>;
}
