"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultantGoogleLinkHelper = exports.SWISS_GOOGLE_REVIEW_URL = exports.CONSULTANT_GOOGLE_LINK_MAPPINGS = void 0;
exports.CONSULTANT_GOOGLE_LINK_MAPPINGS = [
    {
        consultantIds: [
            'a75b2706-a68f-4247-a28c-b9edb883a558',
            'f558e997-ca7c-498e-a41c-35fb65f4412f',
        ],
        googleReviewUrl: 'https://g.page/r/Cc61D2jUbcJhEBM/review',
        agencyLocation: 'NYC',
    },
    {
        consultantIds: ['1f63d14f-af11-48be-a52d-29b07df4b9db'],
        googleReviewUrl: 'https://g.page/r/CajCIrcSjEuIEBM/review',
        agencyLocation: 'Los Angeles',
    },
    {
        consultantIds: [
            '8ee2b642-0b9a-4979-b23e-2307bd060e79',
            '18432f16-428d-4bc1-8a1a-11932ff8c473',
        ],
        googleReviewUrl: 'https://g.page/r/CYFtUPqFcvE1EBM/review',
        agencyLocation: 'London',
    },
    {
        consultantIds: [
            '4d76cf18-cd80-453b-b865-d97981324ec8',
            '00e7826f-544b-46cd-8265-d6e366ebfd7a',
            '818de8dd-3969-460f-9429-228bc86feab7',
        ],
        googleReviewUrl: 'https://g.page/r/CXVw4LTxczwEEBM/review',
        agencyLocation: 'Paris',
    },
    {
        consultantIds: [
            '264d8ca1-c483-4524-9c03-450ddf498e94',
            'f31ef77d-e255-4b54-80ce-78e9c2e1187e',
            '0b2015c8-1328-4539-a55c-fe321c912599',
        ],
        googleReviewUrl: 'https://g.page/r/CdOuW09tHQ3iEBM/review',
        agencyLocation: 'Valbonne/Monaco',
    },
    {
        consultantIds: [
            'cbcbdba6-dfe3-4354-aee2-40f195323ad4',
            '9042fc40-cc47-4180-898c-f22011440e5f',
            'b877f3d5-5e79-4f0f-ade4-1d0aaa8e40bb',
            '99036d0a-d34b-4365-abbd-9f742443ec22',
        ],
        googleReviewUrl: 'https://g.page/r/CdOuW09tHQ3iEBM/review',
        agencyLocation: 'Dubai',
    },
];
exports.SWISS_GOOGLE_REVIEW_URL = 'https://g.page/r/CdSu6ip-awYXEBM/review';
class ConsultantGoogleLinkHelper {
    static getGoogleReviewUrlByConsultant(consultantId) {
        const foundMapping = exports.CONSULTANT_GOOGLE_LINK_MAPPINGS.find((mapping) => mapping.consultantIds.some((id) => id === consultantId));
        return foundMapping ? foundMapping.googleReviewUrl : null;
    }
    static getGoogleReviewUrlByLocation(location) {
        if (location && location.toLowerCase().includes('swiss')) {
            return exports.SWISS_GOOGLE_REVIEW_URL;
        }
        return null;
    }
}
exports.ConsultantGoogleLinkHelper = ConsultantGoogleLinkHelper;
//# sourceMappingURL=consultant-google-links.constants.js.map