import { compare, genSalt, hash } from 'bcryptjs';
import { FastifyRequest } from 'fastify';
import { FileHelpers } from 'nextalys-node-helpers';
import { Repository } from 'typeorm';
import { Environment } from '../../environment/environment';
export class ApiMainHelpers {
    public static getIpAddress(req: FastifyRequest): string {
        if (!req) return null;
        return (req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress) as any as string;
    }

    public static isMainWorker(): boolean {
        return (
            !process.env.NODE_APP_INSTANCE ||
            process.env.NODE_APP_INSTANCE === '0'
        );
    }

    public static async hashPassword(password: string): Promise<string> {
        const salt = await genSalt(10);
        return await hash(password, salt);
    }

    public static async comparePasswords(
        clearPassword: string,
        hashedPassword: string,
    ): Promise<boolean> {
        const result = await compare(clearPassword, hashedPassword);
        return result;
    }

    public static async removeOrphanChildren(
        repository: Repository<any>,
        nullFieldName: string,
    ) {
        const where = {};
        where[nullFieldName] = null;
        const response: { id: string }[] = await repository.find({ where });
        if (response && response.length > 0)
            await repository.delete(response.map((x) => x.id));
    }

    public static mysql_real_escape_string(str: string) {
        if (!str) return str;
        if (typeof str !== 'string') return str;
        return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
            switch (char) {
                case '\0':
                    return '\\0';
                case '\x08':
                    return '\\b';
                case '\x09':
                    return '\\t';
                case '\x1a':
                    return '\\z';
                case '\n':
                    return '\\n';
                case '\r':
                    return '\\r';
                case '"':
                case "'":
                case '\\':
                case '%':
                    return '\\' + char; // prepends a backslash to backslash, percent,
                // and double/single quotes
                default:
                    return char;
            }
        });
    }

    static async saveFileInPublicTempFolder(
        fileName: string,
        fileContent: string,
    ) {
        const filePath = FileHelpers.joinPaths(
            Environment.PublicTempFolder,
            fileName,
        );
        return await FileHelpers.writeFile(filePath, fileContent);
    }
}
