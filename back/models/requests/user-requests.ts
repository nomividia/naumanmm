import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseSearchRequest } from './base-search-requests';

export class FindUsersRequest extends BaseSearchRequest {
    @ApiPropertyOptional({ description: 'Roles separated by comma' })
    roles?: string;

    @ApiPropertyOptional({
        type: String,
        description: 'Include disabled users',
    })
    includeDisabled?: 'true' | 'false' = 'false';

    @ApiPropertyOptional({ type: String, description: 'Include candidate' })
    includeCandidate?: 'true' | 'false' = 'false';

    @ApiPropertyOptional({ type: String, description: 'Include user gender' })
    includeGender?: 'true' | 'false' = 'false';

    @ApiPropertyOptional({ type: String, description: 'Include user image' })
    includeImage?: 'true' | 'false' = 'false';

    @ApiPropertyOptional({ type: String, description: 'Include user role' })
    includeRoles?: 'true' | 'false' = 'false';
}

export class GetUserRolesRequest extends BaseSearchRequest {
    @ApiPropertyOptional({
        type: String,
        description: 'Include disabled roles',
    })
    includeDisabled?: string;

    @ApiPropertyOptional({
        type: String,
        description: 'Include rights in response',
    })
    includeRights?: string;
}
