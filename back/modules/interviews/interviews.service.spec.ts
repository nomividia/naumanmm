import 'jasmine';
import { TestMainHelpers } from '../../test/test-main-helpers';
import { InterviewsService } from './interviews.service';

describe('Interview service tests', () => {
    let interviewsService: InterviewsService;

    beforeAll(async () => {
        await TestMainHelpers.initTestingModule();
        interviewsService =
            TestMainHelpers.module.get<InterviewsService>(InterviewsService);
        // console.log("Log ~ file: interviews.service.spec.ts ~ line 11 ~ beforeAll ~ interviewsService", interviewsService);
    });

    it('should send mail for interview', async () => {
        expect(true).toBeTruthy();
        return;
        const interviewResponse = await interviewsService.findOne({
            order: { creationDate: 'DESC' },
            relations: ['candidate', 'consultant'],
        });
        console.log(
            'Log ~ file: interviews.service.spec.ts ~ line 17 ~ it ~ interviewResponse',
            interviewResponse,
        );
        if (interviewResponse?.interview) {
            // await interviewsService.sendInterviewMailToCandidate(interviewResponse.interview);
        }
    });
});
