import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PushSubscriptionDto {
    @ApiProperty()
    endpoint: string;

    @ApiProperty()
    options?: any;

    @ApiPropertyOptional()
    userId?: string;

    @ApiPropertyOptional()
    keys?: { auth: string; p256dh: string };
}
