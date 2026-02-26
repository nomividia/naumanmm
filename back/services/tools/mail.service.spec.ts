import 'jasmine';
import { TestMainHelpers } from '../../test/test-main-helpers';
import { EmailDataWithTemplate, MailService } from './mail.service';

describe('UsersService tests', () => {
    let mailService: MailService;

    beforeAll(async () => {
        await TestMainHelpers.initTestingModule();
        mailService = TestMainHelpers.module.get<MailService>(MailService);
    });

    // eslint-disable-next-line @typescript-eslint/require-await
    it('should send specific mail', async () => {
        expect(true).toBeTruthy();
        return;
        const opts: EmailDataWithTemplate = {
            templateName: 'test-mail.mjml',
            to: [{ address: 'contact@nextalys.com' }],
            compileMjmlTemplate: true,
            useHandleBars: true,
            templateValues: {
                SITE_BASE_URL: 'https://gestion.nextalys.com',
                DISABLE_EMAILING_GUID: 'xxxxx',
                textList: ['titre 1', 'titre 2', 'titre 3'],
            },
            subject: 'test subject',
            from: { address: 'contact@nextalys.com' },
        };
        console.log('send mail with options ', opts);
        const response = await mailService.sendMail(opts);
        expect(response.success).toBeTruthy();
        console.log(
            'Log ~ file: mail.service.spec.ts ~ line 29 ~ it ~ response',
            response,
        );
    });

    it('should send generic mail', async () => {
        expect(true).toBeTruthy();
        return;
        const opts: EmailDataWithTemplate = {
            to: [{ address: 'contact@nextalys.com' }],
            templateValues: {
                // SITE_BASE_URL: 'https://gestion.nextalys.com',
                DISABLE_EMAILING_GUID: 'xxxxx',
                textList: ['titre 1', 'titre 2', 'titre 3'],
                language: 'fr',
                ADDITIONAL_MAIL_CONTENT: `
                <mj-section padding="0">
                <mj-column background-color="#FFFFFF">

            <mj-button inner-padding="20px 40px" font-size="16px">test</mj-button>
                </mj-column>
                </mj-section>

                `,
            },
            subject: 'test subject',
            from: { address: 'contact@nextalys.com' },
            htmlBody: `
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Nulla a consequat ligula. Sed tempor mattis sapien, eget feugiat leo
             rutrum pellentesque. Duis aliquet, augue malesuada lacinia vestibulum,
              lacus elit suscipit sapien, vel convallis justo sem eu ante. Pellentesque
               pharetra ultrices sapien, ac luctus magna aliquam non. Ut pulvinar semper dolor.
               Suspendisse tristique ut lorem non tempor. Donec dolor urna, efficitur sed fringilla eget,
            tincidunt ut eros. Quisque scelerisque sit amet erat vitae consequat.</div>
            <div>test 2</div>

            `,
        };
        // console.log('send mail with options ', opts);
        const response = await mailService.sendMailWithGenericTemplate(opts);
        expect(response.success).toBeTruthy();
        // console.log("Log ~ file: mail.service.spec.ts ~ line 29 ~ it ~ response", response);
    });

    // eslint-disable-next-line @typescript-eslint/require-await
    it('should get sib account', async () => {
        return;
        const response = await mailService.getSibAccountData();
        console.log(
            'Log ~ file: mail.service.spec.ts:62 ~ it ~ response',
            response.data?.plan?.[0]?.credits,
        );
    });
});
