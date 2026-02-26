import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { RolesList } from '../../../../shared/shared-constants';
import { RolesGuard } from '../../../services/guards/roles-guard';
import { Roles } from '../../../services/roles.decorator';
import {
    CreateCandidateJobOfferHistoryRequest,
    GetCandidateJobOfferHistoryRequest,
} from './candidate-job-offer-history-dto';
import { CandidateJobOfferHistoryService } from './candidate-job-offer-history.service';

@ApiTags('Candidate Job Offer History')
@Controller('candidate-job-offer-history')
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class CandidateJobOfferHistoryController {
    constructor(
        private readonly candidateJobOfferHistoryService: CandidateJobOfferHistoryService,
    ) {}

    @Post()
    @ApiOperation({ summary: 'Create a new history entry' })
    @ApiResponse({
        status: 201,
        description: 'History entry created successfully',
    })
    @Roles(
        RolesList.Admin,
        RolesList.AdminTech,
        RolesList.RH,
        RolesList.Consultant,
    )
    async createHistoryEntry(
        @Body() request: CreateCandidateJobOfferHistoryRequest,
    ) {
        return await this.candidateJobOfferHistoryService.createHistoryEntry(
            request.candidateId,
            request.jobOfferId,
            request.action,
            request.candidateFirstName,
            request.candidateLastName,
            request.startDate,
            request.contractFileId,
        );
    }

    @Get('job-offer/:jobOfferId')
    @ApiOperation({ summary: 'Get history for a specific job offer' })
    @ApiResponse({
        status: 200,
        description: 'Job offer history retrieved successfully',
    })
    @Roles(
        RolesList.Admin,
        RolesList.AdminTech,
        RolesList.RH,
        RolesList.Consultant,
    )
    async getJobOfferHistory(
        @Param('jobOfferId') jobOfferId: string,
        @Query() query: GetCandidateJobOfferHistoryRequest,
    ) {
        query.jobOfferId = jobOfferId;
        return await this.candidateJobOfferHistoryService.getJobOfferHistory(
            query,
        );
    }

    @Get('candidate/:candidateId')
    @ApiOperation({ summary: 'Get history for a specific candidate' })
    @ApiResponse({
        status: 200,
        description: 'Candidate history retrieved successfully',
    })
    @Roles(
        RolesList.Admin,
        RolesList.AdminTech,
        RolesList.RH,
        RolesList.Consultant,
    )
    async getCandidateHistory(
        @Param('candidateId') candidateId: string,
        @Query() query: GetCandidateJobOfferHistoryRequest,
    ) {
        query.candidateId = candidateId;
        return await this.candidateJobOfferHistoryService.getJobOfferHistory(
            query,
        );
    }
}
