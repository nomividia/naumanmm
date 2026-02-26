import {
    Body,
    Controller,
    HttpCode,
    Param,
    Post,
    Req,
    Res,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { BaseController } from '../../shared/base.controller';
import { CandidateResumeService } from './candidate-resume.service';
import { GenerateCandidateResumeDto } from './candidate-resume-dto';

@Controller('candidate-resumes')
@ApiTags('candidate-resumes')
export class CandidateResumesController extends BaseController {
    constructor(
        private readonly candidateResumeService: CandidateResumeService,
    ) {
        super();
    }

    // @UseGuards(RolesGuard)
    // @Roles(
    //     RolesList.Admin,
    //     RolesList.Candidate,
    //     RolesList.Consultant,
    //     RolesList.RH,
    // )
    @Post('generate/:candidateId')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Generate candidate resume',
        operationId: 'generateCandidateResume',
    })
    @ApiResponse({
        status: 200,
        description: 'Generate candidate resume as PDF blob',
        content: {
            'application/pdf': {
                schema: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @HttpCode(200)
    async generateCandidateResume(
        @Param('candidateId') candidateId: string,
        @Body() body: GenerateCandidateResumeDto,
        @Res() res: FastifyReply,
    ) {
        const pdfData =
            await this.candidateResumeService.generateCandidateResume(
                candidateId,
                body,
            );

        // Set appropriate headers for PDF response
        res.header('Content-Type', pdfData.mimeType);
        res.header(
            'Content-Disposition',
            `inline; filename="${pdfData.fileName}"`,
        );
        res.header('Content-Length', pdfData.buffer.length.toString());

        return res.send(pdfData.buffer);
    }
}
