import { ApiProperty } from '@nestjs/swagger';

export class MailRequest {
    @ApiProperty()
    object: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    content: string;

    @ApiProperty()
    sender: string;
}
