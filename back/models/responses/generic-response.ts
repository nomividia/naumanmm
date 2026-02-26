import { ForbiddenException } from '@nestjs/common';
import {
    ApiHideProperty,
    ApiProperty,
    ApiPropertyOptional,
} from '@nestjs/swagger';
import { MainHelpers } from 'nextalys-js-helpers';
import { NonEnumerable } from '../../../shared/utils';
import { AppLogger } from '../../services/tools/logger.service';
import { AppError, AppErrorWithMessage } from '../app-error';

export class GenericResponse {
    @ApiProperty()
    success: boolean;

    @ApiPropertyOptional()
    message?: string;

    @ApiPropertyOptional()
    error?: any;

    @ApiPropertyOptional()
    statusCode?: number;

    @ApiPropertyOptional()
    errorGuid?: string;

    @ApiPropertyOptional()
    token?: string;

    @ApiHideProperty()
    @NonEnumerable
    originalError?: any;
    constructor(success = false, message = undefined) {
        this.success = success;
        this.message = message;
    }

    public async handleError(error: any, preventLogToFile?: boolean) {
        this.originalError = error;
        this.success = false;
        let errorToLog: string;
        if (error instanceof AppErrorWithMessage) {
            this.message = error.message;
            errorToLog = this.message;
            if (error.technicalMessage) {
                errorToLog +=
                    '\n - Technical message : ' + error.technicalMessage;
            }
            this.statusCode = error.code;
        } else if (error instanceof AppError) {
            if (error.technicalMessage) this.error = error.technicalMessage;
            else this.error = error.message;
            this.statusCode = error.code;
            this.errorGuid = error.guid;
            errorToLog =
                this.error +
                '\n---Stack---\n' +
                error.stack +
                '\n---End of Stack---';
        } else if (error instanceof Error) {
            this.error = error.message;
            errorToLog =
                this.error +
                '\n---Stack---\n' +
                error.stack +
                '\n---End of Stack---';
        } else {
            this.error = error;
            errorToLog = this.error;
        }

        let isForbiddenException = false;

        if (error instanceof ForbiddenException) {
            isForbiddenException = true;
        }

        const originalUrl = error?.originalUrl;
        if (originalUrl) {
            errorToLog += '\n - URL : ' + originalUrl;
        }

        if (!this.message) {
            if (!this.errorGuid) this.errorGuid = MainHelpers.generateGuid();
            this.message = `Une erreur s'est produite. Voici le code d'erreur à transmettre à l'administrateur :${this.errorGuid}.`;
        }

        if (!preventLogToFile) {
            if (this.errorGuid)
                await AppLogger.loggerInstance.errorWithId(
                    errorToLog,
                    this.errorGuid,
                );
            else await AppLogger.loggerInstance.error(errorToLog);
        }
    }
}

export class GenericResponseWithData<T = any> extends GenericResponse {
    @ApiPropertyOptional({ type: () => Object })
    data?: T;
}

export class GetItemResponse<T = any> extends GenericResponse {
    item?: T;
}
export class GetItemsListResponse<T = any> extends GenericResponse {
    items?: T[];
}
