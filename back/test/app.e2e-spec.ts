import { ReferentialService } from '../services/referential.service';
import { TestMainHelpers } from './test-main-helpers';
import { NxsList, stNoeud } from './test-types';

describe('AppController (e2e)', () => {
    let referentialService: ReferentialService;
    beforeAll(async () => {
        await TestMainHelpers.initTestingModule();
        referentialService =
            TestMainHelpers.module.get<ReferentialService>(ReferentialService);
    });

    // it('/ (GET)', () => {
    //   return TestMainHelpers.sendRequest()
    //     .get('/')
    //     .expect(200)
    //     .expect('API Ready');
    // });
    it('test', () => {
        expect(true).toBeTruthy();
    });

    it('get app values', async () => {
        return;
        const response = await referentialService.getAllAppValues();
        console.log(
            'Log ~ file: app.e2e-spec.ts ~ line 24 ~ it ~ response',
            response,
        );
        expect(response.success).toBeTruthy();
    });

    it('List tests', () => {
        // return;
        let pTempNoeud: stNoeud | null;
        const pLNoeudsVirtuels: NxsList<stNoeud> = new NxsList();
        pTempNoeud = pLNoeudsVirtuels.ElementAtOrDefault(0);
        // console.log("Log ~ file: mail.service.spec.ts ~ line 112 ~ it ~ pTempNoeud", pTempNoeud);
        expect(pTempNoeud).toBeUndefined();
        pLNoeudsVirtuels.Add(new stNoeud());
        pTempNoeud = pLNoeudsVirtuels.ElementAtOrDefault(0);
        // console.log("Log ~ file: mail.service.spec.ts ~ line 117 ~ it ~ pTempNoeud", pTempNoeud);
        expect(pTempNoeud).toBeTruthy();
    });
});
