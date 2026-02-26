/// <reference types="node" />
import { Logger } from '@nestjs/common';
export declare class AppLogger extends Logger {
    static loggerInstance: AppLogger;
    constructor();
    static log(...data: any[]): Promise<void>;
    static warn(...data: any[]): Promise<void>;
    static error(...data: any[]): Promise<void>;
    static errorWithId(error: string, guid: string): Promise<void>;
    cleanLogs(): Promise<boolean>;
    private getLogFilePath;
    getLogFileName(date: Date, type: string, returnFolderName: boolean): string;
    getLogFileContent(date: string, type: 'info' | 'warn' | 'error', returnString: boolean): Promise<string | Buffer>;
    removeLogFile(date: string, type: 'info' | 'warn' | 'error'): Promise<void>;
    private writeToFile;
    errorWithId(error: string, guid: string): Promise<void>;
    error(...data: any[]): Promise<void>;
    log(...data: any[]): Promise<void>;
    warn(...data: any[]): Promise<void>;
}
