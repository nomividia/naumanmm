import { FastifyRequest } from 'fastify';
import { Repository } from 'typeorm';
export declare class ApiMainHelpers {
    static getIpAddress(req: FastifyRequest): string;
    static isMainWorker(): boolean;
    static hashPassword(password: string): Promise<string>;
    static comparePasswords(clearPassword: string, hashedPassword: string): Promise<boolean>;
    static removeOrphanChildren(repository: Repository<any>, nullFieldName: string): Promise<void>;
    static mysql_real_escape_string(str: string): string;
    static saveFileInPublicTempFolder(fileName: string, fileContent: string): Promise<{
        success: boolean;
        error?: any;
    }>;
}
