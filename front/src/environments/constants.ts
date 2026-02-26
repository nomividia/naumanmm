import { InjectionToken } from '@angular/core';

export const OfflineMessage =
    'Aucune connexion internet. Vous semblez être hors ligne.';
export const GenericError =
    "Une erreur s'est produite, veuillez réessayer ultérieurement.";
export const LAZY_WIDGETS = new InjectionToken<{ [key: string]: string }>(
    'LAZY_WIDGETS',
);
export const accessTokenLsKey = 'access_token';
export const GenericUnloadMessage =
    'Vous avez des modifications non sauvegardées, êtes-vous sûr de vouloir quitter la page ?';
export const firebaseConfig = {
    apiKey: 'AIzaSyDMm_EwPC414entk_KIwvBcvCXYqTe4O_w',
    authDomain: 'nextalystemplate.firebaseapp.com',
    databaseURL: 'https://nextalystemplate.firebaseio.com',
    projectId: 'nextalystemplate',
    storageBucket: 'nextalystemplate.appspot.com',
    messagingSenderId: '932417055183',
    appId: '1:932417055183:web:467f6c59e28ae3f5c2caba',
};

export const ArchiveFakeAppValueCode = 'fake_appvalue_archive';
