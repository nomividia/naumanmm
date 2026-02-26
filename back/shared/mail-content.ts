/* eslint-disable max-len */
import { MainHelpers } from 'nextalys-js-helpers';
import { SharedCandidatesHelpers } from '../../shared/candidates-helpers';

export type AppMailType =
    | 'CandidateApplicationRefused'
    | 'NewCandidateAccount'
    | 'SendJobOfferToCandidate'
    | 'NewAccountPassword'
    | 'NewAccountAfterJobAdderMigration'
    | 'NewCandidateApplication'
    | 'CandidateApplicationRefusedCoupleFormation'
    | 'CandidateApplicationRefusedCandidatesPlatform'
    | 'CandidateApplicationRefusedCreateCandidate'
    | 'CandidateApplicationAccepted'
    | 'SendFollwUpAvailability'
    | 'JobOfferPositionIsFilled';

export interface JobOfferMailData {
    ref?: string;
    title?: string;
}

export class MailContent {
    private static mailContentData: {
        mailType: AppMailType;
        langs: { langCode: 'fr' | 'en'; subject: string; content: string }[];
    }[] = [
        {
            mailType: 'CandidateApplicationRefused',
            langs: [
                {
                    langCode: 'fr',
                    subject: 'Votre candidature Morgan & Mallet International',
                    content: `Madame, Monsieur,

                    Après examen approfondi de votre candidature pour ce poste, nous sommes au regret de vous informer que nous n'avons pu donner une suite favorable à votre candidature.
                    En effet, votre profil ne répond pas entièrement aux qualifications spécifiques et exhaustives exigées par notre client pour la fonction concernée.

                    Nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.

                    L'équipe Morgan & Mallet.`,
                },
                {
                    langCode: 'en',
                    subject:
                        'Your Morgan & Mallet International job application',
                    content: `Dear Madam or Sir,

                    Following a thorough review of your application for this position, we regret to inform you that we are unable to proceed with your candidacy.

                    Indeed, while your profile presents strengths, it does not entirely meet the specific and comprehensive qualifications required by our client for the role in question.

                    Please accept the expression of our most distinguished regards.

                    Morgan & Mallet Team.`,
                },
            ],
        },
        {
            mailType: 'SendJobOfferToCandidate',
            langs: [
                {
                    langCode: 'fr',
                    content: `Bonjour M. ou Mme,
Nous avons une nouvelle offre d'emploi qui va vous intéresser !
Veuillez trouver ci-dessous le descriptif de l'offre.
Si vous souhaitez postuler ou avoir plus de détails, vous pouvez contacter votre consultant en charge de votre dossier ou postuler directement via votre compte.

Détails de l'offre : <a href="{1}">{1}</a>
                    `,
                    subject: `Nouvelle offre d'emploi qui peut vous intéresser !`,
                },
                {
                    langCode: 'en',
                    content: `Hello,
We have a new job offer that will interest you!
Please find below the description of the offer.
If you wish to apply or have more details, you can contact your consultant in charge of your file or apply directly via your account.

Job offer details : <a href="{1}">{1}</a>`,
                    subject: `New job offer that may interest you!`,
                },
            ],
        },
        {
            mailType: 'NewCandidateAccount',
            langs: [
                {
                    langCode: 'fr',
                    subject: `Morgan and Mallet - 🇫🇷 Création de votre compte utilisateur / 🇬🇧 Your account`,
                    content: `🇫🇷 Cher candidat, chère candidate,

                    Bienvenu chez Morgan & Mallet International.
                    Afin de créer votre profil, accéder aux annonces et postuler aux offres, nous vous invitons à créer votre espace candidat.

                    Votre identifiant est votre adresse e-mail et votre mot de passe est à créer à travers le lien suivant : <a href="{1}">{1}</a>

                    Une fois avoir créée votre mot de passe, nous vous invitons à vous rendre sur votre profil à travers ce lien : <a href="https://mmi.morganmallet.agency/login">https://mmi.morganmallet.agency/login</a>

                    Pour votre information, Morgan & Mallet International accorde une attention particulière à la protection des données. Chaque dossier de candidat est et reste confidentiel.

                    Nous vous souhaitons une bonne première connexion et une agréable journée.

                    L'équipe Morgan & Mallet International

                    ---

                    🇬🇧 Dear candidate,

                    Welcome to Morgan & Mallet International.
                    To create your profile, access job postings et apply for positions, we invite you to create your candidate account.

                    Your username is your email address, and your password must be created using the following link: <a href="{1}">{1}</a>

                    Once you have created your password, we invite you to go to your profile using this link: <a href="https://mmi.morganmallet.agency/login">https://mmi.morganmallet.agency/login</a>

                    For your information, Morgan & Mallet International pays particular attention to data protection. Each candidate application is and remains confidential.

                    We wish you a pleasant first login and a pleasant day.

                    The Morgan & Mallet International Team`,
                },
                {
                    langCode: 'en',
                    subject: `Morgan and Mallet - 🇫🇷 Création de votre compte utilisateur / 🇬🇧 Your account`,
                    content: `🇫🇷 Cher candidat, chère candidate,

                    Bienvenu chez Morgan & Mallet International.
                    Afin de créer votre profil, accéder aux annonces et postuler aux offres, nous vous invitons à créer votre espace candidat.

                    Votre identifiant est votre adresse e-mail et votre mot de passe est à créer à travers le lien suivant : <a href="{1}">{1}</a>

                    Une fois avoir créée votre mot de passe, nous vous invitons à vous rendre sur votre profil à travers ce lien : <a href="https://mmi.morganmallet.agency/login">https://mmi.morganmallet.agency/login</a>

                    Pour votre information, Morgan & Mallet International accorde une attention particulière à la protection des données. Chaque dossier de candidat est et reste confidentiel.

                    Nous vous souhaitons une bonne première connexion et une agréable journée.

                    L'équipe Morgan & Mallet International

                    ---

                    🇬🇧 Dear candidate,

                    Welcome to Morgan & Mallet International.
                    To create your profile, access job postings et apply for positions, we invite you to create your candidate account.

                    Your username is your email address, and your password must be created using the following link: <a href="{1}">{1}</a>

                    Once you have created your password, we invite you to go to your profile using this link: <a href="https://mmi.morganmallet.agency/login">https://mmi.morganmallet.agency/login</a>

                    For your information, Morgan & Mallet International pays particular attention to data protection. Each candidate application is and remains confidential.

                    We wish you a pleasant first login and a pleasant day.

                    The Morgan & Mallet International Team`,
                },
            ],
        },
        {
            mailType: 'NewAccountPassword',
            langs: [
                {
                    langCode: 'fr',
                    content: `Bonjour,

                    Veuillez cliquer sur ce <a href="{1}">lien</a> pour réinitialiser votre mot de passe.
                        `,
                    subject: `Morgan and Mallet - Réinitialisation de votre mot de passe`,
                },
                {
                    langCode: 'en',
                    content: `Hello,

                   Please click <a href="{1}">here</a> to reset your password.
                         `,
                    subject: `Morgan and Mallet - Reset your password`,
                },
            ],
        },
        {
            mailType: 'NewAccountAfterJobAdderMigration',
            langs: [
                {
                    langCode: 'fr',
                    content: `Bonjour Madame, Monsieur,

                    Morgan & Mallet International a le plaisir de vous présenter sa plateforme dédiée à tous les candidats travaillant en maison privée.

                    En tant que candidat référencé chez Morgan & Mallet International, vous avez accès à cette plateforme et votre compte personnel vous permettant de compléter votre dossier, de voir le statut de vos candidatures, et bien plus encore.
                    Vous y trouverez vos dossiers avec tous vos documents. Certains dossiers auront besoin d'être complétés. Si vous avez des questions n'hésitez pas à contacter notre siège au 00 33 1 45 61 32 12 afin d'être renseigné le mieux possible.

                    Pour votre information, Morgan & Mallet International attache une attention particulière à la protection des données. Chaque dossier candidat est et reste confidentiel.

                    Pour votre 1ere connexion, vous pouvez utiliser la fonctionnalité "Mot de passe oublié" en saisissant votre adresse e-mail afin de définir votre mot de passe.
                    Vous pourrez ensuite saisir votre adresse e-mail et votre nouveau mot de passe afin de vous connecter.

                    Lien pour définir votre mot de passe : <a href="{1}">{1}</a>

                    Nous vous vous souhaitons une bonne première connexion et une belle journée.

                    L'équipe Morgan & Mallet International`,
                    subject: `Morgan and Mallet - Réinitialisation de votre mot de passe`,
                },
                {
                    langCode: 'en',
                    content: `Dear,

                    Morgan & Mallet International is pleased to present its platform dedicated to all candidates working in private homes.

                    As a candidate referenced at Morgan & Mallet International, you have access to this platform and your personal account allowing you to complete your file, see the status of your applications, and much more.
                    You will find your folders with all your documents there.  Some files will need to be completed.  If you have any questions, do not hesitate to contact our head office on 00 33 1 45 61 32 12 in order to be informed as best as possible.

                    For your information, Morgan & Mallet International pays particular attention to data protection.  Each candidate file is and remains confidential.

                    For your first connection, you can use the "Forgotten password" feature by entering your e-mail address to define your password.
                    You can then enter your email address and new password to log in.

                    Link to set your password: <a href="{1}">{1}</a>

                    We wish you a good first connection and a nice day.

                    The Morgan & Mallet International team`,
                    subject: `Morgan and Mallet - Reset your password`,
                },
            ],
        },
        {
            mailType: 'NewCandidateApplication',
            langs: [
                {
                    langCode: 'fr',
                    subject: `Votre candidature Morgan & Mallet International`,
                    content: `Madame, Monsieur,

                    Nous vous remercions de l'intérêt que vous portez au cabinet de recrutement Morgan & Mallet
                    International et vous confirmons par la présente la bonne réception de votre candidature.

                    Votre dossier est actuellement en cours de traitement.

                    Dès qu'un recruteur aura finalisé l'examen de votre candidature, vous recevrez une seconde
                    communication vous informant de son statut.

                    Nous attirons votre attention sur le fait que le délai maximum de ce traitement est de quinze (15)
                    jours ouvrés.

                    Nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.

                    L’équipe Morgan & Mallet.`,
                },
                {
                    subject: `Your Morgan & Mallet International job application`,
                    langCode: 'en',
                    content: `Dear Madam or Sir,

                    We thank you for the interest you have shown in the recruitment firm Morgan & Mallet
                    International and hereby confirm the successful receipt of your application.

                    Your file is currently under review.

                    As soon as a recruiter has finalized the assessment of your application, you will receive a second
                    communication informing you of its status.

                    We draw your attention to the fact that the maximum processing time for this review is fifteen (15)
                    working days.

                    Sincerly,
                    Morgan & Mallet Team.`,
                },
            ],
        },
        {
            mailType: 'CandidateApplicationRefusedCoupleFormation',
            langs: [
                {
                    langCode: 'fr',
                    content: `Bonjour,

                    Je tiens tout d'abord à vous remercier personnellement de votre candidature au sein de l'agence Morgan & Mallet International.

                    Malheureusement, je ne pourrai pas vous accompagner dans votre candidature car notre clientèle nous confie la recherche de candidats présentant une expérience de plus de 3 ans avec des références vérifiables uniquement.
                    Cependant, le groupe Morgan Mallet a créé sa propre école de formation (Morgan & Mallet School) pour les personnes en reconversion professionnelle et les personnes nécessitant une formation dans le but d’améliorer leurs connaissances dans le domaine du personnel de maison.
                    Les formations sont en parfaites adéquation avec la demande de notre clientèle et vous permettront d'attirer les employeurs pour le développement de votre carrière.

                    C'est donc tout naturellement que je vous invite à découvrir l'école Morgan & Mallet School en cliquant sur le lien suivant : <a href="https://www.personneldemaison.school">www.personneldemaison.school</a>

                    A l'issu de la formation, l'équipe Morgan & Mallet International vous accompagnera dans vos futurs recherches d'emploi dans ce domaine.
                    Si vous avez la moindre question sur l'école Morgan & Mallet School ou sur le contenu de nos formations, notre chargée de formation, Madame Anne Brisson, sera ravie de vous accompagner.
                    Je vous souhaite une excellente journée.
                    `,
                    subject: `Ecole de formation`,
                },
                {
                    langCode: 'en',
                    content: `Dear Candidate,
                    I hope this email finds you well.I wanted to personally thank you for your interest in the Morgan & Mallet International agency.

                    Whilst we are unable to assist you with your current application, because our customers entrust us with the search for candidates with an experience of more than 3 years with verifiable references only.
                    We would like to invite you to explore our training school, the Morgan & Mallet School, which is tailored to those undergoing professional retraining or those seeking to improve their knowledge in the field of domestic staff.

                    <a href="https://www.personneldemaison.school">www.personneldemaison.school</a>

                    The training courses offered by the Morgan & Mallet School are designed to meet the demands of their clients and may help you to attract employers for the development of your career.
                    Upon completing the training, the Morgan & Mallet International team may assist you in your future job searches in the field.
                    If you have any questions about the Morgan & Mallet School or the training provided, you can reach out to our training manager, Anne Brisson, who will be happy to assist you.
                    `,
                    subject: `Training school`,
                },
            ],
        },
        {
            mailType: 'CandidateApplicationRefusedCandidatesPlatform',
            langs: [
                {
                    langCode: 'fr',
                    subject: `🇫🇷 Plateforme d'emplois / 🇬🇧 Jobs platform`,
                    content: `🇫🇷 Cher candidat, chère candidate,

                    Nous avons bien réceptionné {jobOfferInfoFr} au sein de notre cabinet.

                    Malheureusement, nous ne pourrons pas vous accompagner dans votre recherche car notre clientèle nous confie le recrutement de candidats présentant plus de 2 années d'expérience récentes, employés et déclarés par des familles privées, et, ayant des références vérifiables.

                    Cependant, si vous souhaitez travailler chez un particulier-employeur et acquérir de l'expérience dans ce domaine, nous vous recommandons la plateforme d'emplois <a href="https://personneldemaison.jobs/">www.personneldemaison.jobs</a> qui vous mettra en relation avec des employeurs particuliers.

                    Cette plateforme propose une inscription gratuite, ou, une formule payante afin de mettre votre profil en avant.

                    Nous vous souhaitons la meilleure réussite.

                    L'équipe Morgan & Mallet.

                    ---

                    🇬🇧 Dear candidate,

                    We have received {jobOfferInfoEn}.

                    Unfortunately, we will not be able to assist you in your search as our clients entrust us with the recruitment of candidates with more than two years of recent experience, employed and registered by private families, and with verifiable references.

                    However, if you are interested in working for a private employer and gaining experience in this field, we recommend the job platform <a href="https://personneldemaison.jobs/">www.personneldemaison.jobs</a>, which will connect you with private employers.

                    This platform offers free registration or a paid subscription to showcase your profile.

                    We wish you every success.

                    Morgan & Mallet Team.`,
                },
                {
                    langCode: 'en',
                    subject: `🇫🇷 Plateforme d'emplois / 🇬🇧 Jobs platform`,
                    content: `🇫🇷 Cher candidat, chère candidate,

                    Nous avons bien réceptionné {jobOfferInfoFr} au sein de notre cabinet.

                    Malheureusement, nous ne pourrons pas vous accompagner dans votre recherche car notre clientèle nous confie le recrutement de candidats présentant plus de 2 années d'expérience récentes, employés et déclarés par des familles privées, et, ayant des références vérifiables.

                    Cependant, si vous souhaitez travailler chez un particulier-employeur et acquérir de l'expérience dans ce domaine, nous vous recommandons la plateforme d'emplois <a href="https://personneldemaison.jobs/">www.personneldemaison.jobs</a> qui vous mettra en relation avec des employeurs particuliers. Cette plateforme propose une inscription gratuite, ou, une formule payante afin de mettre votre profil en avant.

                    Nous vous souhaitons la meilleure réussite.

                    L'équipe Morgan & Mallet.

                    ---

                    🇬🇧 Dear candidate,

                    We have received {jobOfferInfoEn}.

                    Unfortunately, we will not be able to assist you in your search as our clients entrust us with the recruitment of candidates with more than two years of recent experience, employed and registered by private families, and with verifiable references.

                    However, if you are interested in working for a private employer and gaining experience in this field, we recommend the job platform <a href="https://personneldemaison.jobs/">www.personneldemaison.jobs</a>, which will connect you with private employers. This platform offers free registration or a paid subscription to showcase your profile.

                    We wish you every success.

                    Morgan & Mallet Team.`,
                },
            ],
        },
        {
            mailType: 'CandidateApplicationRefusedCreateCandidate',
            langs: [
                {
                    langCode: 'fr',
                    subject: 'Votre candidature Morgan & Mallet International',
                    content: `Madame, Monsieur,

                    Nous vous remercions très sincèrement de l'intérêt que vous avez manifesté pour le cabinet de recrutement Morgan & Mallet International.

                    Après examen approfondi de {jobOfferInfo}, nous sommes au regret de vous informer que nous n'avons pu donner une suite favorable à votre candidature. En effet, votre profil ne répond pas entièrement aux qualifications spécifiques et exhaustives exigées par notre client pour la fonction concernée.

                    Néanmoins, en considération de votre expérience significative dans les domaines du personnel de maison et/ou de l'hôtellerie, nous avons pris soin de constituer un dossier à votre nom au sein de notre base de données.

                    Nous vous invitons à consulter régulièrement notre site Internet et à nous suivre sur les réseaux sociaux afin de prendre connaissance des nouvelles opportunités professionnelles que nous proposons.

                    Dans l'attente du plaisir d'une future collaboration, nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.

                    L'équipe Morgan & Mallet.`,
                },
                {
                    langCode: 'en',
                    subject:
                        'Your Morgan & Mallet International job application',
                    content: `Dear Madam or Sir,

                    We sincerely thank you for the interest you have shown in the recruitment firm Morgan & Mallet International.

                    Following a thorough review of {jobOfferInfo}, we regret to inform you that we are unable to proceed with your candidacy. While your profile presents undeniable strengths, it does not entirely meet the specific and comprehensive qualifications required by our client for the role in question.

                    Nevertheless, in consideration of your significant experience in the household staff and/or hospitality sectors, we have taken the liberty of creating a file in your name within our database.

                    We invite you to regularly consult our website and follow us on social media to learn about the new professional opportunities we offer.

                    We look forward to the prospect of a future collaboration.

                    Morgan & Mallet Team.`,
                },
            ],
        },
        {
            mailType: 'CandidateApplicationAccepted',
            langs: [
                {
                    langCode: 'fr',
                    subject:
                        '🇫🇷 Votre candidature Morgan & Mallet International / 🇬🇧 Your Morgan & Mallet International job application',
                    content: `🇫🇷 Cher Candidat,

                    Suite à l'examen de {jobOfferInfoFr}, nous avons le plaisir de vous informer que votre profil a été retenu lors de la phase de présélection par le recruteur.

                    Nous vous précisons que si votre candidature est sélectionnée pour l'étape finale, le recruteur prendra contact avec vous d'ici sept (7) jours ouvrés.

                    Dans l'éventualité où vous ne recevriez aucune nouvelle de notre part passé ce délai, cela signifierait que votre candidature n'aura malheureusement pas été retenue pour la phase ultime de sélection.

                    Bien à vous,

                    L'équipe Morgan & Mallet.

                    ---

                    🇬🇧 Dear Candidate,

                    Following the review of {jobOfferInfoEn}, we are pleased to inform you that your profile has been selected by the recruiter for the pre-selection stage.

                    Please note that should your application be retained for the final selection stage, the recruiter will contact you within seven (7) working days.

                    In the event that you do not receive any further communication from us after this deadline, it will unfortunately signify that your application has not been retained for the ultimate selection phase.

                    Sincerely,

                    Morgan & Mallet Team.`,
                },
                {
                    langCode: 'en',
                    subject:
                        '🇫🇷 Votre candidature Morgan & Mallet International / 🇬🇧 Your Morgan & Mallet International job application',
                    content: `🇫🇷 Cher Candidat,

                    Suite à l'examen de {jobOfferInfoFr}, nous avons le plaisir de vous informer que votre profil a été retenu lors de la phase de présélection par le recruteur.

                    Nous vous précisons que si votre candidature est sélectionnée pour l'étape finale, le recruteur prendra contact avec vous d'ici sept (7) jours ouvrés.

                    Dans l'éventualité où vous ne recevriez aucune nouvelle de notre part passé ce délai, cela signifierait que votre candidature n'aura malheureusement pas été retenue pour la phase ultime de sélection.

                    Bien à vous,

                    L'équipe Morgan & Mallet.

                    ---

                    🇬🇧 Dear Candidate,

                    Following the review of {jobOfferInfoEn}, we are pleased to inform you that your profile has been selected by the recruiter for the pre-selection stage.

                    Please note that should your application be retained for the final selection stage, the recruiter will contact you within seven (7) working days.

                    In the event that you do not receive any further communication from us after this deadline, it will unfortunately signify that your application has not been retained for the ultimate selection phase.

                    Sincerely,

                    Morgan & Mallet Team.`,
                },
            ],
        },
        {
            mailType: 'SendFollwUpAvailability',
            langs: [
                {
                    langCode: 'fr',
                    content: `<b>Dear {1},</b>

                    I hope this email finds you well.

                    On our database you were noted as unavailable for career opportunities. I am reaching out to see if your availability has changed and if you are now open to discussing this opportunity.

                    If you are available, please let us know, and we will be happy to move forward with the next steps.
                    If you are unavailable at this time, we would appreciate it if you could keep us updated on your availability in the future.

                    Thank you for your time and consideration. We look forward to your response.

                    Regards,
                    Morgan and Mallet International Team`,
                    subject: `Follow-up on Your Availability Status`,
                },
                {
                    langCode: 'en',
                    content: `<b>Dear {1},</b>

                    I hope this email finds you well.

                    On our database you were noted as unavailable for career opportunities. I am reaching out to see if your availability has changed and if you are now open to discussing this opportunity.

                    If you are available, please let us know, and we will be happy to move forward with the next steps.
                    If you are unavailable at this time, we would appreciate it if you could keep us updated on your availability in the future.

                    Thank you for your time and consideration. We look forward to your response.

                    Regards,
                    Morgan and Mallet International Team`,
                    subject: `Follow-up on Your Availability Status`,
                },
            ],
        },
        {
            mailType: 'JobOfferPositionIsFilled',
            langs: [
                {
                    langCode: 'fr',
                    content: `<b>Dear Candidate,</b>

                    Thank you for your interest in joining Morgan & Mallet International and for taking the time to submit your application.

                    We would like to inform you that the position has been filled. We sincerely appreciate your interest in Morgan & Mallet International and the effort you invested in your application.

                    Your qualifications are impressive, and we would like to retain your information for consideration in future opportunities that align with your skills and experience. We will reach out to you should a suitable position arise.

                    Thank you once again for considering a career with us. We wish you continued success in your job search and future professional endeavors.

                    Regards,
                    MMI Team`,
                    subject: `Position has been filled`,
                },
                {
                    langCode: 'en',
                    content: `<b>Dear Candidate,</b>

                    Thank you for your interest in joining Morgan & Mallet International and for taking the time to submit your application.

                    We would like to inform you that the position has been filled. We sincerely appreciate your interest in Morgan & Mallet International and the effort you invested in your application.

                    Your qualifications are impressive, and we would like to retain your information for consideration in future opportunities that align with your skills and experience. We will reach out to you should a suitable position arise.

                    Thank you once again for considering a career with us. We wish you continued success in your job search and future professional endeavors.

                    Regards,
                    MMI Team`,
                    subject: `Position has been filled`,
                },
            ],
        },
    ];

    static getMailContentAndSubject(
        mailType: AppMailType,
        addMailFooter = true,
        lang?: 'fr' | 'en',
        countryCode?: string,
        injectValues?: string[],
        jobOfferData?: JobOfferMailData,
    ) {
        lang = SharedCandidatesHelpers.getDefaultLanguage(lang, countryCode);
        let mailContent = '';
        let mailSubject = '';
        mailContent = this.mailContentData
            ?.find((x) => x.mailType === mailType)
            ?.langs?.find((x) => x.langCode === lang)?.content;
        mailSubject = this.mailContentData
            ?.find((x) => x.mailType === mailType)
            ?.langs?.find((x) => x.langCode === lang)?.subject;
        if (!mailContent) mailContent = '';
        if (injectValues?.length) {
            for (let index = 0; index < injectValues.length; index++) {
                const str = injectValues[index];
                mailContent = MainHelpers.replaceAll(
                    mailContent,
                    '{' + (index + 1) + '}',
                    str,
                );
            }
        }
        // Inject job offer info or spontaneous application text
        // For bilingual templates, use separate placeholders for FR and EN
        const jobOfferInfoFr = this.formatJobOfferInfo(jobOfferData, 'fr');
        const jobOfferInfoEn = this.formatJobOfferInfo(jobOfferData, 'en');
        mailContent = MainHelpers.replaceAll(
            mailContent,
            '{jobOfferInfoFr}',
            jobOfferInfoFr,
        );
        mailContent = MainHelpers.replaceAll(
            mailContent,
            '{jobOfferInfoEn}',
            jobOfferInfoEn,
        );
        // For monolingual templates, use the language-specific version
        const jobOfferInfo = this.formatJobOfferInfo(jobOfferData, lang);
        mailContent = MainHelpers.replaceAll(
            mailContent,
            '{jobOfferInfo}',
            jobOfferInfo,
        );
        if (addMailFooter) {
            mailContent += `


            Morgan et Mallet International
            Cabinet de recrutement
            `;
        }
        mailContent = MainHelpers.replaceAll(mailContent, '\n', '<br/>');
        return { content: mailContent, subject: mailSubject };
    }

    private static formatJobOfferInfo(
        jobOfferData: JobOfferMailData | undefined,
        lang: 'fr' | 'en',
    ): string {
        if (!jobOfferData?.ref && !jobOfferData?.title) {
            // Return spontaneous application text based on language
            return lang === 'fr'
                ? 'votre candidature spontanée'
                : 'your spontaneous application';
        }
        const parts: string[] = [];
        if (jobOfferData.ref) {
            parts.push(`<b>${jobOfferData.ref}</b>`);
        }
        if (jobOfferData.title) {
            parts.push(`<b>${jobOfferData.title}</b>`);
        }
        const jobInfo = parts.join(' - ');
        return lang === 'fr'
            ? `votre candidature pour le poste ${jobInfo}`
            : `your application for the position ${jobInfo}`;
    }
}
