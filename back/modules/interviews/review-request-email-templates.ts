export interface ReviewRequestEmailContent {
    subject: string;
    body: string;
}

export class ReviewRequestEmailTemplates {
    /**
     * Get French email template for review request
     */
    static getFrenchTemplate(
        candidateFirstName: string,
        googleReviewUrl: string,
    ): ReviewRequestEmailContent {
        return {
            subject:
                "Votre retour d'expérience suite à votre entretien chez Morgan & Mallet",
            body: `Bonjour ${candidateFirstName},

Nous vous remercions d'avoir pris le temps de rencontrer l'un de nos collaborateurs récemment dans le cadre de votre candidature chez Morgan & Mallet.

Dans une démarche d'amélioration continue de nos services et de notre accompagnement, nous serions ravis de connaître votre ressenti suite à cet échange. Votre avis est précieux pour nous !

Nous vous invitons à partager votre expérience en cliquant sur le lien suivant :
👉 ${googleReviewUrl}

Cela ne vous prendra que quelques instants et nous aidera à toujours mieux accompagner nos candidats et clients.

Nous vous remercions par avance pour votre retour et restons à votre disposition pour toute question.

Cordialement,
L'équipe Morgan & Mallet International`,
        };
    }

    /**
     * Get English email template for review request
     */
    static getEnglishTemplate(
        candidateFirstName: string,
        googleReviewUrl: string,
    ): ReviewRequestEmailContent {
        return {
            subject:
                'Your feedback following your interview at Morgan & Mallet',
            body: `Hi ${candidateFirstName},

It was great to meet you! Thank you again for taking the time to speak with me.

We are striving to improve our recruitment process and would really appreciate your feedback. Could you please take a few moments to leave a review on Google through this link? ${googleReviewUrl}

We assure you that all comments will in no way influence the outcome of your application. Thank you so much!

Best regards,
The Morgan & Mallet International Team`,
        };
    }
}
