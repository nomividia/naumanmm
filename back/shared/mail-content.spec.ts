import 'jasmine';
import { JobOfferMailData, MailContent } from './mail-content';

describe('MailContent - Job Offer Info in Emails', () => {
    // Access private method via any cast for testing
    const formatJobOfferInfo = (
        jobOfferData: JobOfferMailData | undefined,
        lang: 'fr' | 'en',
    ): string => {
        return (MailContent as any).formatJobOfferInfo(jobOfferData, lang);
    };

    describe('formatJobOfferInfo - Spontaneous application (no job offer)', () => {
        it('should return French text for spontaneous application when lang is FR', () => {
            const result = formatJobOfferInfo(undefined, 'fr');
            expect(result).toBe('votre candidature spontanée');
        });

        it('should return English text for spontaneous application when lang is EN', () => {
            const result = formatJobOfferInfo(undefined, 'en');
            expect(result).toBe('your spontaneous application');
        });

        it('should return spontaneous application text when jobOfferData is empty object', () => {
            const result = formatJobOfferInfo({}, 'fr');
            expect(result).toBe('votre candidature spontanée');
        });

        it('should return spontaneous application text when ref and title are undefined', () => {
            const result = formatJobOfferInfo(
                { ref: undefined, title: undefined },
                'en',
            );
            expect(result).toBe('your spontaneous application');
        });
    });

    describe('formatJobOfferInfo - Application to specific job offer', () => {
        it('should return French text with ref and title', () => {
            const jobOfferData: JobOfferMailData = {
                ref: 'MMI-2024-001',
                title: 'Chef cuisinier - Paris',
            };
            const result = formatJobOfferInfo(jobOfferData, 'fr');
            expect(result).toBe(
                'votre candidature pour le poste <b>MMI-2024-001</b> - <b>Chef cuisinier - Paris</b>',
            );
        });

        it('should return English text with ref and title', () => {
            const jobOfferData: JobOfferMailData = {
                ref: 'MMI-2024-001',
                title: 'Chef cuisinier - Paris',
            };
            const result = formatJobOfferInfo(jobOfferData, 'en');
            expect(result).toBe(
                'your application for the position <b>MMI-2024-001</b> - <b>Chef cuisinier - Paris</b>',
            );
        });

        it('should return text with only ref when title is missing', () => {
            const jobOfferData: JobOfferMailData = {
                ref: '4586 DUA',
            };
            const result = formatJobOfferInfo(jobOfferData, 'fr');
            expect(result).toBe(
                'votre candidature pour le poste <b>4586 DUA</b>',
            );
        });

        it('should return text with only title when ref is missing', () => {
            const jobOfferData: JobOfferMailData = {
                title: 'Live-In Nanny',
            };
            const result = formatJobOfferInfo(jobOfferData, 'en');
            expect(result).toBe(
                'your application for the position <b>Live-In Nanny</b>',
            );
        });
    });

    describe('CandidateApplicationAccepted - Candidate accepted for specific position', () => {
        it('should include French job offer info in FR section and English in EN section', () => {
            const jobOfferData: JobOfferMailData = {
                ref: '4586 DUA',
                title: 'Live-In Nanny',
            };
            const result = MailContent.getMailContentAndSubject(
                'CandidateApplicationAccepted',
                false,
                'fr',
                undefined,
                undefined,
                jobOfferData,
            );

            expect(result.content).toContain(
                'votre candidature pour le poste <b>4586 DUA</b> - <b>Live-In Nanny</b>',
            );
            expect(result.content).toContain(
                'your application for the position <b>4586 DUA</b> - <b>Live-In Nanny</b>',
            );
        });

        it('should include spontaneous application text in both languages', () => {
            const result = MailContent.getMailContentAndSubject(
                'CandidateApplicationAccepted',
                false,
                'fr',
                undefined,
                undefined,
                undefined,
            );

            expect(result.content).toContain('votre candidature spontanée');
            expect(result.content).toContain('your spontaneous application');
        });
    });

    describe('CandidateApplicationRefused - Candidate refused for specific position', () => {
        it('should include job offer info in French when lang is FR', () => {
            const jobOfferData: JobOfferMailData = {
                ref: 'MMI-2024-100',
                title: 'Butler - Monaco',
            };
            const result = MailContent.getMailContentAndSubject(
                'CandidateApplicationRefused',
                false,
                'fr',
                undefined,
                undefined,
                jobOfferData,
            );

            expect(result.content).toContain(
                'votre candidature pour le poste <b>MMI-2024-100</b> - <b>Butler - Monaco</b>',
            );
            expect(result.subject).toBe(
                'Votre candidature Morgan & Mallet International',
            );
        });

        it('should include job offer info in English when lang is EN', () => {
            const jobOfferData: JobOfferMailData = {
                ref: 'MMI-2024-100',
                title: 'Butler - Monaco',
            };
            const result = MailContent.getMailContentAndSubject(
                'CandidateApplicationRefused',
                false,
                'en',
                undefined,
                undefined,
                jobOfferData,
            );

            expect(result.content).toContain(
                'your application for the position <b>MMI-2024-100</b> - <b>Butler - Monaco</b>',
            );
            expect(result.subject).toBe(
                'Your Morgan & Mallet International job application',
            );
        });

        it('should include spontaneous application text in French', () => {
            const result = MailContent.getMailContentAndSubject(
                'CandidateApplicationRefused',
                false,
                'fr',
                undefined,
                undefined,
                undefined,
            );

            expect(result.content).toContain('votre candidature spontanée');
        });

        it('should include spontaneous application text in English', () => {
            const result = MailContent.getMailContentAndSubject(
                'CandidateApplicationRefused',
                false,
                'en',
                undefined,
                undefined,
                undefined,
            );

            expect(result.content).toContain('your spontaneous application');
        });
    });

    describe('CandidateApplicationRefusedCreateCandidate - Refused but profile created', () => {
        it('should include job offer info and mention database registration in French', () => {
            const jobOfferData: JobOfferMailData = {
                ref: '5000 ABC',
                title: 'House Manager',
            };
            const result = MailContent.getMailContentAndSubject(
                'CandidateApplicationRefusedCreateCandidate',
                false,
                'fr',
                undefined,
                undefined,
                jobOfferData,
            );

            expect(result.content).toContain(
                'votre candidature pour le poste <b>5000 ABC</b> - <b>House Manager</b>',
            );
            expect(result.content).toContain(
                'constituer un dossier à votre nom',
            );
        });

        it('should include job offer info and mention database registration in English', () => {
            const jobOfferData: JobOfferMailData = {
                ref: '5000 ABC',
                title: 'House Manager',
            };
            const result = MailContent.getMailContentAndSubject(
                'CandidateApplicationRefusedCreateCandidate',
                false,
                'en',
                undefined,
                undefined,
                jobOfferData,
            );

            expect(result.content).toContain(
                'your application for the position <b>5000 ABC</b> - <b>House Manager</b>',
            );
            expect(result.content).toContain(
                'creating a file in your name within our database',
            );
        });

        it('should include spontaneous application text and mention database registration', () => {
            const result = MailContent.getMailContentAndSubject(
                'CandidateApplicationRefusedCreateCandidate',
                false,
                'fr',
                undefined,
                undefined,
                undefined,
            );

            expect(result.content).toContain('votre candidature spontanée');
            expect(result.content).toContain(
                'constituer un dossier à votre nom',
            );
        });
    });

    describe('CandidateApplicationRefusedCandidatesPlatform - Refused and redirected to platform', () => {
        it('should include French job offer info in FR section and English in EN section', () => {
            const jobOfferData: JobOfferMailData = {
                ref: '4586 DUA',
                title: 'Live-In Nanny',
            };
            const result = MailContent.getMailContentAndSubject(
                'CandidateApplicationRefusedCandidatesPlatform',
                false,
                'fr',
                undefined,
                undefined,
                jobOfferData,
            );

            expect(result.content).toContain(
                'votre candidature pour le poste <b>4586 DUA</b> - <b>Live-In Nanny</b>',
            );
            expect(result.content).toContain(
                'your application for the position <b>4586 DUA</b> - <b>Live-In Nanny</b>',
            );
            expect(result.content).toContain('personneldemaison.jobs');
        });

        it('should NOT mix languages in bilingual template', () => {
            const jobOfferData: JobOfferMailData = {
                ref: '4586 DUA',
                title: 'Live-In Nanny',
            };
            const result = MailContent.getMailContentAndSubject(
                'CandidateApplicationRefusedCandidatesPlatform',
                false,
                'fr',
                undefined,
                undefined,
                jobOfferData,
            );

            const frenchSection = result.content.split('🇬🇧')[0];
            expect(frenchSection).not.toContain(
                'your application for the position',
            );

            const englishSection = result.content.split('🇬🇧')[1];
            expect(englishSection).not.toContain(
                'votre candidature pour le poste',
            );
        });

        it('should include spontaneous application text in both languages', () => {
            const result = MailContent.getMailContentAndSubject(
                'CandidateApplicationRefusedCandidatesPlatform',
                false,
                'fr',
                undefined,
                undefined,
                undefined,
            );

            expect(result.content).toContain('votre candidature spontanée');
            expect(result.content).toContain('your spontaneous application');
            expect(result.content).toContain('personneldemaison.jobs');
        });

        it('should NOT mix languages for spontaneous application', () => {
            const result = MailContent.getMailContentAndSubject(
                'CandidateApplicationRefusedCandidatesPlatform',
                false,
                'fr',
                undefined,
                undefined,
                undefined,
            );

            const frenchSection = result.content.split('🇬🇧')[0];
            expect(frenchSection).not.toContain('your spontaneous application');

            const englishSection = result.content.split('🇬🇧')[1];
            expect(englishSection).not.toContain('votre candidature spontanée');
        });
    });

    describe('All 7 required scenarios for non-regression', () => {
        it('Scenario 1 & 3: Candidate accepted for specific position', () => {
            const jobOfferData: JobOfferMailData = {
                ref: 'SCENARIO-1',
                title: 'Position Title',
            };
            const result = MailContent.getMailContentAndSubject(
                'CandidateApplicationAccepted',
                false,
                'fr',
                undefined,
                undefined,
                jobOfferData,
            );

            expect(result.content).toContain('<b>SCENARIO-1</b>');
            expect(result.content).toContain('<b>Position Title</b>');
            expect(result.content).toContain('profil a été retenu');
        });

        it('Scenario 2: Existing candidate refused for specific position', () => {
            const jobOfferData: JobOfferMailData = {
                ref: 'SCENARIO-2',
                title: 'Position Title',
            };
            const result = MailContent.getMailContentAndSubject(
                'CandidateApplicationRefused',
                false,
                'fr',
                undefined,
                undefined,
                jobOfferData,
            );

            expect(result.content).toContain('<b>SCENARIO-2</b>');
            expect(result.content).toContain('suite favorable');
        });

        it('Scenario 4: New candidate refused for specific position + profile created', () => {
            const jobOfferData: JobOfferMailData = {
                ref: 'SCENARIO-4',
                title: 'Position Title',
            };
            const result = MailContent.getMailContentAndSubject(
                'CandidateApplicationRefusedCreateCandidate',
                false,
                'fr',
                undefined,
                undefined,
                jobOfferData,
            );

            expect(result.content).toContain('<b>SCENARIO-4</b>');
            expect(result.content).toContain('constituer un dossier');
        });

        it('Scenario 5: New candidate refused for specific position + redirected to platform', () => {
            const jobOfferData: JobOfferMailData = {
                ref: 'SCENARIO-5',
                title: 'Position Title',
            };
            const result = MailContent.getMailContentAndSubject(
                'CandidateApplicationRefusedCandidatesPlatform',
                false,
                'fr',
                undefined,
                undefined,
                jobOfferData,
            );

            expect(result.content).toContain('<b>SCENARIO-5</b>');
            expect(result.content).toContain('personneldemaison.jobs');
        });

        it('Scenario 6: New candidate refused for spontaneous application + profile created', () => {
            const result = MailContent.getMailContentAndSubject(
                'CandidateApplicationRefusedCreateCandidate',
                false,
                'fr',
                undefined,
                undefined,
                undefined,
            );

            expect(result.content).toContain('votre candidature spontanée');
            expect(result.content).toContain('constituer un dossier');
        });

        it('Scenario 7: New candidate refused for spontaneous application + redirected to platform', () => {
            const result = MailContent.getMailContentAndSubject(
                'CandidateApplicationRefusedCandidatesPlatform',
                false,
                'fr',
                undefined,
                undefined,
                undefined,
            );

            expect(result.content).toContain('votre candidature spontanée');
            expect(result.content).toContain('personneldemaison.jobs');
        });
    });
});
