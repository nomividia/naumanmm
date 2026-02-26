import { FastifyReply } from 'fastify';
import { GenericResponse } from '../models/responses/generic-response';
import { PdfService } from '../services/tools/pdf.service';
import { BaseController } from '../shared/base.controller';
export declare class PdfController extends BaseController {
    private readonly pdfService;
    constructor(pdfService: PdfService);
    generatePdfTest(): Promise<GenericResponse>;
    servePdfFile(res: FastifyReply, pdfFile: string, fileName?: string): Promise<void>;
}
