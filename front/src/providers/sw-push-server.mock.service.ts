import { Observable } from 'rxjs';

export class SwPushServerMock {
    public messages: Observable<any>;
    public subscription: Observable<PushSubscription | null>;

    public requestSubscription(options: {
        serverPublicKey: string;
    }): Promise<PushSubscription> {
        return Promise.resolve(null);
    }

    public unsubscribe(): Promise<void> {
        return Promise.resolve();
    }
}
