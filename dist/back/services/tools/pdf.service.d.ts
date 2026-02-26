/// <reference types="node" />
import { FastifyReply } from 'fastify';
import { NxsPDFFormat } from 'nextalys-node-helpers/dist/pdf-helpers';
import { PDFOptions } from 'puppeteer';
import { GeneratePDFResponse } from '../../models/responses/pdf-response';
export interface AppGeneratePdfOptions {
    format?: NxsPDFFormat;
}
export declare class PdfService {
    generatePdf(htmlTemplate: string, outputFileName: string, data?: any, displayFileName?: string, folder?: string, opts?: AppGeneratePdfOptions, browserPdfOptions?: PDFOptions): Promise<GeneratePDFResponse>;
    get(fileName: string): Promise<Buffer>;
    servePdfFile(pdfFile: string, res: FastifyReply, fileName?: string): Promise<void>;
}
