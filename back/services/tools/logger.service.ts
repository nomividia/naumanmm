import { Injectable, Logger } from '@nestjs/common';
import { DateHelpers, MainHelpers } from 'nextalys-js-helpers';
import { FileHelpers } from 'nextalys-node-helpers';
import * as path from 'path';
import { Environment } from '../../environment/environment';
import { AppError } from '../../models/app-error';
const logsDirectoryName = 'logs';
const daysToKeepLogs = 40;

@Injectable()
export class AppLogger extends Logger {
    public static loggerInstance: AppLogger;

    constructor() {
        super();
        AppLogger.loggerInstance = this;
    }

    static async log(...data: any[]) {
        await this.loggerInstance?.log(...data);
    }

    static async warn(...data: any[]) {
        await this.loggerInstance?.warn(...data);
    }

    static async error(...data: any[]) {
        await this.loggerInstance?.error(...data);
    }

    static async errorWithId(error: string, guid: string) {
        await this.loggerInstance?.errorWithId(error, guid);
    }

    public async cleanLogs() {
        let result = true;
        try {
            const logsRootDir = path.join(
                Environment.ApiBasePath,
                logsDirectoryName,
            );
            const filesInRootFolder = await FileHelpers.getFilesInFolder(
                logsRootDir,
            );
            for (const file of filesInRootFolder) {
                const fileFullPath = path.join(logsRootDir, file);
                if (await FileHelpers.isDirectory(fileFullPath)) {
                    const logDate =
                        DateHelpers.parseDateTimeFromISO8601Format(file);
                    if (logDate) {
                        const diff = DateHelpers.daysDiff(logDate, new Date());
                        if (diff > daysToKeepLogs) {
                            await FileHelpers.removeFile(fileFullPath);
                            await this.log(
                                'Suppression du dossier "' +
                                    fileFullPath +
                                    '" réussie.',
                            );
                        }
                    }
                }
            }
        } catch (err) {
            result = false;
            await this.error('Erreur lors de la suppression du dossier', err);
        }
        return result;
    }

    private async getLogFilePath(
        date: Date,
        type: string,
        createFolders?: boolean,
    ) {
        const folderName = this.getLogFileName(date, type, true);
        const logsFolder = path.join(
            Environment.ApiBasePath,
            logsDirectoryName,
        );
        const currentLogsFolder = path.join(logsFolder, folderName);
        if (createFolders && !(await FileHelpers.fileExists(currentLogsFolder)))
            await FileHelpers.createDirectory(currentLogsFolder);
        const logFileName = this.getLogFileName(date, type, false);
        return path.join(currentLogsFolder, logFileName);
    }

    getLogFileName(date: Date, type: string, returnFolderName: boolean) {
        const folderName = `${date.getFullYear()}-${MainHelpers.pad(
            (date.getMonth() + 1).toString(),
            2,
            '0',
        )}-${MainHelpers.pad(date.getDate().toString(), 2, '0')}`;
        if (returnFolderName) return folderName;
        return `${folderName}-${type}.log`;
    }

    public async getLogFileContent(
        date: string,
        type: 'info' | 'warn' | 'error',
        returnString: boolean,
    ): Promise<string | Buffer> {
        const dateObj = DateHelpers.toUtcDate(
            DateHelpers.parseDateTimeFromISO8601Format(date),
        );
        if (!dateObj) throw new AppError('Invalid date');
        const filePath = await this.getLogFilePath(dateObj, type);
        if (!(await FileHelpers.fileExists(filePath))) return '';
        return await FileHelpers.readFile(filePath, returnString);
    }

    public async removeLogFile(date: string, type: 'info' | 'warn' | 'error') {
        const dateObj = DateHelpers.toUtcDate(
            DateHelpers.parseDateTimeFromISO8601Format(date),
        );
        if (!dateObj) throw new AppError('Invalid date');
        const filePath = await this.getLogFilePath(dateObj, type);
        if (!(await FileHelpers.fileExists(filePath))) return;
        await FileHelpers.removeFile(filePath);
    }

    private async writeToFile(args: any[], logType: 'info' | 'warn' | 'error') {
        try {
            let date = DateHelpers.convertUTCDateToLocalDate(
                new Date(),
                'Europe/Paris',
            );
            if (!DateHelpers.isValidDate(date)) {
                date = new Date();
            }
            let content = '';
            args.forEach((arg) => {
                let argStr = arg;
                if (arg instanceof Error) {
                    argStr = JSON.stringify(
                        arg,
                        Object.getOwnPropertyNames(arg),
                        2,
                    );
                } else if (typeof arg === 'object') {
                    argStr = JSON.stringify(arg, null, 2);
                } else if (!!arg) argStr = arg.toString();
                else argStr = '';
                content += `
    ${argStr as string}`;
            });
            const dateString = DateHelpers.formatDateISO8601(date, true);
            content = `
[${dateString}] - [${logType}] => ${content}`;

            await FileHelpers.appendFile(
                await this.getLogFilePath(date, logType, true),
                content,
            );
        } catch (err) {
            console.error('writeToFile Error => ', err);
        }
    }

    async errorWithId(error: string, guid: string) {
        const arr = ['Guid = ' + guid, error];
        await this.writeToFile(arr, 'error');
        super.error(arr);
        console.error(arr);
    }

    async error(...data: any[]) {
        await this.writeToFile(data, 'error');
        super.error(data);
        console.error(data);
    }

    async log(...data: any[]) {
        await this.writeToFile(data, 'info');
        super.log(data);
    }

    async warn(...data: any[]) {
        await this.writeToFile(data, 'warn');
        super.warn(data);
    }
}
