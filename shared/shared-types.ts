import { AppPage } from "./shared-constants";

export enum FirebaseRefs {
    NxsEvents = "nxsEvents",
    NxsUsers = "users",
    NxsLoggedUsers = "loggedUsers",
}
export type FirebaseNxsEventType = "Notification" | "SingleEvent";

export interface FirebaseNxsEventWrapper {
    [id: string]: FirebaseNxsEvent;
}

export interface FirebaseNxsEvent<T = any> {
    time: number;
    eventType: FirebaseNxsEventType;
    data: T;
    id: string;
    receiverId: string;
    senderId?: string;
    seen?: boolean;
}

export interface NxsFirebaseConnection {
    date?: string | Date;
    page?: AppPage;
    id?: string;
    pageMeta?: any;
    socketConnection?: string;
}

export interface NxsFirebaseConnections {
    [key: string]: NxsFirebaseConnection;
}

export interface INxsFireConnectedUsers {
    [userId: string]: NxsFirebaseUser;
}

export interface NxsFirebaseUser {
    connections?: NxsFirebaseConnections;
    // pages: PageWithData[];
    uid: string;
    appUserId?: string;
    appUserName?: string;
}

export interface NxsFirebaseUserWithConnections {
    connections: NxsFirebaseConnection[];
    appUserId?: string;
    appUserName?: string;
    firebaseId?: string;
}

export interface AppNotificationPayload {
    title: string;
    userIds: string[];
}
