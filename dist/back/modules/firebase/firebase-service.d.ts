import { AppNotificationPayload, NxsFirebaseUser } from '../../../shared/shared-types';
export declare class FirebaseService {
    static init(): Promise<void>;
    static sendNotification(receiverIds: string[], data?: AppNotificationPayload): Promise<void>;
    static sendEvent(receiverIds: string[], data?: any): Promise<void>;
    static getUsersData(userIds: string[]): Promise<NxsFirebaseUser[]>;
    static cleanOldConnections(): Promise<void>;
    static cleanOldNotifications(): Promise<void>;
}
