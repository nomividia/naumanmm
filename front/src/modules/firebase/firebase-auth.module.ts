import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NxsFirebaseAuthService } from './firebase-auth.service';
@NgModule({
    imports: [CommonModule, AngularFireAuthModule],
    providers: [NxsFirebaseAuthService],
    exports: [],
})
export class NxsFirebaseAuthModule {
    constructor(sv: NxsFirebaseAuthService) {}
}
