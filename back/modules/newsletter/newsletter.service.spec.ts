import 'jasmine';
// import { MailService } from "../../services/tools/mail.service";
import { TestMainHelpers } from '../../test/test-main-helpers';
import { NewsletterDto } from './newsletter.dto';
import { NewsletterService } from './newsletter.service';

describe('Newsletter tests', () => {
    // let mailService: MailService;
    let newsletterService: NewsletterService;

    beforeAll(async () => {
        await TestMainHelpers.initTestingModule();
        newsletterService =
            TestMainHelpers.module.get<NewsletterService>(NewsletterService);
    });

    // eslint-disable-next-line @typescript-eslint/require-await
    it('should get newsletter', async () => {
        expect(true).toBeTruthy();
        // return;
        const newsletter = new NewsletterDto();
        newsletter.id = '381597bb-15cd-4c01-903e-0bbdb7f842de';
        newsletter.newsletterSibId = '5';

        const response = await newsletterService.syncSibNewsletter(
            newsletter,
            'e52c8cd4-426e-46d8-97e1-919e85c5cf04',
        );
    });
});
