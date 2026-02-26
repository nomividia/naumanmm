import { capitalize } from "./utils/capitalize";

export interface MMIAgency {
    agencyName: string;
    agencyCode: MMIAgencyCode;
    address: string;
    instructions?: { lang: "fr" | "en"; content: string }[];
}

export type MMIAgencyCode =
    | "paris"
    | "geneva"
    | "london"
    | "valbonne"
    | "visio"
    | "newyork";

export class InterviewHelpers {
    static mmiAgencies: MMIAgency[] = [
        {
            agencyCode: "paris",
            agencyName: "Paris",
            address: `31 rue de Penthièvre
75008
Paris, France`,
            instructions: [
                {
                    lang: "fr",
                    content: `Code porte : P
En rentrant, deuxième porte gauche
Interphone à l'aide des flèches : Morgan & Mallet International
Ascenseur 4ème étage porte droite.`,
                },
                {
                    lang: "en",
                    content: `Digicode : P
Once the door is open, second left door, intercom using arrows: Morgan & Mallet International.
4th floor elevator right door.`,
                },
            ],
        },
        {
            agencyCode: "valbonne",
            agencyName: "Valbonne",
            address: `1800 route des crêtes
06560
Valbonne`,
            instructions: [
                {
                    lang: "fr",
                    content: `En arrivant sur le parking dirigez-vous vers le BÂTIMENT A
Première porte sur votre gauche
En rentrant dans le hall, l'agence est au rez-de-chaussée, porte droite.`,
                },
                {
                    lang: "en",
                    content: `When you arrive at the car park, head towards BUILDING A
First door on your left
On entering the hall, the agency is on the ground floor, right door.`,
                },
            ],
        },
        {
            agencyCode: "geneva",
            agencyName: "Genève/Rolle",
            address: `One Business Center, Z.A, La Pièce I - A5
CH-1180 Rolle, Suisse`,
        },
        {
            agencyCode: "london",
            agencyName: "Londres",
            address: `25 North Row, Mayfair
London W1K 6DJ, United Kingdom`,
            instructions: [
                {
                    lang: "fr",
                    content: `When you arrive at the reception desk, please ask for "Morgan & Mallet International".`,
                },
                {
                    lang: "en",
                    content: `When you arrive at the reception desk, please ask for "Morgan & Mallet International".`,
                },
            ],
        },
    ];

    static mmiAgenciesForInteview: MMIAgency[] = [
        // ...this.mmiAgencies,
        {
            agencyCode: "visio",
            agencyName: "Visio",
            address: "",
        },
        // {
        //     agencyCode: "newyork",
        //     agencyName: "New York",
        //     address: "",
        // },
    ];

    static getInterviewPlaceName(interviewPlaceCode: MMIAgencyCode) {
        if (!interviewPlaceCode) {
            return "None";
        }

        return (
            this.mmiAgenciesForInteview.find(
                (x) => x.agencyCode === interviewPlaceCode
            )?.agencyName || capitalize(interviewPlaceCode)
        );
    }

    static getInterviewPlaceAddress(
        interviewPlaceCode: MMIAgencyCode,
        lang: "fr" | "en"
    ) {
        if (!interviewPlaceCode) {
            return "";
        }

        const agency = this.mmiAgenciesForInteview.find(
            (x) => x.agencyCode === interviewPlaceCode
        );

        if (agency) {
            if (!lang || (lang !== "fr" && lang !== "en")) {
                lang = "en";
            }

            const instructions =
                agency?.instructions?.find((x) => x.lang === lang)?.content ||
                "";

            return (agency?.address || "") + "\n" + instructions;
        }

        return "";
    }
}
