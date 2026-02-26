import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
export type FirebaseAuthProvider = 'Google' | 'Facebook' | 'Twitter';

@Injectable()
export class NxsFirebaseAuthService {
    static angularFireAuth: AngularFireAuth;

    constructor(angularFireAuth: AngularFireAuth) {
        NxsFirebaseAuthService.angularFireAuth = angularFireAuth;
    }

    static getFirebaseProvider(provider: FirebaseAuthProvider) {
        switch (provider) {
            case 'Google':
                return new auth.GoogleAuthProvider();
            case 'Facebook':
                return new auth.FacebookAuthProvider();
            case 'Twitter':
                return new auth.TwitterAuthProvider();
        }
    }

    static async signInWithPopupNative(
        firebaseAuthProvider: firebase.auth.AuthProvider,
    ) {
        return await this.angularFireAuth.signInWithPopup(firebaseAuthProvider);
    }

    static async signInWithPopup(provider: FirebaseAuthProvider) {
        return await this.angularFireAuth.signInWithPopup(
            this.getFirebaseProvider(provider),
        );
    }

    static async signOut() {
        await this.angularFireAuth.signOut();
    }

    static async signInAnonymously() {
        return await this.angularFireAuth.signInAnonymously();
    }
}
