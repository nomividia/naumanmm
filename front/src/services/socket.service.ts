import { environment } from '../environments/environment';
// import * as socketIo from 'socket.io-client';
import { MainHelpers } from 'nextalys-js-helpers';
import { EventsCollector } from 'nextalys-js-helpers/dist/events';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import {
    CustomSocketEventType,
    SocketEventPayload,
} from '../../../shared/shared-constants';

// Actions you can take on the App
export enum SocketAction {
    JOINED,
    LEFT,
    RENAME,
}

// Socket.io events
export enum SocketEvent {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
}

export class SocketService {
    public static socket: Socket;
    private static socketInitialized = false;
    private static maxSocketRetry = 40;
    public static onSocketConnectionIdReceived = new Subject<void>();

    public static initSocket() {
        this.socket = io(environment.apiBaseUrl, {
            transports: ['websocket'],
        });
        this.socketInitialized = true;
    }

    private static waitForConnection(): Promise<boolean> {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        return new Promise<boolean>(async (resolve) => {
            while (!this.socketInitialized || !this.socket.id) {
                if (SocketService.maxSocketRetry <= 0) {
                    resolve(false);
                    return;
                }

                await MainHelpers.sleep(100);
                await this.waitForConnection();
                SocketService.maxSocketRetry--;
            }
            if (this.socket.id) {
                this.onSocketConnectionIdReceived.next();
            }

            resolve(true);
        });
    }

    public static sendEvent(
        event: CustomSocketEventType,
        ...data: any[]
    ): void {
        this.socket.emit(event, ...data);
    }

    public static async setUserId(userId: any): Promise<void> {
        if (!userId) {
            return;
        }

        const ok = await this.waitForConnection();

        if (!ok) {
            return;
        }

        this.socket.emit(CustomSocketEventType.ClientSetUserId, userId);
    }

    public static onConnected(): Observable<void> {
        if (!this.socketInitialized) {
            return null;
        }

        return new Observable<void>((observer) => {
            this.socket.on(SocketEvent.CONNECT, () => {
                observer.next();
            });
        });
    }

    public static onDisconnected(): Observable<string> {
        if (!this.socketInitialized) {
            return null;
        }

        return new Observable<string>((observer) => {
            this.socket.on(SocketEvent.DISCONNECT, (data: any) => {
                observer.next(data);
            });
        });
    }

    private static onCustomEvent(
        evt: CustomSocketEventType,
    ): Observable<SocketEventPayload> {
        if (!this.socketInitialized) {
            return null;
        }

        return new Observable<SocketEventPayload>((observer) => {
            this.socket.on(evt, (data: any) => {
                observer.next(data);
            });
        });
    }

    public static subscribeToEvent<T = any>(
        evt: CustomSocketEventType,
        eventsCollector: EventsCollector,
        callback: (data: SocketEventPayload<T>) => void,
    ): Observable<SocketEventPayload<T>> {
        const obs = this.onCustomEvent(evt);

        if (!obs) {
            return;
        }

        const sub = obs.subscribe((data: SocketEventPayload<T>) => {
            callback(data);
        });

        eventsCollector.collect(sub);
    }
}
