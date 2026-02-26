import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CandidatePresentationDto } from './candidate-presentation-dto';
import { CandidatePresentationsService } from './candidate-presentations.service';
import { RolesGuard } from '../../services/guards/roles-guard';
import { RolesList } from '../../../shared/shared-constants';
import { Roles } from '../../services/roles.decorator';
import { BaseController } from '../../shared/base.controller';

@ApiTags('candidate-presentations')
@Controller('candidate-presentations')
export class CandidatePresentationsController extends BaseController {
    constructor(
        private readonly candidatePresentationsService: CandidatePresentationsService,
    ) {
        super();
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Get('candidate/:candidateId/default')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get the default presentation for a candidate',
        operationId: 'getDefaultPresentation',
    })
    @ApiResponse({
        status: 200,
        description: 'Returns the default presentation or null',
        type: CandidatePresentationDto,
    })
    @HttpCode(200)
    async getDefaultPresentation(
        @Param('candidateId') candidateId: string,
    ): Promise<CandidatePresentationDto | null> {
        return this.candidatePresentationsService.getDefaultPresentation(
            candidateId,
        );
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Get('candidate/:candidateId')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get all presentations for a candidate',
        operationId: 'findAllByCandidateId',
    })
    @ApiResponse({
        status: 200,
        description: 'Returns all presentations for the candidate',
        type: [CandidatePresentationDto],
    })
    @HttpCode(200)
    async findAllByCandidateId(
        @Param('candidateId') candidateId: string,
    ): Promise<CandidatePresentationDto[]> {
        return this.candidatePresentationsService.findAllByCandidateId(
            candidateId,
        );
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Get(':id')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get a single presentation by ID',
        operationId: 'findOne',
    })
    @ApiResponse({
        status: 200,
        description: 'Returns the presentation',
        type: CandidatePresentationDto,
    })
    @HttpCode(200)
    async findOne(@Param('id') id: string): Promise<CandidatePresentationDto> {
        return this.candidatePresentationsService.findOne(id);
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Post()
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Create a new presentation',
        operationId: 'create',
    })
    @ApiResponse({
        status: 200,
        description: 'The presentation has been created',
        type: CandidatePresentationDto,
    })
    @HttpCode(200)
    async create(
        @Body() dto: CandidatePresentationDto,
    ): Promise<CandidatePresentationDto> {
        return this.candidatePresentationsService.create(dto);
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Put(':id')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Update a presentation',
        operationId: 'update',
    })
    @ApiResponse({
        status: 200,
        description: 'The presentation has been updated',
        type: CandidatePresentationDto,
    })
    @HttpCode(200)
    async update(
        @Param('id') id: string,
        @Body() dto: CandidatePresentationDto,
    ): Promise<CandidatePresentationDto> {
        return this.candidatePresentationsService.update(id, dto);
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Delete(':id')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Delete a presentation (soft delete)',
        operationId: 'delete',
    })
    @ApiResponse({
        status: 200,
        description: 'The presentation has been deleted',
    })
    @HttpCode(200)
    async delete(@Param('id') id: string): Promise<void> {
        return this.candidatePresentationsService.delete(id);
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Post(':id/set-default')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Set a presentation as default',
        operationId: 'setAsDefault',
    })
    @ApiResponse({
        status: 200,
        description: 'The presentation has been set as default',
        type: CandidatePresentationDto,
    })
    @HttpCode(200)
    async setAsDefault(
        @Param('id') id: string,
    ): Promise<CandidatePresentationDto> {
        return this.candidatePresentationsService.setAsDefault(id);
    }
}
