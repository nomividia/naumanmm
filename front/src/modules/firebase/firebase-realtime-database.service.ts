import { Injectable } from '@angular/core';
import {
    AngularFireDatabase,
    PathReference,
    QueryFn,
} from '@angular/fire/database';

@Injectable()
export class NxsFirebaseRealTimeDatabaseService {
    static instance: NxsFirebaseRealTimeDatabaseService;

    constructor(public angularFireDatabase?: AngularFireDatabase) {
        NxsFirebaseRealTimeDatabaseService.instance = this;
    }

    static database() {
        return this.instance.angularFireDatabase.database;
    }

    static object<T>(pathOrRef: PathReference) {
        return this.instance.angularFireDatabase.object<T>(pathOrRef);
    }

    static list<T>(pathOrRef: PathReference, queryFn?: QueryFn) {
        return this.instance.angularFireDatabase.list<T>(pathOrRef, queryFn);
    }
}
