import { GenericResponse } from '../../models/responses/generic-response';
export declare class SendTestEmailRequest {
    recipients: string;
    from: string;
}
export declare class GetMailConfigResponse extends GenericResponse {
    mailProvider: string;
    host: string;
    port: number;
    username: string;
    password: string;
    secure: boolean;
    mailSender: string;
}
