import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { firebaseConfig } from '../../environments/constants';
import { environment } from '../../environments/environment';

const firebaseModules: any[] = [];

if (environment.firebaseEnabled) {
    firebaseModules.push(AngularFireModule.initializeApp(firebaseConfig));
}

@NgModule({
    imports: [...firebaseModules],
    providers: [],
    exports: [],
})
export class NxsFirebaseMainModule {}
