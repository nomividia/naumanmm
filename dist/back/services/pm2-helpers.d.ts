import { Subject } from 'rxjs';
export interface PM2Process {
    name: string;
    pm_id: number;
    pid: number;
    monit?: any;
    pm2_env?: any;
}
export interface PM2ProcessShareData {
    eventName?: 'PlanJobs' | 'SendSocketEventToAllClients' | 'SendSocketEventToSpecificUsers' | 'RetrieveSocketConnectionsList';
    data?: any;
}
export declare class PM2Helpers {
    static enabled: boolean;
    static onPM2Data: Subject<PM2ProcessShareData>;
    static processList: PM2Process[];
    static processSelf: PM2Process;
    static pm2AppId: number;
    static init(): Promise<void>;
    private static getPM2ProcessList;
    private static pm2Connect;
    private static sendDataToProcess;
    static sendDataToAllSpecificProcess(data: PM2ProcessShareData, pm2Id: number): Promise<void>;
    static sendDataToAllAppProcesses(data: PM2ProcessShareData, exceptSelf: boolean): Promise<void>;
    private static subscribeData;
}
