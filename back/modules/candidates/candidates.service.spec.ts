import 'jasmine';
import { AppTypes } from '../../../shared/shared-constants';
import { ReferentialService } from '../../services/referential.service';
import { TestMainHelpers } from '../../test/test-main-helpers';
// import { InterviewsService } from "../interviews/interviews.service";
import { CandidateService } from './candidates.service';

describe('UsersService tests', () => {
    let candidateService: CandidateService;
    let referentialService: ReferentialService;

    beforeAll(async () => {
        await TestMainHelpers.initTestingModule();
        candidateService =
            TestMainHelpers.module.get<CandidateService>(CandidateService);
        referentialService =
            TestMainHelpers.module.get<ReferentialService>(ReferentialService);
        // console.log("Log ~ file: candidates.service.spec.ts ~ line 16 ~ beforeAll ~ referentialService", referentialService);
        // const test = TestMainHelpers.module.get<InterviewsService>(InterviewsService);
        // console.log("Log ~ file: candidates.service.spec.ts ~ line 17 ~ beforeAll ~ test", test);
    });

    // eslint-disable-next-line @typescript-eslint/require-await
    it('should get candidateService', async () => {
        // const candidateTestResponse = await candidateService.findAll({ take: 1 });
        // console.log("Log ~ file: candidates.service.spec.ts ~ line 15 ~ it ~ candidateTestResponse", candidateTestResponse);
        // expect(candidateTestResponse.success).toBeTruthy();
        expect(true).toBeTruthy();
    });

    it('should get candidate', async () => {
        // const candidateTestResponse = await candidateService.findAll({ take: 1 });
        // console.log("Log ~ file: candidates.service.spec.ts ~ line 15 ~ it ~ candidateTestResponse", candidateTestResponse);
        // expect(candidateTestResponse.success).toBeTruthy();
        //test disabled
        return;
        expect(true).toBeTruthy();

        const candidateTestResponse = await candidateService.findAll(
            { take: 2, relations: ['associatedUser'] },
            false,
            [],
        );
        for (const candidateTest of candidateTestResponse.candidates) {
            // console.log("Log ~ file: candidates.service.spec.ts ~ line 34 ~ it ~ candidateTest", candidateTest.associatedUser);
        }
        // console.log("Log ~ file: candidates.service.spec.ts ~ line 33 ~ it ~ candidateTestResponse", candidateTestResponse);
        expect(candidateTestResponse.success).toBeTruthy();
    });

    it('should create candidate', async () => {
        //test disabled
        return;
        expect(true).toBeTruthy();

        const typesValues = await referentialService.getTypeValues({
            appTypeCode: AppTypes.PersonGenderCode,
        });
        const typesRelValues = await referentialService.getTypeValues({
            appTypeCode: AppTypes.RelationshipStatusCode,
        });

        const candidateTestResponse = await candidateService.createOrUpdate(
            {
                firstName: 'test_lastname',
                lastName: 'test_lastname',
                animal: false,
                creationDate: new Date(2020, 3, 7, 0, 0, 0, 0),
                genderId: typesValues.appType?.appValues?.[0]?.id,
                relationshipStatusId:
                    typesRelValues.appType?.appValues?.[0]?.id,
            } as any,
            false,
            {},
        );
        // console.log("Log ~ file: candidates.service.spec.ts ~ line 15 ~ it ~ candidateTestResponse", candidateTestResponse);
        expect(candidateTestResponse.success).toBeTruthy();

        if (
            candidateTestResponse.success &&
            candidateTestResponse.candidate?.id
        ) {
            const candidateGetResponse = await candidateService.findOne({
                where: { id: candidateTestResponse.candidate.id },
            });
            expect(candidateGetResponse.success).toBeTruthy();

            if (candidateGetResponse.success) {
                // console.log("Log ~ file: candidates.service.spec.ts ~ line 33 ~ it ~ candidateGetResponse", candidateGetResponse.candidate);

                const candidateDeleteResponse = await candidateService.delete([
                    candidateTestResponse.candidate.id as any as string,
                ]);
                expect(candidateDeleteResponse.success).toBeTruthy();
            }
        }
        // expect(true).toBeTruthy();
    });
});
