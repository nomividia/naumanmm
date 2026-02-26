import { Subject } from 'rxjs';
import { Environment } from '../environment/environment';

const pm2 = require('pm2');

export interface PM2Process {
    name: string;
    pm_id: number;
    pid: number;
    monit?: any;
    pm2_env?: any;
}

export interface PM2ProcessShareData {
    eventName?:
        | 'PlanJobs'
        | 'SendSocketEventToAllClients'
        | 'SendSocketEventToSpecificUsers'
        | 'RetrieveSocketConnectionsList';
    data?: any;
}

export class PM2Helpers {
    static enabled = false;
    static onPM2Data = new Subject<PM2ProcessShareData>();
    static processList: PM2Process[] = [];
    static processSelf: PM2Process;
    static pm2AppId: number = 0;

    static async init() {
        this.enabled = !!Environment.PM2AppName;

        if (!this.enabled) {
            return;
        }

        try {
            const pm_id_str = process.env.pm_id;

            if (!pm_id_str) {
                return;
            }

            let pm_id: number = pm_id_str as any;

            if (typeof pm_id_str !== 'number') {
                pm_id = parseInt(pm_id_str, 10);
            }

            this.pm2AppId = pm_id;
            this.processList = await this.getPM2ProcessList(true);
            // console.log("Log ~ file: pm2-helpers.ts ~ line 30 ~ PM2Helpers ~ init ~   this.processList ", this.processList);
            this.processSelf = this.processList.find((x) => x.pm_id === pm_id);

            console.log('PM2 Helpers init ~ PM2 APP ID', this.pm2AppId);
            console.log(
                'PM2 Helpers init ~ PM2 APP LIST COUNT : ' +
                    this.processList.length +
                    ' - PM2 SELF FOUND : ' +
                    !!this.processList,
            );

            // console.log("Log ~ file: pm2-helpers.ts ~ line 41 ~ PM2Helpers ~ init ~ this.processSelf ", this.processSelf.pm_id);
            // console.log('process.env.NODE_APP_INSTANCE', process.env.pm_id);
            this.subscribeData();
        } catch (error) {
            console.log('PM2Helpers ~ init ~ error', error);
        }
    }

    private static getPM2ProcessList(onlySelf: boolean) {
        return new Promise<PM2Process[]>((resolve, reject) => {
            pm2.list((err, list) => {
                if (err) {
                    reject(err);
                    return;
                }
                const items: PM2Process[] = [];
                for (const item of list) {
                    if (onlySelf && item.name !== Environment.PM2AppName) {
                        continue;
                    }
                    items.push(item);
                    // console.log("Log ~ file: test.js ~ line 6 ~ pm2.list ~ item", item.name, item.pm_id);
                }
                resolve(items);
                // console.log(err, list);
            });
        });
    }

    private static pm2Connect() {
        return new Promise<any[]>((resolve, reject) => {
            pm2.connect(() => {
                resolve();
            });
        });
    }

    private static sendDataToProcess(
        processItem: PM2Process,
        data: PM2ProcessShareData,
    ) {
        // console.log('send data from worker', ApiMainHelpers.isMainWorker());
        return new Promise<void>((resolve, reject) => {
            pm2.sendDataToProcessId(
                {
                    id: processItem.pm_id,
                    type: 'process:msg',
                    topic: true,
                    data: data,
                },
                () => {
                    resolve();
                },
            );
        });
    }

    static async sendDataToAllSpecificProcess(
        data: PM2ProcessShareData,
        pm2Id: number,
    ) {
        if (!this.enabled) {
            return;
        }

        try {
            const pm2Process = this.processList.find((x) => x.pm_id === pm2Id);

            if (pm2Process) {
                await this.sendDataToProcess(pm2Process, data);
            }
        } catch (error) {
            console.log(
                'Log ~ file: pm2-helpers.ts ~ line 53 ~ PM2Helpers ~ sendDataToApp ~ error',
                error,
            );
        }
    }

    static async sendDataToAllAppProcesses(
        data: PM2ProcessShareData,
        exceptSelf: boolean,
    ) {
        if (!this.enabled) {
            return;
        }

        try {
            for (const processItem of this.processList) {
                if (exceptSelf && processItem.pm_id === this.pm2AppId) {
                    continue;
                }

                await this.sendDataToProcess(processItem, data);
                // if (data.eventName === 'RetrieveSocketConnectionsList') {
                //     console.log('sending data to process RetrieveSocketConnectionsList', processItem.pm_id);
                // }
            }
        } catch (error) {
            console.log(
                'Log ~ file: pm2-helpers.ts ~ line 53 ~ PM2Helpers ~ sendDataToApp ~ error',
                error,
            );
        }
    }

    private static subscribeData() {
        process.on('message', (packet: { data?: PM2ProcessShareData }) => {
            this.onPM2Data.next(packet.data);
        });
    }
}
