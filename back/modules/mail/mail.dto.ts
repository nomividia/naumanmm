import { ApiProperty } from '@nestjs/swagger';
import { GenericResponse } from '../../models/responses/generic-response';

export class SendTestEmailRequest {
    @ApiProperty()
    recipients: string;

    @ApiProperty()
    from: string;
}

export class GetMailConfigResponse extends GenericResponse {
    @ApiProperty()
    mailProvider: string;

    @ApiProperty()
    host: string;

    @ApiProperty()
    port: number;

    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    secure: boolean;

    @ApiProperty()
    mailSender: string;
}
