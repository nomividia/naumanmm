import { ApiPropertyOptional } from '@nestjs/swagger';

export class AddressDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiPropertyOptional()
    lineOne: string;

    @ApiPropertyOptional()
    lineTwo?: string;

    @ApiPropertyOptional()
    label?: string;

    @ApiPropertyOptional()
    department?: string;

    @ApiPropertyOptional()
    postalCode: string;

    @ApiPropertyOptional()
    city: string;
    /**
     * country code ISO 2
     */
    @ApiPropertyOptional()
    country?: string;

    @ApiPropertyOptional()
    candidateId?: string;

    @ApiPropertyOptional()
    customerId?: string;

    @ApiPropertyOptional()
    candidateApplicationId?: string;

    @ApiPropertyOptional()
    jobReferenceId?: string;
}
