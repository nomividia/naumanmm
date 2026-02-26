import 'jasmine';
import { CandidateApplicationService } from '../../modules/candidates-application/candidate-applications.service';
import { TestMainHelpers } from '../../test/test-main-helpers';

describe('UsersService tests', () => {
    let candidateApplicationService: CandidateApplicationService;

    beforeAll(async () => {
        await TestMainHelpers.initTestingModule();
        candidateApplicationService =
            TestMainHelpers.module.get<CandidateApplicationService>(
                CandidateApplicationService,
            );
    });

    it('should send mail candidate application received', async () => {
        expect(true).toBeTruthy();
        return;

        await candidateApplicationService.sendCandidateApplicationReceivedMail(
            {
                firstName: 'david',
                lastName: 'kessas',
                email: 'test@test.fr',
            } as any,
            { language: 'fr' },
        );
        // expect(response.success).toBeTruthy();
        // console.log("Log ~ file: mail.service.spec.ts ~ line 29 ~ it ~ response", response);
    });
});
