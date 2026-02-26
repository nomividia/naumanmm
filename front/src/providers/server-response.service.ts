import { Inject, Injectable, Optional } from '@angular/core';
import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { Response } from 'express';

export interface IServerResponseService {
    getHeader(key: string): string;
    setHeader(key: string, value: string): void;
    setHeaders(dictionary: { [key: string]: string }): void;
    appendHeader(key: string, value: string, delimiter?: string): void;
    setStatus(code: number, message?: string): void;
    setNotFound(message?: string): void;
    setError(message?: string): void;
}

@Injectable()
export class ServerResponseService implements IServerResponseService {
    private response: Response;

    constructor(@Optional() @Inject(RESPONSE) response: any) {
        this.response = response;
    }

    getHeader(key: string): string {
        if (!this.response) {
            return null;
        }

        return this.response.getHeader(key) as string;
    }

    setHeader(key: string, value: string) {
        if (!this.response) {
            return;
        }

        this.response.header(key, value);
    }

    appendHeader(key: string, value: string, delimiter = ',') {
        if (!this.response) {
            return;
        }

        const current = this.getHeader(key);
        if (!current) {
            this.setHeader(key, value);
        }

        const newValue = [...current.split(delimiter), value]
            .filter((el, i, a) => i === a.indexOf(el))
            .join(delimiter);
        this.response.header(key, newValue);
    }

    setHeaders(dictionary: { [key: string]: string }) {
        if (!this.response) {
            return;
        }

        Object.keys(dictionary).forEach((key) =>
            this.setHeader(key, dictionary[key]),
        );
    }

    setStatus(code: number, message?: string) {
        if (!this.response) {
            return;
        }

        this.response.statusCode = code;
        if (message) {
            this.response.statusMessage = message;
        }
    }

    setNotFound(message = 'not found') {
        if (!this.response) {
            return;
        }

        this.response.statusCode = 404;
        this.response.statusMessage = message;
    }

    setUnauthorized(message = 'Unauthorized') {
        if (!this.response) {
            return;
        }

        if (this.response) {
            this.response.statusCode = 401;
            this.response.statusMessage = message;
        }
    }

    setCacheNone() {
        if (!this.response) {
            return;
        }

        if (this.response) {
            this.setHeader(
                'Cache-Control',
                'no-cache, no-store, must-revalidate',
            );
            this.setHeader('Pragma', 'no-cache');
        }
    }

    // setCachePrivate() {
    //     if (this.response) {
    //         this.setCache('private');
    //     }
    // }

    // setCache(directive: HttpCacheDirective, maxAge?: string, smaxAge?: string) {
    //     if (this.response) {
    //         // tslint:disable-next-line:max-line-length
    //         if (smaxAge) {
    //             this.setHeader('Cache-Control', `${directive}, max-age=${maxAge ? ms(maxAge) / 1000 : 0}, s-maxage=${ms(smaxAge) / 1000}`);
    //         } else {
    //             this.setHeader('Cache-Control', `${directive}, max-age=${maxAge ? ms(maxAge) / 1000 : 0}`);
    //         }

    //         this.setHeader('Expires', maxAge ? new Date(Date.now() + ms(maxAge)).toUTCString() : new Date(Date.now()).toUTCString())
    //     }
    // }

    setError(message = 'internal server error') {
        if (!this.response) {
            return;
        }

        if (this.response) {
            this.response.statusCode = 500;
            this.response.statusMessage = message;
        }
    }
}

export type HttpCacheDirective =
    | 'public'
    | 'private'
    | 'no-store'
    | 'no-cache'
    | 'must-revalidate'
    | 'no-transform'
    | 'proxy-revalidate';
