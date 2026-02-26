import { HttpStatus, Injectable } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { FileHelpers } from 'nextalys-node-helpers';
import { HtmlHelpers } from 'nextalys-node-helpers/dist/html-helpers';
import {
    NxsPDFFormat,
    PDFHelpers,
} from 'nextalys-node-helpers/dist/pdf-helpers';
import * as path from 'path';
import { PDFOptions } from 'puppeteer';
import { Environment } from '../../environment/environment';
import { AppError } from '../../models/app-error';
import { GeneratePDFResponse } from '../../models/responses/pdf-response';
export interface AppGeneratePdfOptions {
    format?: NxsPDFFormat;
}

@Injectable()
export class PdfService {
    public async generatePdf(
        htmlTemplate: string,
        outputFileName: string,
        data?: any,
        displayFileName?: string,
        folder?: string,
        opts?: AppGeneratePdfOptions,
        browserPdfOptions?: PDFOptions,
    ): Promise<GeneratePDFResponse> {
        const response = new GeneratePDFResponse();

        try {
            let outputFolder = Environment.PdfPrivateOutputFolder;
            const htmlTemplatePathBase = path.join(
                Environment.ApiBasePath,
                Environment.HtmlTemplatesFolderName,
            );

            if (folder) {
                outputFolder = path.join(outputFolder, folder);
            }

            if (!(await FileHelpers.fileExists(outputFolder))) {
                await FileHelpers.createDirectory(outputFolder);
            }

            const imagesFolder = path.join(htmlTemplatePathBase, 'images');

            if (await FileHelpers.isDirectory(imagesFolder)) {
                await FileHelpers.copyFolderRecursive(
                    imagesFolder,
                    path.join(outputFolder, 'images'),
                    { fullPathSpecified: true, replaceIfExists: true },
                );
            }

            await FileHelpers.copyFolderRecursive(
                path.join(htmlTemplatePathBase, 'fonts'),
                path.join(outputFolder, 'fonts'),
                { fullPathSpecified: true, replaceIfExists: true },
            );

            await FileHelpers.copyFolderRecursive(
                path.join(htmlTemplatePathBase, 'css'),
                path.join(outputFolder, 'css'),
                { fullPathSpecified: true, replaceIfExists: true },
            );

            const htmlTemplatePath = path.join(
                htmlTemplatePathBase,
                htmlTemplate,
            );

            if (!(await FileHelpers.fileExists(htmlTemplatePath))) {
                throw new AppError(
                    'Cannot find template => ' + htmlTemplatePath,
                );
            }

            if (data) {
                HtmlHelpers.registerHandleBarsHelpers([
                    'formatDate',
                    'formatPrice',
                    'ifEquals',
                    'math',
                    'round',
                ]);
            }

            const output = path.join(outputFolder, outputFileName);

            const pdfResponse = await PDFHelpers.HtmlToPdfFromTemplate(
                htmlTemplatePath,
                data,
                output,
                Environment.EnvName !== 'development',
                {
                    format: opts?.format || 'a4',
                    browserPdfOptions: browserPdfOptions,
                },
            );

            if (pdfResponse.success) {
                response.fullPath =
                    '/api/pdf/pdf?pdfFile=' +
                    (!!folder ? encodeURIComponent(folder + '/') : '') +
                    outputFileName +
                    (displayFileName ? '&fileName=' + displayFileName : '');
                response.fileName = outputFileName;
                response.success = true;
                response.fullLocalPath = output;
            } else {
                throw new AppError(
                    pdfResponse.error?.message ?? pdfResponse.error,
                );
            }
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    public async get(fileName: string): Promise<Buffer> {
        const filePath = path.join(
            Environment.PdfPrivateOutputFolder,
            fileName,
        );
        return (await FileHelpers.readFile(filePath, false)) as Buffer;
    }

    async servePdfFile(pdfFile: string, res: FastifyReply, fileName?: string) {
        const data = await this.get(pdfFile);
        if (!fileName) fileName = pdfFile;
        if (data) {
            res.header('Content-Type', 'application/pdf');
            //res.set('Content-Disposition', `attachment; filename="${pdfFileName}"`);
            res.header('Content-Disposition', `inline; filename="${fileName}"`);
            res.status(HttpStatus.OK).send(data);
        } else {
            res.status(HttpStatus.NOT_FOUND).send('Fichier introuvable');
        }
    }
}
